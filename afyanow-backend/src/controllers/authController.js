import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ok, fail } from "../utils/response.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
const publicUser = ({ passwordHash, ...user }) => user;
export async function register(req, res) { const { password, role = "PATIENT", ...details } = req.body; const passwordHash = await bcrypt.hash(password, 12); const profile = role === "DOCTOR" ? { doctor: { create: { id: crypto.randomUUID(), specialty: "General Practitioner", consultationFee: 0, languages: [] } } } : { patient: { create: { id: crypto.randomUUID() } } }; const user = await prisma.user.create({ data: { id: crypto.randomUUID(), ...details, role, passwordHash, ...profile } }); return ok(res, { user: publicUser(user) }, "Account created successfully", 201); }
export async function login(req, res) { const { identifier, password } = req.body; const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }], isActive: true } }); if (!user || !(await bcrypt.compare(password, user.passwordHash))) return fail(res, "Incorrect email/phone or password", "INVALID_CREDENTIALS", 401); return ok(res, { user: publicUser(user), accessToken: createAccessToken(user), refreshToken: createRefreshToken(user) }, "Logged in successfully"); }
export async function me(req, res) { const user = await prisma.user.findUnique({ where: { id: req.auth.sub }, include: { patient: true, doctor: true } }); return user ? ok(res, publicUser(user)) : fail(res, "User not found", "NOT_FOUND", 404); }
export async function refresh(req, res) { try { const payload = jwt.verify(req.body.refreshToken, env.jwtRefreshSecret); const user = await prisma.user.findUnique({ where: { id: payload.sub } }); if (!user || !user.isActive) return fail(res, "Invalid refresh token", "UNAUTHENTICATED", 401); return ok(res, { accessToken: createAccessToken(user) }); } catch { return fail(res, "Invalid refresh token", "UNAUTHENTICATED", 401); } }
export const logout = (req, res) => ok(res, null, "Logged out successfully");
