import type { Express } from "express";
import express from "express";

import {
  health,
  noRouteFoundHandler,
} from "./middlewares/security.middleware.ts";
import globalErrorHandler from "./middlewares/error.middleware.ts";

import knowledgeRouter from "./modules/knowledge/knowledge.route.ts";

function server(): Express {
  const app = express();
  app.use(express.json());

  app.get("/", health);
  app.use("/api/v1/knowledge", knowledgeRouter);
  app.use(noRouteFoundHandler);
  app.use(globalErrorHandler);

  return app;
}

export { server };
