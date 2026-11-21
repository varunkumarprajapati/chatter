import { env } from "../../../config/env.ts";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GEMINI_MODELS } from "../../../constants.ts";

class EmbeddingService {
  private readonly embeddings: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: env.GEMINI_API_KEY,
      modelName: GEMINI_MODELS.EMBEDDING_001,
      outputDimensionality: 768,
    });
  }

  public contentsToEmbeddings = async (
    contents: string[],
  ): Promise<number[][]> => {
    if (contents.length === 0) return [];

    const vectors = await this.embeddings.embedDocuments(contents);
    if (
      !Array.isArray(vectors) ||
      vectors.length === 0 ||
      vectors.every((v) => v.length === 0)
    ) {
      throw new Error(
        `Google Embedding API returned an empty array for ${contents.length} input(s). Check GEMINI_API_KEY and model name.`,
      );
    }

    return vectors;
  };

  public queryToEmbedding = async (query: string) => {
    return await this.embeddings.embedQuery(query);
  };
}

export { EmbeddingService };
