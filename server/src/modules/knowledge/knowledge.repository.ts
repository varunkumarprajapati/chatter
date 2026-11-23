import { db } from "../../prisma/db.ts";
import type { Chunk } from "../../types/knowledge.type.ts";

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

  public searchSimilarChunks = async (queryVector: number[]) => {
    const limit = 5;
    const minSimilarity = 0.5;
    const maxDistance = 1 - minSimilarity;

    const plan = db.sql.public.knowledge_chunk
      .select((c) => ({
        id: c.id,
        sourceId: c.source_id,
        chunkIndex: c.chunk_index,
        rawContent: c.raw_content,
        metadata: c.metadata,
      }))
      .select("distance", (f, fns) =>
        fns.cosineDistance(f.embedding, queryVector),
      )
      .orderBy((f, fns) => fns.cosineDistance(f.embedding, queryVector), {
        direction: "asc",
      })
      .limit(limit)
      .build();

    const rows = await db.query(plan);

    return rows.filter((row) => row.distance <= maxDistance);
  };
}

export { KnowledgeRepository };
