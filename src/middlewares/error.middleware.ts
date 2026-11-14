import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import createHttpError, { isHttpError } from "http-errors";

async function globalErrorHandler(
  err: any,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.error(err);
  let statusCode = err.status || 500;
  let errorName = "InternalServerError";
  let message = "Internal Server Error";

  if (err instanceof ZodError) {
    const firstIssueMessage = err.issues[0]?.message || "Validation failed";
    err = createHttpError(400, firstIssueMessage);
  } else if (isHttpError(err)) {
    statusCode = err.statusCode;
    errorName = err.name;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorName,
    message: message,
  });
}

export default globalErrorHandler;
