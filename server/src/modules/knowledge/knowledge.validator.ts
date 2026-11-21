import z from "zod";
import type { InferValidated } from "../../middlewares/validate.middleware.ts";

export const searchKnowledgeSchema = {
  body: z.object({
    query: z.string({ error: "query is required" }),
    sourceIds: z
      .array(z.string({ error: "Source id should be string" }), {
        error: "Array of source id's is required",
      })
      .optional(),
  }),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    minSimilarity: z.coerce.number().min(-1).max(1).optional(),
  }),
};

export type SearchKnowledge = InferValidated<typeof searchKnowledgeSchema>;
