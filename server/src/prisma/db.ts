import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };
import pgvector from "@prisma/orm-extension-pgvector/runtime";
import { env } from "../config/env.ts";

export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  extensions: [pgvector],
  url: env.DATABASE_URL,
});
