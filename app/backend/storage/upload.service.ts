import { Readable } from "node:stream";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { getCloudinaryClient } from "@/config/cloudinary.config";
import { AppError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import { validateResumeFile, type IncomingFile } from "./validators/file-validation";

function uploadBuffer(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const upload = getCloudinaryClient().uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      if (!result) {
        reject(new Error("Cloudinary returned an empty upload response."));
        return;
      }
      resolve(result);
    });
    Readable.from(buffer).pipe(upload);
  });
}

export const uploadService = {
  async uploadResume(buffer: Buffer, metadata: IncomingFile, userId: string) {
    validateResumeFile(metadata);
    try {
      const result = await uploadBuffer(buffer, {
        folder: `step-up-for-ai/resumes/${userId}`,
        resource_type: "raw",
        public_id: `${Date.now()}-${metadata.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
        overwrite: false,
      });
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Resume upload failed. Check the storage configuration and try again.",
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "RESUME_UPLOAD_FAILED",
        error instanceof Error ? error.message : undefined
      );
    }
  },

  async deleteAsset(publicId: string) {
    try {
      const result = await getCloudinaryClient().uploader.destroy(publicId, { resource_type: "raw" });
      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Cloudinary did not delete the resume asset (${result.result}).`);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Resume deletion failed. Check the storage configuration and try again.",
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "RESUME_DELETE_FAILED",
        error instanceof Error ? error.message : undefined
      );
    }
  },
};
