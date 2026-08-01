# StepUp for AI — Backend Architecture Document

**Prepared by:** Staff Software Architect
**Stack:** Next.js (App Router) · TypeScript · MongoDB/Mongoose · Better Auth · Zod · Cloudinary · Razorpay · Resend · Upstash QStash/Inngest · Redis · Atlas Search · Pino · pnpm · Vercel

---

## 1. Project Architecture

### 1.1 Architectural Style

StepUp for AI is built as a **Modular Monolith** using **Feature-Based Clean Architecture**, layered with Domain-Driven Design (DDD) concepts where the domain justifies it (Auth, Applications, Payments, AI). This is not a beginner CRUD app — it's structured so that any module (Recruiter, Investor, Mentor, AI) can be extracted into an independent microservice later without a rewrite.

**Why Modular Monolith, not microservices from day 1:**
- Next.js App Router + Vercel serverless functions favor a single deployable unit with clean internal boundaries.
- Microservices at this stage add network latency, distributed transaction complexity, and DevOps overhead disproportionate to team size.
- A well-bounded modular monolith gives 90% of microservices' organizational benefits (independent modules, clear contracts) with 10% of the operational cost.
- Each module exposes a **service interface** — internal calls now, HTTP/gRPC calls later, with zero business logic rewrite.

### 1.2 Layering (Clean Architecture)

```
┌─────────────────────────────────────────────┐
│  Presentation Layer (app/api/**/route.ts)    │  ← HTTP, only orchestration
├─────────────────────────────────────────────┤
│  Controller Layer (modules/*/controller)     │  ← Request parsing, response shaping
├─────────────────────────────────────────────┤
│  Validation Layer (Zod schemas)              │  ← Input/output contracts
├─────────────────────────────────────────────┤
│  Service Layer (modules/*/service)           │  ← Business logic, orchestration
├─────────────────────────────────────────────┤
│  Repository Layer (modules/*/repository)     │  ← Mongo/Mongoose abstraction
├─────────────────────────────────────────────┤
│  Data Layer (MongoDB / Redis / Cloudinary)   │  ← Persistence & external I/O
└─────────────────────────────────────────────┘
```

Dependency rule: **outer layers depend on inner layers, never the reverse.** Controllers never touch Mongoose models directly. Services never import Next.js request/response types. This makes services unit-testable in isolation and portable to any runtime (Next.js today, a standalone Node service tomorrow).

### 1.3 Request Flow

```
Client Request
   → Next.js Route Handler (app/api/v1/.../route.ts)
   → Middleware Chain (auth, rbac, rateLimit, validation, requestLogger)
   → Controller (parses req, calls service, formats response)
   → Service (business rules, calls 1..N repositories/other services)
   → Repository (Mongoose query, returns lean domain objects)
   → Service (transforms, triggers events)
   → Event Bus (async: emails, notifications, AI jobs, analytics)
   → Controller → Standardized JSON Response
   → Global Error Handler (on throw at any layer)
```

### 1.4 Module Communication

- **Synchronous, in-process**: Module A's service calling Module B's service directly via an imported interface (e.g., `applicationService` calling `notificationService.send()`), since this is a monolith.
- **Asynchronous, event-driven**: Modules never directly trigger side-effect chains. They emit domain events (`internship.applied`, `payment.completed`) onto an internal Event Bus. Independent listeners (email, analytics, AI scoring) subscribe. This keeps modules decoupled — Recruiter module doesn't need to know Email module exists.
- **Background execution**: Long-running or non-critical-path work (AI resume parsing, PDF generation, bulk emails) is pushed to QStash/Inngest queues, never awaited in the request/response cycle.

### 1.5 Scalability Rationale

- **Stateless compute**: Every API route is stateless; horizontal scaling is just adding serverless function concurrency (Vercel handles this automatically).
- **Database as the shared state**: MongoDB Atlas with proper indexing, read replicas, and later sharding by tenant/role.
- **Cache-aside pattern** with Redis for hot reads (internship listings, public profiles).
- **Queue-based decoupling** ensures traffic spikes (e.g., mass internship applications) don't block user-facing latency.
- **Feature-based folders** mean teams can scale horizontally (a "Recruiter squad" and "AI squad" can work without merge conflicts).

---

## 2. Final Folder Structure

