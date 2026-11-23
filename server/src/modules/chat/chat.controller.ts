import type { Request, Response } from "express";

import { ChatService } from "./chat.service.ts";
import type { AskPayload } from "./chat.validator.ts";

class ChatController {
  public readonly chatService: ChatService;

  constructor(chatServie: ChatService) {
    this.chatService = chatServie;
  }

  public ask = async (req: Request, res: Response) => {
    const { body, params } = res.locals.validated as AskPayload;
    const { query } = body;
    const { threadId } = params;

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    let clientDisconnected = false;
    req.on("close", () => {
      clientDisconnected = true;
    });

    try {
      for await (const token of this.chatService.askStream(query, threadId)) {
        if (clientDisconnected) break;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }

      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    } finally {
      res.end();
    }
  };
}

export { ChatController };
