import dotenv from "dotenv";
import path from "node:path";
import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";
import pgvector from "@prisma/orm-extension-pgvector/control";

const currentEnv = (process.env.NODE_ENV ?? "development").trim().toLowerCase();

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${currentEnv}`),
  override: false,
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    `DATABASE_URL is missing. Checked .env.${currentEnv} and process.env.`,
  );
}
export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    extensions: [pgvector],
    db: {
      connection: databaseUrl,
    },
  }),
});
