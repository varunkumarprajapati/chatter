import { MarkdownTextSplitter } from "@langchain/textsplitters";

class ChunkerService {
  private readonly chunkSize = 800;
  private readonly chunkOverlap = 60;

  private readonly splitter: MarkdownTextSplitter;

  constructor() {
    this.splitter = new MarkdownTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
  }

  public splitMarkdown(content: string, filename: string) {
    if (!content.trim()) return [];
    return this.splitter.createDocuments(
      [content],
      [{ source: filename, format: "markdown" }],
      {
        chunkHeader: "[Document: pgvector Docs]\n",
      },
    );
  }
}

export { ChunkerService };
