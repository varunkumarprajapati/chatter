import type { Express } from "express";
import express from "express";
import {
  health,
  noRouteFoundHandler,
} from "./middlewares/security.middleware.ts";
import globalErrorHandler from "./middlewares/error.middleware.ts";

function server(): Express {
  const app = express();

  app.get("/", health);
  app.use(noRouteFoundHandler);
  app.use(globalErrorHandler);

  return app;
}

export { server };
