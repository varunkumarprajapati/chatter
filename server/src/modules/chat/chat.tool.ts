import { tool } from "@langchain/core/tools";
import { MessagesAnnotation } from "@langchain/langgraph";
import { searchKnowledgeSchema } from "../knowledge/knowledge.validator.ts";
import { knowledgeService } from "../knowledge/knowledge.route.ts";
import { llm } from "../ai/models.ts";
import { SYSTEM_PROMPT } from "./chat.prompt.ts";

export const searchKnowledgeTool = tool(
  async (query: string) => {
    const result = await knowledgeService.searchKnowledge(query);

    if (result.length === 0) {
      return "No relevant information found in the knowledge base.";
    }

    return result.map((item) => item.rawContent).join("\n\n---\n\n");
  },
  {
    name: "searchKnowledgeTool",
    description:
      "Searches the internal knowledge base for relevant documents, policies, FAQs, and reference information. Use this tool whenever you need specific facts or context to answer the user's question accurately.",
    schema: searchKnowledgeSchema,
  },
);

export const tools = [searchKnowledgeTool];
const llmWithTools = llm.bindTools(tools);

export async function modelCall(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke([
    SYSTEM_PROMPT,
    ...state.messages,
  ]);
  return { messages: [response] };
}
