import { MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { modelCall, tools } from "./chat.tool.ts";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { postgresCheckpointer } from "../ai/checkpointer.ts";
import { AIMessage } from "@langchain/core/messages";

class ChatService {
  private readonly app;
  constructor() {
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("agent", modelCall)
      .addNode("tools", new ToolNode(tools))
      .addEdge(START, "agent")
      .addConditionalEdges("agent", toolsCondition)
      .addEdge("tools", "agent");
    this.app = workflow.compile({ checkpointer: postgresCheckpointer });
    this.askStream = this.askStream.bind(this);
  }

  async *askStream(content: string, threadId: string) {
    const stream = await this.app.stream(
      {
        messages: [
          {
            role: "human",
            content: content,
          },
        ],
      },
      {
        configurable: {
          thread_id: threadId,
        },
        streamMode: "messages",
      },
    );

    for await (const [messageChunk, metadata] of stream) {
      if (
        AIMessage.isInstance(messageChunk) &&
        typeof messageChunk.content === "string" &&
        messageChunk.content.length > 0
      ) {
        yield messageChunk.content;
      }
    }
  }
}

export { ChatService };
