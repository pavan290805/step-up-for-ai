import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import * as mammoth from "mammoth";
import { ValidationError } from "@/shared/errors";

const PDF_MIME_TYPE = "application/pdf";
const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_RESUME_TEXT_LENGTH = 20_000;
const MAX_PDF_PAGES = 100;
const MIN_RESUME_TEXT_LENGTH = 50;

export async function extractResumeText(buffer: Buffer, mimeType: string): Promise<string> {
  let text: string;

  if (mimeType === PDF_MIME_TYPE) {
    text = await extractPdfText(buffer);
  } else if (mimeType === DOCX_MIME_TYPE) {
    text = await extractDocxText(buffer);
  } else {
    throw new ValidationError("Resume must be a PDF or DOCX file.");
  }

  const normalizedText = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (normalizedText.length < MIN_RESUME_TEXT_LENGTH) {
    throw new ValidationError(
      "We couldn't extract enough readable text from this resume. Use a text-based PDF or DOCX file, or paste the resume text in the AI analyzer."
    );
  }
  if (normalizedText.length > MAX_RESUME_TEXT_LENGTH) {
    throw new ValidationError(
      `Resume text exceeds the ${MAX_RESUME_TEXT_LENGTH.toLocaleString()} character analysis limit. Shorten the document and upload it again.`
    );
  }

  return normalizedText;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    disableFontFace: true,
  });
  let document: Awaited<typeof loadingTask.promise> | undefined;

  try {
    document = await loadingTask.promise;
    if (document.numPages > MAX_PDF_PAGES) {
      throw new ValidationError(`Resume PDFs must contain ${MAX_PDF_PAGES} pages or fewer.`);
    }

    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }
    return pages.join("\n");
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError(
      "We couldn't read this PDF. Upload a valid, text-based PDF or paste the resume text in the AI analyzer."
    );
  } finally {
    if (document) {
      await document.destroy();
    } else {
      await loadingTask.destroy();
    }
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch {
    throw new ValidationError(
      "We couldn't read this DOCX file. Upload a valid Word document or paste the resume text in the AI analyzer."
    );
  }
}
