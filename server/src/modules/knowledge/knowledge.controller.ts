import type { Request, Response } from "express";
import createHttpError from "http-errors";

import type { KnowledgeService } from "./knowledge.service.ts";

class KnowledgeController {
  private readonly knowledgeService: KnowledgeService;
  constructor(knowledgeService: KnowledgeService) {
    this.knowledgeService = knowledgeService;
  }
  public uploadKnowleage = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    if (!req.file) {
      throw createHttpError(404, "Uploaded file not found");
    }

    const result = await this.knowledgeService.uploadFile(req.file);

    return res.json({ sucess: true, data: { result } });
  };
}

export { KnowledgeController };
