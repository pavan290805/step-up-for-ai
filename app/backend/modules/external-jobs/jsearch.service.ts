import { env } from "@/config/env";
import { ExternalApplicationModel } from "@/database/models/external-application.model";
import { AppError } from "@/shared/errors";
import { createModuleLogger } from "@/config/logger.config";
import type {
  ExternalJobSearchQuery,
  TrackExternalApplicationDto,
} from "@/modules/external-jobs/external-job.validators";
import { z } from "zod";

const logger = createModuleLogger("jsearch");
const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";
const JSEARCH_HOST = "jsearch.p.rapidapi.com";
const REQUEST_TIMEOUT_MS = 12_000;
const COUNTRY_CODES: Record<string, string> = {
  india: "in",
  "united states": "us",
  usa: "us",
  "united kingdom": "gb",
  uk: "gb",
  canada: "ca",
  australia: "au",
  singapore: "sg",
  germany: "de",
  france: "fr",
  "united arab emirates": "ae",
  uae: "ae",
};

const jsearchJobSchema = z.object({
  job_id: z.string().optional(),
  job_title: z.string().optional(),
  employer_name: z.string().nullable().optional(),
  job_city: z.string().nullable().optional(),
  job_state: z.string().nullable().optional(),
  job_country: z.string().nullable().optional(),
  job_is_remote: z.boolean().optional(),
  job_employment_type: z.string().nullable().optional(),
  job_apply_link: z.string().nullable().optional(),
  job_google_link: z.string().nullable().optional(),
  job_posted_at_datetime_utc: z.string().nullable().optional(),
  employer_logo: z.string().nullable().optional(),
  job_min_salary: z.number().nullable().optional(),
  job_max_salary: z.number().nullable().optional(),
  job_salary_currency: z.string().nullable().optional(),
  job_salary_period: z.string().nullable().optional(),
});

function safeHttpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const jsearchService = {
  async search(query: ExternalJobSearchQuery) {
    if (!env.RAPIDAPI_KEY) {
      throw new AppError(
        "External job search is not configured. Add RAPIDAPI_KEY to the server environment.",
        503,
        "EXTERNAL_JOBS_NOT_CONFIGURED"
      );
    }

    const location = query.location || "India";
    const searchParams = new URLSearchParams({
      query: `${query.q} in ${location}`,
      page: "1",
      num_pages: "1",
      country: getCountryCode(location),
      date_posted: "all",
    });
    if (query.type === "internship") searchParams.set("employment_types", "INTERN");
    if (query.type === "full-time") searchParams.set("employment_types", "FULLTIME");
    if (query.type === "remote") searchParams.set("remote_jobs_only", "true");

    let response: Response;
    try {
      response = await fetch(`${JSEARCH_URL}?${searchParams}`, {
        headers: {
          "X-RapidAPI-Key": env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": JSEARCH_HOST,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch (error) {
      logger.error({ err: error }, "JSearch request failed");
      throw new AppError("External job search is temporarily unavailable. Please try again.", 502, "EXTERNAL_JOBS_UPSTREAM_ERROR");
    }

    if (!response.ok) {
      logger.error({ statusCode: response.status }, "JSearch returned an unsuccessful response");
      if (response.status === 401 || response.status === 403) {
        throw new AppError(
          "JSearch rejected the RapidAPI key or subscription. Check RAPIDAPI_KEY and confirm JSearch is subscribed in RapidAPI.",
          503,
          "EXTERNAL_JOBS_UPSTREAM_AUTH_ERROR"
        );
      }
      if (response.status === 429) {
        throw new AppError(
          "The JSearch request quota or rate limit has been reached. Try again later or check the RapidAPI plan.",
          429,
          "EXTERNAL_JOBS_RATE_LIMITED"
        );
      }
      throw new AppError("External job search is temporarily unavailable. Please try again.", 502, "EXTERNAL_JOBS_UPSTREAM_ERROR");
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      logger.error({ err: error }, "JSearch returned invalid JSON");
      throw new AppError("External job search returned an invalid response.", 502, "EXTERNAL_JOBS_INVALID_RESPONSE");
    }

    if (typeof payload !== "object" || payload === null || !("data" in payload) || !Array.isArray(payload.data)) {
      logger.error("JSearch response did not contain a jobs array");
      throw new AppError("External job search returned an invalid response.", 502, "EXTERNAL_JOBS_INVALID_RESPONSE");
    }

    const jobs = payload.data.flatMap((entry: unknown) => {
      const parsed = jsearchJobSchema.safeParse(entry);
      if (!parsed.success || !parsed.data.job_id || !parsed.data.job_title) return [];

      const job = parsed.data;
      const applyUrl = safeHttpsUrl(job.job_apply_link) ?? safeHttpsUrl(job.job_google_link);
      if (!applyUrl) return [];

      const place = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ");
      const salary = formatSalary(job);
      return [{
        provider: "jsearch" as const,
        externalJobId: job.job_id,
        title: job.job_title,
        companyName: job.employer_name || "Company not listed",
        location: job.job_is_remote ? (place ? `Remote · ${place}` : "Remote") : place || location,
        employmentType: job.job_employment_type ?? null,
        applyUrl,
        sourceUrl: safeHttpsUrl(job.job_google_link),
        employerLogoUrl: safeHttpsUrl(job.employer_logo),
        postedAt: job.job_posted_at_datetime_utc ?? null,
        salary,
      }];
    });

    return { items: jobs };
  },

  async trackApplication(studentId: string, data: TrackExternalApplicationDto) {
    const now = new Date();
    const application = await ExternalApplicationModel.findOneAndUpdate(
      { studentId, provider: data.provider, externalJobId: data.externalJobId },
      {
        $set: {
          title: data.title,
          companyName: data.companyName,
          location: data.location,
          employmentType: data.employmentType ?? null,
          applyUrl: data.applyUrl,
          sourceUrl: data.sourceUrl ?? null,
          employerLogoUrl: data.employerLogoUrl ?? null,
          postedAt: data.postedAt ?? null,
          status: "external_page_opened",
          lastOpenedAt: now,
        },
        $setOnInsert: { firstOpenedAt: now },
        $inc: { openCount: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    )
      .lean()
      .exec();

    return application;
  },

  async listApplications(studentId: string) {
    return ExternalApplicationModel.find({ studentId })
      .sort({ lastOpenedAt: -1 })
      .limit(100)
      .lean()
      .exec();
  },
};

function formatSalary(job: {
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_currency?: string | null;
  job_salary_period?: string | null;
}) {
  if (job.job_min_salary == null && job.job_max_salary == null) return null;
  const currency = job.job_salary_currency ? `${job.job_salary_currency} ` : "";
  const minimum = job.job_min_salary?.toLocaleString("en-US");
  const maximum = job.job_max_salary?.toLocaleString("en-US");
  const range = minimum && maximum ? `${minimum}–${maximum}` : minimum ?? maximum;
  return `${currency}${range}${job.job_salary_period ? ` / ${job.job_salary_period.toLowerCase()}` : ""}`;
}

function getCountryCode(location: string) {
  const segments = location.toLowerCase().split(",").map((segment) => segment.trim());
  for (const segment of segments.toReversed()) {
    if (COUNTRY_CODES[segment]) return COUNTRY_CODES[segment];
  }
  return "in";
}
