import createHttpError from "http-errors";
import path from "node:path";

class ParserService {
  public toMarkdown(fileBuffer: Buffer, filename: string): string {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("file buffer is empty");
    }

    const ext = path.extname(filename).toLowerCase();

    switch (ext) {
      case ".md":
        return fileBuffer.toString("utf-8");

      default:
        throw createHttpError(400, `Unsupported file extension: ${ext}`);
    }
  }
}

export { ParserService };
