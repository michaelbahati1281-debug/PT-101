import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";
import { ok, fail } from "../utils/response.js";

/* =========================================================
   SHARED HELPERS
========================================================= */

export const ADMIN_LIMIT_REACHED = "Only one admin account is allowed in the system.";

async function countAdmins() {
  return prisma.user.count({ where: { role: "ADMIN" } });
}

async function targetIsAdmin(userId) {
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return target?.role === "ADMIN";
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const publicUser = ({ passwordHash, ...user }) => user;

async function createUserWithProfile({ role = "PATIENT", password, profile = {}, ...details }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const profileKey = role === "DOCTOR" ? "doctor" : "patient";
  const profileData =
    role === "DOCTOR"
      ? {
          id: crypto.randomUUID(),
          specialty: "General Practitioner",
          consultationFee: 0,
          languages: [],
          ...pickDefined(profile),
        }
      : { id: crypto.randomUUID(), ...pickDefined({ ...profile, dateOfBirth: toDate(profile.dateOfBirth) }) };
  const user = await prisma.user.create({
    data: { id: crypto.randomUUID(), ...details, role, passwordHash, [profileKey]: { create: profileData } },
    include: { [profileKey]: true },
  });
  return publicUser(user);
}

function pickDefined(obj) {
  return Object.fromEntries(Object.entries(obj || {}).filter(([, v]) => v !== undefined));
}

/* =========================================================
   STATS
========================================================= */

export async function adminStats(req, res) {
  const [patients, doctors, staff, admins, allUsers] = await Promise.all([
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.user.count({ where: { role: "DOCTOR" } }),
    prisma.user.count({ where: { role: "HOSPITAL_STAFF" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.findMany({ select: { id: true, role: true, isActive: true } }),
  ]);
  const total = allUsers.length;
  const inactive = allUsers.filter((u) => !u.isActive).length;
  const pendingDoctors = await prisma.doctor.count({ where: { consultationFee: 0 } });
  return ok(res, {
    total,
    patients,
    doctors,
    staff,
    admins,
    inactive,
    pendingDoctors,
    appointments: await prisma.appointment.count(),
  });
}

/* =========================================================
   PATIENTS
========================================================= */

export async function adminPatients(req, res) {
  const { search } = req.query;
  const where = {
    role: "PATIENT",
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
    include: { patient: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, data.map(publicUser));
}

export async function adminPatient(req, res) {
  const data = await prisma.user.findUnique({ where: { id: req.params.id }, include: { patient: true } });
  return data && data.role === "PATIENT"
    ? ok(res, publicUser(data))
    : fail(res, "Patient not found", "NOT_FOUND", 404);
}

export async function createPatient(req, res) {
  const { profile = {}, ...body } = req.body;
  const user = await createUserWithProfile({ ...body, role: "PATIENT", profile });
  return ok(res, { user, patient: user.patient }, "Patient account created successfully", 201);
}

export async function updatePatient(req, res) {
  const { password, isActive, profile = {}, ...details } = req.body;
  const target = await prisma.user.findUnique({ where: { id: req.params.id }, include: { patient: true } });
  if (!target || target.role !== "PATIENT") return fail(res, "Patient not found", "NOT_FOUND", 404);

  const patientData = pickDefined({
    dateOfBirth: profile.dateOfBirth !== undefined ? toDate(profile.dateOfBirth) : undefined,
    gender: profile.gender,
    address: profile.address,
    region: profile.region,
    district: profile.district,
    ward: profile.ward,
  });

  const saved = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: target.id },
      data: {
        ...pickDefined(details),
        ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(Object.keys(patientData).length ? { patient: { update: patientData } } : {}),
      },
      include: { patient: true },
    });
    return user;
  });
  return ok(res, publicUser(saved), "Patient updated successfully");
}

export async function deletePatient(req, res) {
  const id = req.params.id;
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true, email: true } });
  if (!target) return fail(res, "Patient not found", "NOT_FOUND", 404);
  if (target.role !== "PATIENT") return fail(res, "Only patient accounts can be deleted here", "FORBIDDEN", 403);
  await prisma.user.delete({ where: { id } });
  return ok(res, null, "Patient account deleted successfully");
}

