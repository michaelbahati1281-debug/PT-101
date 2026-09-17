import { prisma } from "../config/prisma.js";
import { ok, fail } from "../utils/response.js";

export async function users(req, res) {
  const { role, search } = req.query;
  const where = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };
  const data = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      patient: true,
      doctor: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, data);
}

export async function user(req, res) {
  const data = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      patient: true,
      doctor: { select: { id: true, specialty: true, consultationFee: true, homeService: true, onlineConsultation: true } },
    },
  });
  return data
    ? ok(res, data)
    : fail(res, "User not found", "NOT_FOUND", 404);
}
