import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const createAccessToken = (user) => jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: "15m" });
export const createRefreshToken = (user) => jwt.sign({ sub: user.id, role: user.role }, env.jwtRefreshSecret, { expiresIn: "7d" });
