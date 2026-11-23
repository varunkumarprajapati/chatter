import z from "zod";
import type { InferValidated } from "../../middlewares/validate.middleware.ts";

export const askBodySchema = z.object({
  query: z.string({ error: "query is required." }),
});

export const askParamsSchema = z.object({
  threadId: z.string({ error: "thread Id is required." }),
});

export const askSchema = {
  body: askBodySchema,
  params: askParamsSchema,
};

export type AskPayload = InferValidated<typeof askSchema>;
