import { db } from "../../prisma/db.ts";
import type { Chunk, SearchChunksOptions } from "../../types/knowledge.type.ts";

class KnowledgeRepository {
  private readonly BATCH_SIZE = 100;
  public saveChunks = async (sourceId: string, chunks: Array<Chunk>) => {
    await db.transaction(async (tx) => {
      await tx.orm.public.KnowledgeChunk.where({ sourceId }).deleteAll();
      for (let i = 0; i < chunks.length; i += this.BATCH_SIZE) {
        const batch = chunks.slice(i, i + this.BATCH_SIZE).map((c) => ({
          source_id: sourceId,
          chunk_index: c.chunkIndex,
          chunk_hash: c.chunkHash,
          embedding_text: c.embeddingText,
          raw_content: c.rawContent,
          embedding: c.embedding,
          metadata: c.metadata,
        }));

        const plan = tx.sql.public.knowledge_chunk.insert(batch).build();
        await tx.execute(plan);
      }
    });
  };
  public searchSimilarChunks = async (
    queryVector: number[],
    options: SearchChunksOptions,
  ) => {
    const { limit = 5, minSimilarity = 0.7, sourceIds } = options;
    const maxDistance = 1 - minSimilarity;

    let query = db.sql.public.knowledge_chunk
      .select((c) => ({
        id: c.id,
        sourceId: c.source_id,
        chunkHash: c.chunk_hash,
        chunkIndex: c.chunk_index,
        rawContent: c.raw_content,
        embeddingText: c.embedding_text,
        metadata: c.metadata,
      }))
      .select("distance", (f, fns) =>
        fns.cosineDistance(f.embedding, queryVector),
      )
      .where((f, fns) =>
        fns.lte(fns.cosineDistance(f.embedding, queryVector), maxDistance),
      );

    if (sourceIds?.length) {
      query = query.where((f, fns) => fns.in(f.source_id, sourceIds));
    }

    const plan = query
      .orderBy((f, fns) => fns.cosineDistance(f.embedding, queryVector), {
        direction: "asc",
      })
      .limit(limit)
      .build();

    return db.query(plan);
  };
}

export { KnowledgeRepository };