```
stepup-ai-backend/
├── app/
│   └── api/
│       └── v1/
│           ├── auth/
│           │   ├── register/route.ts
│           │   ├── login/route.ts
│           │   ├── logout/route.ts
│           │   ├── refresh/route.ts
│           │   ├── verify-email/route.ts
│           │   ├── forgot-password/route.ts
│           │   ├── reset-password/route.ts
│           │   └── 2fa/route.ts
│           ├── students/
│           │   ├── profile/route.ts
│           │   ├── resume/route.ts
│           │   ├── resume-builder/route.ts
│           │   ├── applications/route.ts
│           │   ├── ai/
│           │   │   ├── resume-analyzer/route.ts
│           │   │   ├── career-mentor/route.ts
│           │   │   ├── skill-gap/route.ts
│           │   │   ├── mock-interview/route.ts
│           │   │   ├── github-analysis/route.ts
│           │   │   ├── linkedin-review/route.ts
│           │   │   └── roadmap/route.ts
│           │   └── events/route.ts
│           ├── recruiters/
│           │   ├── company/route.ts
│           │   ├── internships/route.ts
│           │   ├── internships/[id]/route.ts
│           │   ├── applicants/route.ts
│           │   ├── applicants/[id]/status/route.ts
│           │   ├── interviews/route.ts
│           │   └── ai/
│           │       ├── jd-generator/route.ts
│           │       ├── candidate-ranking/route.ts
│           │       └── smart-matching/route.ts
│           ├── investors/
│           │   ├── profile/route.ts
│           │   ├── startups/route.ts
│           │   ├── deal-pipeline/route.ts
│           │   ├── messages/route.ts
│           │   └── ai/deal-scoring/route.ts
│           ├── mentors/
│           │   ├── sessions/route.ts
│           │   ├── reviews/route.ts
│           │   └── points/route.ts
│           ├── admin/
│           │   ├── approvals/route.ts
│           │   ├── users/route.ts
│           │   ├── internships/route.ts
│           │   ├── events/route.ts
│           │   ├── payments/route.ts
│           │   └── reports/route.ts
│           ├── super-admin/
│           │   ├── admins/route.ts
│           │   ├── feature-flags/route.ts
│           │   ├── audit-logs/route.ts
│           │   └── monitoring/route.ts
│           ├── payments/
│           │   ├── checkout/route.ts
│           │   ├── webhook/route.ts
│           │   └── invoices/route.ts
│           ├── uploads/
│           │   └── presign/route.ts
│           └── health/route.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.validators.ts
│   │   ├── auth.types.ts
│   │   └── auth.permissions.ts
│   ├── students/
│   │   ├── student.controller.ts
│   │   ├── student.service.ts
│   │   ├── student.repository.ts
│   │   └── student.validators.ts
│   ├── recruiters/
│   │   ├── recruiter.controller.ts
│   │   ├── recruiter.service.ts
│   │   ├── recruiter.repository.ts
│   │   └── recruiter.validators.ts
│   ├── internships/
│   │   ├── internship.controller.ts
│   │   ├── internship.service.ts
│   │   ├── internship.repository.ts
│   │   └── internship.validators.ts
│   ├── applications/
│   │   ├── application.controller.ts
│   │   ├── application.service.ts
│   │   ├── application.repository.ts
│   │   └── application.validators.ts
│   ├── investors/
│   ├── mentors/
│   ├── admin/
│   ├── super-admin/
│   ├── subscriptions/
│   ├── events/
│   └── community/
│
├── ai/
│   ├── providers/
│   │   ├── openai.provider.ts
│   │   ├── anthropic.provider.ts
│   │   ├── gemini.provider.ts
│   │   ├── groq.provider.ts
│   │   └── provider.interface.ts
│   ├── router/
│   │   └── ai-provider.router.ts
│   ├── prompts/
│   │   ├── resume-analyzer.prompt.ts
│   │   ├── career-mentor.prompt.ts
│   │   ├── jd-generator.prompt.ts
│   │   ├── candidate-ranking.prompt.ts
│   │   ├── github-analysis.prompt.ts
│   │   ├── linkedin-review.prompt.ts
│   │   ├── skill-gap.prompt.ts
│   │   ├── mock-interview.prompt.ts
│   │   ├── roadmap.prompt.ts
│   │   └── deal-scoring.prompt.ts
│   ├── services/
│   │   ├── resume-analyzer.service.ts
│   │   ├── career-mentor.service.ts
│   │   ├── jd-generator.service.ts
│   │   ├── candidate-ranking.service.ts
│   │   └── deal-scoring.service.ts
│   └── ai.types.ts
│
├── database/
│   ├── connection.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── student-profile.model.ts
│   │   ├── recruiter-profile.model.ts
│   │   ├── investor-profile.model.ts
│   │   ├── mentor-profile.model.ts
│   │   ├── company.model.ts
│   │   ├── internship.model.ts
│   │   ├── application.model.ts
│   │   ├── resume.model.ts
│   │   ├── interview.model.ts
│   │   ├── event.model.ts
│   │   ├── event-registration.model.ts
│   │   ├── subscription.model.ts
│   │   ├── plan.model.ts
│   │   ├── payment.model.ts
│   │   ├── invoice.model.ts
│   │   ├── message.model.ts
│   │   ├── deal.model.ts
│   │   ├── mentor-session.model.ts
│   │   ├── mentor-points.model.ts
│   │   ├── notification.model.ts
│   │   ├── audit-log.model.ts
│   │   ├── feature-flag.model.ts
│   │   └── community-post.model.ts
│   └── seeders/
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── rbac.middleware.ts
│   ├── rate-limit.middleware.ts
│   ├── validate.middleware.ts
│   ├── request-logger.middleware.ts
│   ├── error-handler.middleware.ts
│   └── security-headers.middleware.ts
│
├── shared/
│   ├── errors/
│   │   ├── app-error.ts
│   │   ├── not-found.error.ts
│   │   ├── validation.error.ts
│   │   ├── unauthorized.error.ts
│   │   ├── forbidden.error.ts
│   │   └── conflict.error.ts
│   ├── response/
│   │   ├── api-response.ts
│   │   └── pagination.ts
│   ├── constants/
│   │   ├── roles.ts
│   │   ├── permissions.ts
│   │   ├── http-status.ts
│   │   └── event-names.ts
│   ├── types/
│   └── utils/
│       ├── slugify.ts
│       ├── hash.ts
│       ├── crypto.ts
│       └── date.ts
│
├── config/
│   ├── env.ts
│   ├── db.config.ts
│   ├── auth.config.ts
│   ├── cloudinary.config.ts
│   ├── razorpay.config.ts
│   ├── resend.config.ts
│   ├── redis.config.ts
│   └── logger.config.ts
│
├── events/
│   ├── event-bus.ts
│   ├── event-emitter.ts
│   └── listeners/
│       ├── send-welcome-email.listener.ts
│       ├── on-application-submitted.listener.ts
│       ├── on-payment-completed.listener.ts
│       └── on-resume-uploaded.listener.ts
│
├── queues/
│   ├── qstash.client.ts
│   ├── jobs/
│   │   ├── send-email.job.ts
│   │   ├── parse-resume.job.ts
│   │   ├── run-ai-analysis.job.ts
│   │   ├── generate-report.job.ts
│   │   └── sync-analytics.job.ts
│   └── job-registry.ts
│
├── emails/
│   ├── templates/
│   │   ├── verify-email.tsx
│   │   ├── reset-password.tsx
│   │   ├── welcome.tsx
│   │   ├── interview-invite.tsx
│   │   ├── application-status.tsx
│   │   └── subscription-receipt.tsx
│   └── mailer.ts
│
├── storage/
│   ├── cloudinary.client.ts
│   ├── upload.service.ts
│   └── validators/
│       └── file-validation.ts
│
├── payments/
│   ├── razorpay.client.ts
│   ├── subscription.service.ts
│   ├── webhook.handler.ts
│   └── invoice.service.ts
│
├── analytics/
│   ├── analytics.service.ts
│   └── trackers/
│
├── logs/
│   └── pino.logger.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── scripts/
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 3. Module Breakdown

| Module | Responsibility | Depends On | Scales To |
|---|---|---|---|
| **Auth** | Registration, login, sessions, verification, RBAC primitives | Users DB, Email | Own auth microservice |
| **Students** | Profile, resume, applications, learning | Auth, AI, Storage | — |
| **Recruiters** | Company, JD, applicant tracking | Auth, AI, Storage, Email | — |
| **Internships** | Listings, search, indexing | Atlas Search, Redis cache | Dedicated search service |
| **Applications** | Student↔Internship join entity, status lifecycle | Students, Recruiters, Events | — |
| **Investors** | Startup discovery, deal pipeline, messaging | AI, Messaging | Real-time service (Socket/Pusher) |
| **Mentors** | Sessions, reviews, points/gamification | Auth, Events | — |
| **Admin** | Approvals, moderation, content ops | All modules (read-mostly) | — |
| **Super Admin** | Platform governance, feature flags, audit | All modules | — |
| **AI** | Provider-agnostic LLM orchestration | External LLM APIs | Independent AI gateway service |
| **Payments** | Subscriptions, Razorpay, invoices | Users, Events | Dedicated billing service |
| **Events/Queues** | Decoupled async workflows | All modules | Kafka/SQS later |

Each module folder is **self-contained**: controller → service → repository → validators. No module imports another module's repository directly — only its exported service interface. This enforces the dependency boundary that makes future extraction to microservices mechanical rather than a rewrite.

---

## 4. Database Design

### 4.1 Core Collections

| Collection | Purpose | Key Relationships |
|---|---|---|
| `users` | Core identity (all roles) | 1:1 with role-profile collections |
| `studentProfiles` | Student-specific data | `userId` → users |
| `recruiterProfiles` | Recruiter-specific data | `userId` → users, `companyId` → companies |
| `investorProfiles` | Investor-specific data | `userId` → users |
| `mentorProfiles` | Mentor-specific data | `userId` → users |
| `companies` | Company entities | Referenced by recruiterProfiles, internships |
| `internships` | Job/internship postings | `companyId`, `recruiterId` |
| `applications` | Student applications | `studentId`, `internshipId` |
| `resumes` | Resume versions/files | `studentId` |
| `interviews` | Scheduled interviews | `applicationId`, `recruiterId` |
| `events` | Webinars/hackathons/bootcamps | — |
| `eventRegistrations` | Registration join table | `eventId`, `userId` |
| `plans` | Subscription tiers | — |
| `subscriptions` | Active user subscriptions | `userId`, `planId` |
| `payments` | Razorpay transaction records | `userId`, `subscriptionId` |
| `invoices` | Generated invoices | `paymentId` |
| `deals` | Investor deal pipeline entries | `investorId`, `startupId` |
| `messages` | Investor↔Founder / Recruiter↔Candidate messaging | `senderId`, `receiverId` |
| `mentorSessions` | Booked mentoring sessions | `mentorId`, `studentId` |
| `notifications` | In-app notifications | `userId` |
| `auditLogs` | Super Admin audit trail | `actorId` |
| `featureFlags` | Feature toggles | — |
| `communityPosts` | Forum posts/comments | `authorId` |

### 4.2 Indexing Strategy

- **`users`**: unique index on `email`; compound index `{ role: 1, status: 1 }` for admin filtering.
- **`internships`**: compound index `{ status: 1, location: 1, createdAt: -1 }`; **Atlas Search index** on `title`, `description`, `skills` for full-text discovery; TTL-adjacent `expiresAt` field with a scheduled job to auto-close (not a hard TTL delete, since postings should archive, not vanish).
- **`applications`**: compound unique index `{ studentId: 1, internshipId: 1 }` to prevent duplicate applications; index `{ internshipId: 1, status: 1 }` for recruiter dashboards.
- **`resumes`**: index `{ studentId: 1, createdAt: -1 }`.
- **`notifications`**: TTL index on `createdAt` (e.g., auto-expire after 90 days) plus `{ userId: 1, read: 1 }`.
- **`payments`**: unique index on `razorpayOrderId`.
- **`auditLogs`**: index `{ actorId: 1, createdAt: -1 }`, capped-collection consideration for high volume.
- **`companies`**: text index on `name` for recruiter search/autocomplete.
- **`messages`**: compound index `{ conversationId: 1, createdAt: 1 }`.

---

## 5. Mongoose Schemas (Field-Level Design)

> Field lists below are the contract — implementation deferred per your instructions.

**User**
`email` (unique, required), `passwordHash`, `role` (enum: student|recruiter|investor|mentor|admin|superAdmin), `status` (enum: pending|active|suspended|banned), `emailVerified` (bool), `twoFactorEnabled` (bool), `lastLoginAt`, `createdAt`, `updatedAt`.

**StudentProfile**
`userId` (ref User), `fullName`, `headline`, `skills` [String], `education` [subdoc], `experience` [subdoc], `resumeIds` [ref Resume], `githubUrl`, `linkedinUrl`, `resumeScore` (Number), `subscriptionTier` (enum: free|premium).

**RecruiterProfile**
`userId` (ref User), `companyId` (ref Company), `designation`, `verified` (bool), `subscriptionTier`.

**Company**
`name`, `logoUrl`, `website`, `industry`, `size` (enum), `verifiedByAdmin` (bool).

**Internship**
`recruiterId` (ref User), `companyId` (ref Company), `title`, `description`, `skillsRequired` [String], `location`, `type` (enum: internship|full-time|hybrid|remote), `stipend`, `status` (enum: draft|published|closed|expired), `applicationDeadline`, `viewCount`.

**Application**
`studentId` (ref User), `internshipId` (ref Internship), `resumeId` (ref Resume), `status` (enum: applied|shortlisted|interview|rejected|hired), `aiMatchScore` (Number), `timeline` [subdoc: status + timestamp].

**Resume** — `studentId`, `fileUrl` (Cloudinary), `parsedData` (JSON), `aiAnalysis` (subdoc), `version`.

**Interview** — `applicationId`, `recruiterId`, `scheduledAt`, `mode` (enum: online|onsite), `status` (enum: scheduled|completed|cancelled), `meetingLink`.

**Plan** — `name`, `role` (which user type it applies to), `price`, `billingCycle` (monthly|yearly), `features` [String].

**Subscription** — `userId`, `planId`, `razorpaySubscriptionId`, `status` (active|cancelled|expired), `startedAt`, `expiresAt`.

**Payment** — `userId`, `razorpayOrderId` (unique), `razorpayPaymentId`, `amount`, `status`, `purpose` (enum: subscription|event).

**Deal** — `investorId`, `startupId`, `stage` (enum), `aiScore`, `notes`.

**MentorSession** — `mentorId`, `studentId`, `scheduledAt`, `status`, `pointsAwarded`.

**AuditLog** — `actorId`, `action`, `targetType`, `targetId`, `metadata` (JSON), `ipAddress`, `createdAt`.

**FeatureFlag** — `key` (unique), `enabled` (bool), `rolloutPercentage`, `updatedBy`.

All schemas use: `timestamps: true`, `toJSON` transforms stripping `__v`/internal fields, and `ref`-based population rather than embedding for anything that grows unbounded (applications, messages, audit logs).

---

## 6. Authentication

### 6.1 Flow (Better Auth)

- Better Auth handles credential + OAuth-ready flows (Google/GitHub/LinkedIn sign-in, relevant for recruiters/investors).
- **Session strategy**: HTTP-only, secure, `SameSite=Lax` session cookies (Better Auth's session model) rather than raw JWT-in-localStorage — avoids XSS token theft. Short-lived session token + rotating refresh token stored server-side, enabling instant revocation (JWT alone can't be revoked without a blocklist).
- **Refresh tokens**: rotated on every use (refresh token rotation), old token invalidated to detect token replay/theft.
- **Email verification**: signup → unverified state → verification email (Resend) → token-based confirmation → account activated.
- **Password reset**: time-boxed signed token (15 min expiry), single-use, invalidates all active sessions on reset.
- **Account lock**: exponential backoff after N failed login attempts (e.g., 5), lock escalates from 1 min → 15 min → 1 hr, logged to `auditLogs`.
- **2FA**: TOTP-based (authenticator app) optional for all roles, mandatory for Admin/Super Admin.
- **OAuth-ready**: Better Auth's provider abstraction means adding Google/LinkedIn login later requires only config, not architecture changes.

---

## 7. Authorization (RBAC)

### 7.1 Permission Matrix (excerpt)

| Resource | Student | Recruiter | Investor | Mentor | Admin | Super Admin |
|---|---|---|---|---|---|---|
| Own Profile | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| Internship (create) | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| Internship (approve) | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| View Applicant Resumes | ✗ | Own postings only | ✗ | ✗ | ✓ | ✓ |
| Deal Pipeline | ✗ | ✗ | Own | ✗ | Read-only | ✓ |
| User Ban | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| Feature Flags | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Audit Logs | ✗ | ✗ | ✗ | ✗ | Read-only | ✓ |

### 7.2 Implementation

- Permissions defined declaratively in `shared/constants/permissions.ts` as `resource:action` strings (e.g., `internship:create`).
- `rbac.middleware.ts` reads the authenticated user's role, checks against a `ROLE_PERMISSIONS` map, and additionally enforces **ownership guards** (e.g., a recruiter can only edit *their own* internship — checked at service layer via `resourceOwnerId === session.userId`).
- Guards are composable: `withAuth(withRole(['recruiter'])(withOwnership(handler)))`.

---

## 8. API Structure

Base: `/api/v1`

```
/api/v1/auth/*                      — register, login, logout, refresh, verify-email, 2fa
/api/v1/students/profile
/api/v1/students/resume
/api/v1/students/applications
/api/v1/students/ai/resume-analyzer
/api/v1/students/ai/career-mentor
/api/v1/students/ai/mock-interview
/api/v1/students/ai/skill-gap
/api/v1/students/ai/github-analysis
/api/v1/students/ai/linkedin-review
/api/v1/students/ai/roadmap
/api/v1/recruiters/company
/api/v1/recruiters/internships
/api/v1/recruiters/internships/:id
/api/v1/recruiters/applicants
/api/v1/recruiters/ai/jd-generator
/api/v1/recruiters/ai/candidate-ranking
/api/v1/recruiters/ai/smart-matching
/api/v1/investors/startups
/api/v1/investors/deal-pipeline
/api/v1/investors/ai/deal-scoring
/api/v1/mentors/sessions
/api/v1/mentors/points
/api/v1/admin/approvals
/api/v1/admin/internships
/api/v1/admin/reports
/api/v1/super-admin/feature-flags
/api/v1/super-admin/audit-logs
/api/v1/payments/checkout
/api/v1/payments/webhook
/api/v1/health
```

**Conventions**: plural nouns for collections, verbs only for actions with no clean REST mapping (`ai/*` endpoints are effectively RPC-style, which is acceptable for AI operations). Versioning via URL path (`/v1`) rather than headers, for cache-friendliness and discoverability.

---

## 9. Service Layer

Services hold **all business rules** — e.g., `applicationService.apply()` checks deadline, prevents duplicate applications, triggers `internship.applied` event, and calls `aiService.scoreMatch()` asynchronously. Services are pure TypeScript classes/functions with **zero framework dependency** — they can be unit tested by mocking repositories, and reused by both HTTP controllers and background job handlers.

---

## 10. Repository Layer

Repositories are the **only** place Mongoose models are imported. Each repository exposes typed methods (`findById`, `findByFilters`, `create`, `updateStatus`) returning plain domain objects (via `.lean()`), never raw Mongoose documents, so services stay decoupled from ODM internals. Benefit: swapping MongoDB for another store, or introducing a caching layer inside the repository, never touches service code.

---

## 11. Validation Layer

- **Request validation**: Zod schemas per endpoint (`*.validators.ts`), parsed at the controller boundary — reject malformed input before it reaches services.
- **Response validation** (in critical/public-facing endpoints like internship listings): Zod-parse outgoing data too, guarding against accidental PII leakage (e.g., a resume's raw file path).
- Shared Zod primitives (email, password strength, MongoId) live in `shared/types` to avoid duplication.

---

## 12. Error Handling

- **Custom error hierarchy**: `AppError` (base) → `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, each carrying an HTTP status and machine-readable `code`.
- **Central handler**: every route handler wraps logic in a `try/catch` funneled to `error-handler.middleware.ts`, which normalizes any thrown error (including unexpected ones) into a consistent shape and logs it via Pino.
- **Standard response envelope**:
```json
{
  "success": false,
  "error": { "code": "APPLICATION_ALREADY_EXISTS", "message": "You already applied to this internship." },
  "meta": { "requestId": "..." }
}
```
Success responses mirror this: `{ "success": true, "data": {...}, "meta": {...} }`.

---

## 13. Logging (Pino)

- **Request logs**: method, path, status, latency, requestId (correlation ID passed through all layers).
- **Error logs**: full stack trace + context (userId, role, route) at `error` level, scrubbed of secrets/PII.
- **Audit logs**: persisted to MongoDB (`auditLogs` collection) for admin actions — separate from ephemeral Pino stdout logs, since these need querying.
- **Security logs**: failed logins, permission denials, rate-limit hits, flagged at `warn`, feeding into the future Fraud/Scam Shield AI.

---

## 14. AI Module

Provider-agnostic by design: every AI feature calls a **use-case service** (`resumeAnalyzerService`), which calls the **AI router**, which selects a provider (`OpenAI`, `Anthropic`, `Gemini`, `Groq`, or local) implementing a shared `AIProvider` interface (`complete()`, `stream()`, `embed()`). Swapping providers, or A/B testing them, is a config change, not a code change.

| Feature | Prompt Module | Notes |
|---|---|---|
| Resume Analyzer | `resume-analyzer.prompt.ts` | Structured JSON output (score, gaps, suggestions) |
| Career Mentor | `career-mentor.prompt.ts` | Conversational, session-based context |
| JD Generator | `jd-generator.prompt.ts` | Templated from company + role inputs |
| Candidate Ranking | `candidate-ranking.prompt.ts` | Batched scoring against JD |
| GitHub Analysis | `github-analysis.prompt.ts` | Pulls repo metadata via GitHub API, then LLM-summarizes |
| LinkedIn Review | `linkedin-review.prompt.ts` | Parses profile export/URL |
| Skill Gap Analysis | `skill-gap.prompt.ts` | Compares profile skills vs target role taxonomy |
| Mock Interview | `mock-interview.prompt.ts` | Multi-turn, stored transcript |
| Learning Roadmap | `roadmap.prompt.ts` | Structured milestone output |
| Deal Scoring | `deal-scoring.prompt.ts` | Startup data → investor-facing score |

All AI calls are queued for anything non-trivial (resume parsing, ranking batches) rather than run synchronously in the request cycle, to keep API latency low and control token cost via batching.

---

## 15. File Upload Module (Cloudinary)

- **Presigned upload flow**: client requests a signed upload URL from `/api/v1/uploads/presign`, uploads directly to Cloudinary (bypassing the Next.js function for large files), then confirms with a callback that persists the resulting URL.
- **Validated asset types**: Resumes (PDF/DOCX, size-capped), Certificates (PDF/image), Company Logos (image, aspect-ratio checked), Profile Pictures (image, auto-cropped).
- Cloudinary transformations handle resizing/optimization server-side, not client-side.

---

## 16. Payment Module (Razorpay)

- **Plans** define role-specific tiers (Student Premium, Recruiter Premium, Investor Premium) per the feature comparison matrix.
- **Subscriptions** are created via Razorpay Subscriptions API for recurring billing; one-off payments (events) use Razorpay Orders.
- **Webhooks** (`payment.captured`, `subscription.charged`, `subscription.cancelled`) are the *source of truth* for activation — the frontend confirmation is UX-only, never trusted for entitlement changes. Webhook signature verification is mandatory.
- **Invoices** auto-generated on successful payment, emailed via Resend, stored in `invoices` collection with a Cloudinary-hosted PDF.

---

## 17. Email Module (Resend)

Transactional templates: verification, password reset, welcome, interview invitation, application status change, subscription receipt/renewal, generic notifications. All emails are queued (never sent inline during a request) and templated with React Email components for consistency with the design system.

---

## 18. Event System

Internal event bus (in-process pub/sub, upgradeable to a real broker later):

`user.registered` · `email.verified` · `resume.uploaded` · `internship.published` · `internship.applied` · `application.status_changed` · `interview.scheduled` · `payment.completed` · `subscription.activated` · `subscription.cancelled` · `deal.created`

Each event has typed payloads (`shared/constants/event-names.ts` + corresponding TS types) and 1..N listeners registered independently — e.g., `internship.applied` triggers both an email listener and an AI-scoring job listener, with neither aware of the other.

---

## 19. Background Jobs

Run asynchronously via QStash/Inngest:
- All transactional emails
- AI resume parsing & analysis (can take seconds–minutes)
- Candidate ranking batches (recruiter dashboards)
- PDF/report generation (admin monthly reports)
- Notification fan-out
- Analytics aggregation (daily rollups rather than real-time counters)

Rule of thumb: **anything that isn't needed for the immediate HTTP response goes to a queue.**

---

## 20. Security

- **Helmet**-equivalent security headers middleware (CSP, X-Frame-Options, HSTS).
- **Rate limiting** via Redis (sliding window) per-IP and per-user, stricter on auth endpoints.
- **CSRF**: mitigated via `SameSite` cookies + double-submit token for state-changing cookie-authenticated requests.
- **CORS**: allowlist of known frontend origins only.
- **Input validation**: Zod at every boundary; Mongoose schema-level validation as defense in depth.
- **NoSQL injection protection**: strict typing + sanitization of any user input used in queries; never interpolate raw input into `$where` or dynamic query construction.
- **XSS protection**: output encoding on any user-generated content (community posts, messages) before render (frontend responsibility, but backend enforces sanitized storage too).
- **Brute-force protection**: account lockout (see §6) + rate limiting combined.
- **Secrets management**: all secrets in Vercel environment variables, never committed; rotated periodically.
- **OWASP Top 10** checklist reviewed per release: broken access control, injection, auth failures, SSRF (relevant for any URL-fetching AI features like GitHub/LinkedIn analysis), etc.

---

## 21. Performance

- **Redis caching**: cache-aside for internship listings, public company profiles, feature flags — invalidated on write.
- **Cursor-based pagination** (not offset/skip) for all list endpoints at scale (`applications`, `internships`, `notifications`), using indexed `_id`/`createdAt` cursors.
- **Aggregation pipelines** for dashboard analytics rather than N+1 application-layer joins.
- **Lazy loading**: resume file bytes never inlined into API responses — only signed Cloudinary URLs.
- **Compression**: gzip/brotli at the edge (Vercel default).
- **Response shaping**: field projection at the repository level to avoid over-fetching (e.g., listing endpoints never return full resume blobs).

---

## 22. Scaling Roadmap

| Users | Key Changes |
|---|---|
| 100 | Single Atlas free/shared tier, no Redis needed, direct Vercel deploy |
| 1,000 | Add Redis caching, basic Atlas Search indexes, queue for emails |
| 10,000 | Dedicated Atlas cluster, read replicas, full queue adoption for AI jobs, CDN for assets |
| 100,000 | Sharding candidates (by role or region), rate-limit tuning, dedicated AI gateway service extraction, background job worker scaling |
| 1,000,000 | Extract high-load modules (AI, Search, Messaging) into standalone services, introduce a real event broker (Kafka/SQS), multi-region Atlas, edge caching for public content, dedicated analytics warehouse (e.g., ClickHouse/BigQuery) |

---

## 23. Environment Variables (`.env.example`)

```env
# App
NODE_ENV=development
APP_URL=http://localhost:3000
API_VERSION=v1

# Database
MONGODB_URI=

# Auth (Better Auth)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Redis
REDIS_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
EMAIL_FROM=

# Background Jobs
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
DEFAULT_AI_PROVIDER=openai

# GitHub API (for GitHub Analysis feature)
GITHUB_PAT=

# Logging
LOG_LEVEL=info

# Security
JWT_SECRET=
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

---

## 24. Development Roadmap

| Phase | Scope | Independently Testable Outcome |
|---|---|---|
| 1 | Auth (register/login/verify/reset/2FA) + RBAC skeleton | Can create users of each role, log in, hit protected routes |
| 2 | Student module (profile, resume upload, applications) | Student can build a profile and apply to a seeded internship |
| 3 | Recruiter module (company, internship CRUD, applicant tracking) | Recruiter can post a job and see applicants |
| 4 | AI module core (Resume Analyzer, JD Generator) with provider abstraction | AI endpoints return structured scores against test resumes |
| 5 | Payments (plans, Razorpay checkout, webhooks, invoices) | End-to-end subscription purchase in Razorpay test mode |
| 6 | Events & Community (webinars, registrations, forum) | Student can register for an event |
| 7 | Investor & Mentor modules | Investor can view startups, mentor can log a session |
| 8 | Admin module (approvals, moderation, reports) | Admin can approve a pending recruiter |
| 9 | Super Admin module (feature flags, audit logs, monitoring) | Feature flag toggles behavior without deploy |
| 10 | Advanced AI (Mock Interview, GitHub/LinkedIn analysis, Deal Scoring, Roadmaps) | Full AI suite functional |
| 11 | Performance & hardening (caching, rate limits, security audit) | Load-tested, OWASP checklist passed |

---

## 25. Testing Strategy

- **Unit tests**: services and utilities, with repositories mocked (Jest/Vitest) — the primary test surface, since business logic lives here.
- **Integration tests**: repository layer against an in-memory MongoDB (`mongodb-memory-server`) to verify queries/indexes behave as designed.
- **API tests**: route handlers via `supertest`-style requests against a test server, covering auth flows, RBAC enforcement, and error envelope shape.
- **Mocking**: AI provider calls and Razorpay/Cloudinary/Resend clients are mocked in all non-E2E tests to avoid flaky external dependencies and cost.
- **Fixtures**: seed data per role (student/recruiter/investor/mentor/admin) reused across test suites via `tests/fixtures`.

---

## 26. Deployment

```
                ┌────────────┐
   Client  ───▶ │  Vercel    │──▶ Next.js API Routes (serverless)
                └─────┬──────┘
                      │
      ┌───────────────┼─────────────────┬───────────────┐
      ▼               ▼                 ▼                ▼
 MongoDB Atlas     Redis (Upstash)   Cloudinary       QStash/Inngest
 (primary data)    (cache/rate-limit) (media)          (background jobs)
      │
      ▼
 Resend (email) · Razorpay (payments) · AI Providers
```

- **Health checks**: `/api/v1/health` verifies DB connectivity, Redis reachability, and queue connectivity — used by uptime monitors.
- **Monitoring**: structured Pino logs shipped to a log sink (e.g., Better Stack/Axiom), plus Vercel's built-in function metrics.
- **Zero-downtime deploys** via Vercel's atomic deployments; database migrations run as pre-deploy scripts, backward-compatible by convention (additive schema changes first, cleanup later).

---

## 27. Future Enhancements

- **Microservices extraction**: AI module and Search first (highest compute variance), then Messaging (needs realtime infra).
- **Event bus upgrade**: move from in-process emitter to Kafka/SQS once cross-service events are needed.
- **GraphQL gateway**: optional, for frontend teams needing flexible querying across Student/Recruiter/Investor domains.
- **Realtime notifications**: WebSocket/Pusher layer for messaging, interview updates, live application status.
- **Mobile APIs**: the versioned REST layer already supports this; add mobile-specific response shaping if needed.
- **Dedicated search engine**: Atlas Search → Elasticsearch/Algolia if internship volume and query complexity outgrow Mongo's text search.
- **Recommendation engine**: collaborative filtering for internship/mentor/startup matching, fed by the analytics warehouse.
- **ML pipelines**: offline model training (e.g., custom candidate-fit scoring) feeding back into the AI module as an additional provider.

---

*This document reflects the sitemap and free/premium feature matrix provided (Student, Recruiter, Investor/Mentor portals, Admin/Super Admin dashboards) and is structured so implementation can proceed phase-by-phase per §24 with strict incremental verification at each checkpoint.*