/* =========================================================
   DOCTORS
========================================================= */

export async function adminDoctors(req, res) {
  const { search } = req.query;
  const where = {
    role: "DOCTOR",
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
            { doctor: { is: { specialty: { contains: search, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };
  const data = await prisma.user.findMany({
    where,
    include: { doctor: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, data.map(publicUser));
}

export async function adminDoctor(req, res) {
  const data = await prisma.user.findUnique({ where: { id: req.params.id }, include: { doctor: true } });
  return data && data.role === "DOCTOR"
    ? ok(res, publicUser(data))
    : fail(res, "Doctor not found", "NOT_FOUND", 404);
}

export async function createDoctor(req, res) {
  const { profile = {}, ...body } = req.body;
  const user = await createUserWithProfile({ ...body, role: "DOCTOR", profile });
  return ok(res, { user: publicUser(user), doctor: user.doctor }, "Doctor account created successfully", 201);
}

export async function updateDoctor(req, res) {
  const { password, isActive, profile = {}, ...details } = req.body;
  const target = await prisma.user.findUnique({ where: { id: req.params.id }, include: { doctor: true } });
  if (!target || target.role !== "DOCTOR") return fail(res, "Doctor not found", "NOT_FOUND", 404);

  const doctorData = pickDefined({
    specialty: profile.specialty,
    category: profile.category,
    bio: profile.bio,
    experience: profile.experience,
    consultationFee: profile.consultationFee,
    homeService: profile.homeService,
    onlineConsultation: profile.onlineConsultation,
    languages: profile.languages,
  });

  const saved = await prisma.$transaction(async (tx) => {
    return tx.user.update({
      where: { id: target.id },
      data: {
        ...pickDefined(details),
        ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(Object.keys(doctorData).length ? { doctor: { update: doctorData } } : {}),
      },
      include: { doctor: true },
    });
  });
  return ok(res, publicUser(saved), "Doctor updated successfully");
}

export async function deleteDoctor(req, res) {
  const id = req.params.id;
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!target) return fail(res, "Doctor not found", "NOT_FOUND", 404);
  if (target.role !== "DOCTOR") return fail(res, "Only doctor accounts can be deleted here", "FORBIDDEN", 403);
  await prisma.user.delete({ where: { id } });
  return ok(res, null, "Doctor account deleted successfully");
}

/* =========================================================
   USER STATUS / ROLE  (confirm & manage users)
========================================================= */

export async function setUserStatus(req, res) {
  const { isActive } = req.body;
  const id = req.params.id;
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!target) return fail(res, "User not found", "NOT_FOUND", 404);
  if (req.auth?.sub === id) return fail(res, "You cannot change your own account status", "FORBIDDEN", 403);
  if (target.role === "ADMIN" && !isActive) return fail(res, "The admin account cannot be deactivated", "FORBIDDEN", 403);

  const saved = await prisma.user.update({ where: { id }, data: { isActive } });
  return ok(res, { id: saved.id, isActive: saved.isActive }, isActive ? "User activated successfully" : "User deactivated successfully");
}

export async function setUserRole(req, res) {
  const { role } = req.body;
  const id = req.params.id;
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!target) return fail(res, "User not found", "NOT_FOUND", 404);
  if (req.auth?.sub === id) return fail(res, "You cannot change your own role", "FORBIDDEN", 403);

  if (role === "ADMIN") {
    const adminCount = await countAdmins();
    if (adminCount >= 1) return fail(res, ADMIN_LIMIT_REACHED, "ADMIN_LIMIT", 409);
  }

  if (target.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await countAdmins();
    if (adminCount <= 1) return fail(res, "The only admin account cannot be demoted", "FORBIDDEN", 403);
  }

  const saved = await prisma.user.update({ where: { id }, data: { role } });
  return ok(res, { id: saved.id, role: saved.role }, "User role updated successfully");
}