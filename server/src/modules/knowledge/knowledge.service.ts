import type { ParserService } from "./services/parser.service.ts";
import type { ChunkerService } from "./services/chunker.service.ts";
import type { EmbeddingService } from "./services/embedding.service.ts";
import type { Document } from "@langchain/core/documents";
import type { KnowledgeRepository } from "./knowledge.repository.ts";
import type { Chunk, SearchChunksOptions } from "../../types/knowledge.type.ts";
import { sha256 } from "@langchain/core/utils/hash";

class KnowledgeService {
  private readonly BATCH_SIZE = 15;

  private readonly parseService: ParserService;
  private readonly chunkerService: ChunkerService;
  private readonly embedding: EmbeddingService;
  private readonly knowledgeRepository: KnowledgeRepository;

  constructor(
    parseService: ParserService,
    chunkerService: ChunkerService,
    embedding: EmbeddingService,
    knowledgeRepository: KnowledgeRepository,
  ) {
    this.parseService = parseService;
    this.chunkerService = chunkerService;
    this.embedding = embedding;
    this.knowledgeRepository = knowledgeRepository;
  }

  public uploadFile = async (file: Express.Multer.File) => {
    const content = this.parseService.toMarkdown(
      file.buffer,
      file.originalname,
    );

    const chunks = await this.chunkerService.splitMarkdown(
      content,
      file.originalname,
    );

    const validChunks = chunks.filter((c) => c?.pageContent?.trim().length > 0);

    const finalDoc = [];

    for (let batch = 0; batch < validChunks.length; batch += this.BATCH_SIZE) {
      const batchedChunks = validChunks.slice(batch, batch + this.BATCH_SIZE);

      const chunksContent = batchedChunks.map((c) => c.pageContent);

      const vectors = await this.embedding.contentsToEmbeddings(chunksContent);

      for (let i = 0; i < batchedChunks.length; i++) {
        finalDoc.push({
          pageContent: (batchedChunks[i] as Document).pageContent,
          metadata: (batchedChunks[i] as Document).metadata,
          embedding: vectors[i],
        });
      }
    }

    const finalChunks: Array<Chunk> = [];
    for (let i = 0; i < finalDoc.length; i++) {
      const chunk = finalDoc[i]!;
      const doc: Chunk = {
        sourceId: file.originalname,
        chunkHash: sha256(chunk?.pageContent),
        chunkIndex: i,
        embedding: chunk.embedding as number[],
        embeddingText: chunk.pageContent,
        rawContent: chunk.pageContent,
        metadata: chunk.metadata,
      };

      finalChunks.push(doc);
    }

    await this.knowledgeRepository.saveChunks(file.originalname, finalChunks);
    return finalChunks;
  };

  public searchKnowledge = async (
    query: string,
    options: SearchChunksOptions,
  ) => {
    const queryEmbedding = await this.embedding.queryToEmbedding(query);
    return await this.knowledgeRepository.searchSimilarChunks(
      queryEmbedding,
      options,
    );
  };
}
export { KnowledgeService };
