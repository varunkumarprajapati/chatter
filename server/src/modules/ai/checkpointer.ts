import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";
import { env } from "../../config/env.ts";

export const langgraphPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 5, // Reserve at most 5 connections for checkpoints
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const postgresCheckpointer = new PostgresSaver(
  langgraphPool,
  undefined,
  {
    schema: "langgraph",
  },
);
