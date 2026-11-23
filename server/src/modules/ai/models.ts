import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../../config/env.ts";
import { GEMINI_MODELS } from "../../constants.ts";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  model: GEMINI_MODELS.TEXT_MODEL,
});
