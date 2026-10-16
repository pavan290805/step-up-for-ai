# Step-up for AI

Step-up for AI is a full-stack hiring platform that connects candidates and recruiters through internship discovery, applications, applicant tracking, interviews, profiles, and resume management. The application also includes workspaces for events, community, investors, mentors, subscriptions, and administration.

## Stack

- Next.js 16 App Router and React 19
- TypeScript
- MongoDB with Mongoose
- Better Auth sessions and role-based access
- Cloudinary resume storage, Razorpay payments, and configurable AI providers

## Getting started

1. Install dependencies with `npm install`.
2. Set the required environment variables listed in [REQUIRED_ENV.md](./REQUIRED_ENV.md). Keep credentials local; do not commit them.
3. Start the development server with `npm run dev`.
4. Open `http://localhost:3000`.

The core site requires MongoDB and Better Auth configuration. Configure Cloudinary, email, AI, and Razorpay only when enabling those integrations. Their missing or invalid settings are reported when their respective features are used.

## Validation

- `npm run lint` runs ESLint.
- `npx tsc --noEmit` runs the TypeScript check.
- `npm run build` creates a production build.

Role-aware routes include student, recruiter, investor, mentor, and admin workspaces. The hiring flow is centered on candidate profiles and resumes, internship search and applications, recruiter applicant review, and interview scheduling.
