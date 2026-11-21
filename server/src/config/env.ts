import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

const EnvironmentSchema = z.enum(["development", "production", "test"]);
type Environment = z.infer<typeof EnvironmentSchema>;

// Support both ENV=... and standard NODE_ENV=...
const rawEnv = (process.env.NODE_ENV ?? "development").trim().toLowerCase();
const parsedEnv = EnvironmentSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  console.error(
    `Invalid ENV "${rawEnv}". Expected one of: ${EnvironmentSchema.options.join(", ")}`,
  );
  process.exit(1);
}

const currentEnv: Environment = parsedEnv.data;

// Load .env.development or .env.production from project root.
// If the file does not exist (e.g., secrets injected directly in production), dotenv safely skips it.
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${currentEnv}`),
  override: false,
});

const EnvVariablesSchema = z.object({
  NODE_ENV: z.literal(currentEnv).default(currentEnv),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  DATABASE_URL: z.string({ error: "DATABASE_URL is required" }),
  CLIENT_URL: z.string({ error: "CLIENT_URL is required" }),
  GEMINI_API_KEY: z.string({ error: "GEMINI_API_KEY is required" }),
});

const parsedVariables = EnvVariablesSchema.safeParse({
  ...process.env,
  NODE_ENV: currentEnv,
});

if (!parsedVariables.success) {
  console.error(
    "Environment validation failed:",
    z.flattenError(parsedVariables.error).fieldErrors,
  );
  process.exit(1);
}

export const env = parsedVariables.data;
