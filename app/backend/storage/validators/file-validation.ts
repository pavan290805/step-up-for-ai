export interface IncomingFile {
  mimeType: string;
  sizeBytes: number;
  fileName: string;
}

const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export function validateResumeFile(file: IncomingFile): void {
  if (!ALLOWED_RESUME_TYPES.has(file.mimeType)) {
    throw new ValidationError("Resume must be a PDF or DOCX file.");
  }
  if (file.sizeBytes <= 0 || file.sizeBytes > MAX_RESUME_SIZE_BYTES) {
    throw new ValidationError("Resume file must be between 1 byte and 10 MB.");
  }
}
import { ValidationError } from "@/shared/errors";
