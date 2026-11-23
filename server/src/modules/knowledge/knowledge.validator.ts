import { z } from "zod";

export const searchKnowledgeSchema = z
  .string({ error: "query is required" })
  .describe(
    "The search query used to look up information in the knowledge base.",
  );

export type SearchKnowledge = z.infer<typeof searchKnowledgeSchema>;
