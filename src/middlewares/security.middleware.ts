import type { CorsOptions } from "cors";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { env } from "../config/env.ts";

const urls = env.CLIENT_URL;
const allowedOrigins = urls ? urls.split(",").map((u: string) => u.trim()) : [];

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(requestOrigin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

async function noRouteFoundHandler(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  next(
    createHttpError(
      404,
      `API endpoint not found: ${req.method} ${req.originalUrl}`,
    ),
  );
}

async function health(_: Request, res: Response) {
  return res.status(200).json({ status: "ok", message: "Server is running" });
}

export { corsOptions, noRouteFoundHandler, health };
