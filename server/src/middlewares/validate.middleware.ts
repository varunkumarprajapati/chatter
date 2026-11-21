import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType, type z } from "zod";

export interface RequestSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export type InferValidated<T extends RequestSchemas> = {
  [K in keyof T as T[K] extends ZodType ? K : never]: T[K] extends ZodType
    ? z.infer<T[K]>
    : never;
};

export const validate =
  (schemas: RequestSchemas) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated: Record<string, unknown> = {};

      if (schemas.params) {
        validated.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        validated.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        validated.body = await schemas.body.parseAsync(req.body);
      }

      res.locals.validated = validated;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((issue) => ({
            path: issue.path.join(".") || "root",
            message: issue.message,
          })),
        });
        return;
      }
      next(err);
    }
  };

export const validateBody = (schema: ZodType) => validate({ body: schema });
export const validateQuery = (schema: ZodType) => validate({ query: schema });
export const validateParams = (schema: ZodType) => validate({ params: schema });
