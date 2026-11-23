import express from "express";
import multer from "multer";

import {
  ChunkerService,
  EmbeddingService,
  ParserService,
} from "./services/index.ts";
import { KnowledgeController } from "./knowledge.controller.ts";
import { KnowledgeService } from "./knowledge.service.ts";
import { KnowledgeRepository } from "./knowledge.repository.ts";

const router = express.Router();

const service = new KnowledgeService(
  new ParserService(),
  new ChunkerService(),
  new EmbeddingService(),
  new KnowledgeRepository(),
);

const controller = new KnowledgeController(service);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), controller.uploadKnowleage);

export default router;
export { service as knowledgeService };
