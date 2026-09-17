import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { fail } from "../utils/response.js";
export function authenticate(req, res, next) { const token = req.headers.authorization?.replace(/^Bearer\s+/i, ""); if (!token) return fail(res, "Authentication is required", "UNAUTHENTICATED", 401); try { req.auth = jwt.verify(token, env.jwtSecret); next(); } catch { return fail(res, "Your session is invalid or has expired", "UNAUTHENTICATED", 401); } }
export const authorize = (...roles) => (req, res, next) => roles.includes(req.auth?.role) ? next() : fail(res, "You are not allowed to perform this action", "FORBIDDEN", 403);
