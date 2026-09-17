import { prisma } from "../config/prisma.js";
export const notify = (userId, type, title, message) => prisma.notification.create({ data: { userId, type, title, message } });
