import { prisma } from "../config/prisma.js";
import { ok, fail } from "../utils/response.js";
export const list = async (req, res) => ok(res, await prisma.notification.findMany({ where: { userId: req.auth.sub }, orderBy: { createdAt: "desc" } }));
export const read = async (req, res) => { try { const updated = await prisma.notification.update({ where: { id: req.params.id, userId: req.auth.sub }, data: { isRead: true } }); return ok(res, updated); } catch (error) { if (error.code === "P2025") return fail(res, "Notification not found", "NOT_FOUND", 404); throw error; } };
export const readAll = async (req, res) => { await prisma.notification.updateMany({ where: { userId: req.auth.sub, isRead: false }, data: { isRead: true } }); return ok(res, null, "Notifications marked as read"); };
