# Step-up for AI environment configuration

Keep the local environment file empty until the credentials below are available. The application reads its configuration from environment variables; do not commit real credentials.

## Required to start the application

| Variable | Purpose | Example / requirement |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `BETTER_AUTH_SECRET` | Secret used by the authentication/session implementation | At least 32 characters |
| `BETTER_AUTH_URL` | Canonical auth/application URL | `http://localhost:3000` for local development |

`APP_URL` defaults to `http://localhost:3000`, `API_VERSION` defaults to `v1`, and `NODE_ENV` is managed by Next.js. They only need to be set when deploying to a non-default environment.

## Optional integrations

These settings are validated when the related feature is first used, so the core site can start without them.

| Variables | Used for | Required before |
| --- | --- | --- |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Resume file storage | Uploading or deleting resumes |
| `RESEND_API_KEY`, `EMAIL_FROM` | Transactional email | Sending verification or account emails |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY` | AI resume analysis and job-description generation | Enabling the corresponding AI provider |
| `RAPIDAPI_KEY` | JSearch job-search API via RapidAPI | Searching external job listings |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Checkout and payment webhooks | Processing subscriptions or payments |

`DEFAULT_AI_PROVIDER` selects `openai`, `anthropic`, `gemini`, or `groq` and defaults to `openai`. Configure the matching API key before using AI features. The current implementation uses `RESEND_API_KEY` / `EMAIL_FROM`; SMTP, `JWT_SECRET`, and `COOKIE_SECRET` are not read by the checked-in application configuration.

## Optional operational settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `LOG_LEVEL` | `info` | Pino log verbosity |
| `ACCOUNT_LOCK_MAX_ATTEMPTS` | `5` | Failed login attempts before lockout |
| `ACCOUNT_LOCK_BASE_MINUTES` | `1` | Initial account lock duration |
| `TWO_FACTOR_ISSUER` | `StepUp for AI` | Label shown in authenticator applications |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate-limit window |
| `RATE_LIMIT_MAX` | `100` | Requests allowed per window |

The repository's existing `.env.local` was not read or modified. Add values locally after provisioning the required services.
