import type { JsonValue } from "@prisma/orm-postgres/utils";

export interface Chunk {
  sourceId: string;
  chunkIndex: number;
  chunkHash: string;
  embeddingText: string;
  rawContent: string;
  embedding: number[];
  metadata: JsonValue;
}

export interface SearchChunksOptions {
  limit?: number | undefined;
  minSimilarity?: number | undefined;
  sourceIds?: string[] | undefined;
}
