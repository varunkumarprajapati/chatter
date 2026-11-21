#!/usr/bin/env -S node
import type { Contract as End } from "../../snapshots/b281be40921c3eb15ba7f5e2503168049896f014c86a2bbc301b23c402f1f04e/contract";
import endContract from "../../snapshots/b281be40921c3eb15ba7f5e2503168049896f014c86a2bbc301b23c402f1f04e/contract.json" with { type: "json" };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  primaryKey,
  rawSql,
  sql,
} from "@prisma/orm-postgres/migration";

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: "public" }),
      this.createTable({
        schema: "public",
        table: "knowledge_chunk",
        columns: [
          col("chunk_hash", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("chunk_index", "int4", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("created_at", "timestamptz(3)", {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: "pg/timestamptz-date@1",
              typeParams: { precision: 3 },
            },
          }),
          col("embedding", "vector(768)", {
            notNull: true,
            codecRef: { codecId: "pg/vector@1", typeParams: { length: 768 } },
          }),
          col("embedding_text", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("id", "uuid", {
            notNull: true,
            codecRef: { codecId: "pg/uuid@1" },
          }),
          col("metadata", "json", { codecRef: { codecId: "pg/json@1" } }),
          col("raw_content", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("source_id", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("updated_at", "timestamptz(3)", {
            notNull: true,
            codecRef: {
              codecId: "pg/timestamptz-date@1",
              typeParams: { precision: 3 },
            },
          }),
        ],
        constraints: [primaryKey(["id"])],
      }),
      this.createIndex({
        schema: "public",
        table: "knowledge_chunk",
        index: "knowledge_chunk_chunk_hash_idx_56328283",
        columns: ["chunk_hash"],
      }),
      this.createIndex({
        schema: "public",
        table: "knowledge_chunk",
        index: "knowledge_chunk_source_id_idx_b2d19e21",
        columns: ["source_id"],
      }),
      rawSql({
        id: "index.knowledge_chunk.embedding_hnsw",
        label: 'Create HNSW cosine index on "knowledge_chunk"."embedding"',
        operationClass: "additive",
        target: { id: "postgres" },
        execute: [
          {
            description:
              "create hnsw cosine index on knowledge_chunk.embedding",
            sql: 'CREATE INDEX IF NOT EXISTS "knowledge_chunk_embedding_hnsw_idx" ON "public"."knowledge_chunk" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64)',
          },
        ],
        precheck: [],
        postcheck: [],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
