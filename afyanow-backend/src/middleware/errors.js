import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { fail } from "../utils/response.js";
export function notFound(req, res) { return fail(res, "The requested resource was not found", "NOT_FOUND", 404); }
export function errorHandler(error, req, res, next) { console.error(error); if (error instanceof ZodError) return fail(res, "Please check the submitted information", "VALIDATION_ERROR", 422); if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return fail(res, "That record already exists", "CONFLICT", 409); return fail(res, "Something went wrong. Please try again.", "INTERNAL_ERROR", 500); }
