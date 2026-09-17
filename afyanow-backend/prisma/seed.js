import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function ensureSingleAdmin() {
  const existing = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existing) return null;
  return prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      firstName: "System",
      lastName: "Administrator",
      email: "admin@afyanow.com",
      phone: "+255700000000",
      passwordHash: await bcrypt.hash("Admin123!", 12),
      role: "ADMIN",
      isActive: true,
    },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  const admin = await ensureSingleAdmin();
  if (admin) console.log(`Created admin account: admin@afyanow.com / Admin123!`);
  const hospital = await prisma.hospital.upsert({ where: { name: "Muhimbili National Hospital" }, update: {}, create: { id: crypto.randomUUID(), name: "Muhimbili National Hospital", address: "Upanga West", region: "Dar es Salaam", district: "Ilala", ward: "Upanga", phone: "+255222150300" } });
  const service = await prisma.service.upsert({ where: { name: "General Medicine" }, update: {}, create: { id: crypto.randomUUID(), name: "General Medicine", description: "General health consultation", category: "Medical" } });
  const user = await prisma.user.upsert({ where: { email: "amina@example.com" }, update: {}, create: { id: crypto.randomUUID(), firstName: "Amina", lastName: "Hassan", email: "amina@example.com", phone: "+255700000001", passwordHash, role: "DOCTOR" } });
  const doctor = await prisma.doctor.upsert({ where: { userId: user.id }, update: {}, create: { id: crypto.randomUUID(), userId: user.id, specialty: "General Medicine", consultationFee: 20000, homeService: true, onlineConsultation: true, languages: ["English", "Swahili"] } });
  await prisma.doctorhospital.upsert({ where: { doctorId_hospitalId: { doctorId: doctor.id, hospitalId: hospital.id } }, update: {}, create: { id: crypto.randomUUID(), doctorId: doctor.id, hospitalId: hospital.id, consultationFee: 20000, homeVisitAvailable: true } });
  await prisma.doctorservice.upsert({ where: { doctorId_serviceId: { doctorId: doctor.id, serviceId: service.id } }, update: {}, create: { doctorId: doctor.id, serviceId: service.id } });
  await prisma.doctoravailability.upsert({ where: { doctorId_hospitalId_dayOfWeek_startTime: { doctorId: doctor.id, hospitalId: hospital.id, dayOfWeek: 1, startTime: "08:00" } }, update: {}, create: { id: crypto.randomUUID(), doctorId: doctor.id, hospitalId: hospital.id, dayOfWeek: 1, startTime: "08:00", endTime: "16:00" } });
}
main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });