import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";
import { ok, fail } from "../utils/response.js";
import { notify } from "../services/notificationService.js";

async function appointmentForUser(req) {
  const user = await prisma.user.findUnique({ where: { id: req.auth.sub }, include: { patient: true, doctor: true } });
  if (user.role === "PATIENT") return { mode: "PATIENT", id: user.patient.id };
  if (user.role === "DOCTOR") return { mode: "DOCTOR", id: user.doctor.id };
  return { mode: "STAFF" };
}

function canAccess(appointment, access) {
  if (access.mode === "STAFF") return true;
  if (access.mode === "PATIENT") return appointment.patientId === access.id;
  if (access.mode === "DOCTOR") return appointment.doctorId === access.id;
  return false;
}

export async function create(req, res) {
  const patient = await prisma.patient.findUnique({ where: { userId: req.auth.sub } });
  if (!patient) return fail(res, "A patient profile is required", "PATIENT_PROFILE_REQUIRED", 403);
  const body = req.body;
  const doctor = await prisma.doctor.findUnique({ where: { id: body.doctorId } });
  if (!doctor) return fail(res, "Doctor not found", "NOT_FOUND", 404);
  if (body.visitType === "HOME" && (!doctor.homeService || !body.homeAddress)) return fail(res, "This doctor does not support home visits with the supplied address", "HOME_VISIT_UNAVAILABLE", 422);
  if (body.visitType === "HOSPITAL") {
    if (!body.hospitalId) return fail(res, "A hospital is required for a hospital visit", "VALIDATION_ERROR", 422);
    const relation = await prisma.doctorhospital.findUnique({ where: { doctorId_hospitalId: { doctorId: doctor.id, hospitalId: body.hospitalId } } });
    if (!relation?.isActive) return fail(res, "This doctor does not practise at that hospital", "INVALID_HOSPITAL", 422);
  }
  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const service = await tx.doctorservice.findUnique({ where: { doctorId_serviceId: { doctorId: doctor.id, serviceId: body.serviceId } } });
      if (!service) throw Object.assign(new Error("The doctor does not provide that service"), { code: "INVALID_SERVICE" });
      const homeVisitAddress = body.visitType === "HOME" ? await tx.homevisitaddress.create({ data: { patientId: patient.id, ...body.homeAddress } }) : null;
      return tx.appointment.create({ data: { appointmentNumber: `AFY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, patientId: patient.id, doctorId: doctor.id, hospitalId: body.hospitalId, serviceId: body.serviceId, visitType: body.visitType, homeVisitAddressId: homeVisitAddress?.id, date: new Date(`${body.date}T00:00:00.000Z`), startTime: body.startTime, endTime: body.endTime, consultationType: body.consultationType, reason: body.reason, paymentStatus: "UNPAID" } });
    });
    await notify(req.auth.sub, "APPOINTMENT_BOOKED", "Appointment created", "Your appointment is awaiting payment verification.");
    return ok(res, appointment, "Appointment created successfully", 201);
  } catch (error) {
    if (error.code === "P2002") return fail(res, "This appointment slot is no longer available", "SLOT_UNAVAILABLE", 409);
    throw error;
  }
}
export async function list(req, res) { const user = await prisma.user.findUnique({ where: { id: req.auth.sub }, include: { patient: true, doctor: true } }); const where = user.role === "PATIENT" ? { patientId: user.patient.id } : user.role === "DOCTOR" ? { doctorId: user.doctor.id } : {}; return ok(res, await prisma.appointment.findMany({ where, include: { doctor: { include: { user: true } }, hospital: true, service: true, payment: true }, orderBy: { date: "asc" } })); }
export async function byId(req, res) { const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id }, include: { doctor: { include: { user: true } }, hospital: true, service: true, payment: true } }); if (!appointment) return fail(res, "Appointment not found", "NOT_FOUND", 404); if (!canAccess(appointment, await appointmentForUser(req))) return fail(res, "You cannot view this appointment", "FORBIDDEN", 403); return ok(res, appointment); }
const SCHEDULED_STATUSES = ["PENDING", "CONFIRMED", "RESCHEDULED"];
export async function cancel(req, res) { const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } }); if (!appointment) return fail(res, "Appointment not found", "NOT_FOUND", 404); if (!canAccess(appointment, await appointmentForUser(req))) return fail(res, "You cannot cancel this appointment", "FORBIDDEN", 403); if (!SCHEDULED_STATUSES.includes(appointment.status)) return fail(res, "This appointment cannot be cancelled in its current state", "INVALID_STATUS", 422); const updated = await prisma.appointment.update({ where: { id: appointment.id }, data: { status: "CANCELLED" } }); await notify(appointment.patientId ? (await prisma.patient.findUnique({ where: { id: appointment.patientId } }))?.userId : req.auth.sub, "APPOINTMENT_CANCELLED", "Appointment cancelled", "Your appointment has been cancelled."); return ok(res, updated, "Appointment cancelled successfully"); }
export async function reschedule(req, res) { const { date, startTime, endTime } = req.body; const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } }); if (!appointment) return fail(res, "Appointment not found", "NOT_FOUND", 404); if (!canAccess(appointment, await appointmentForUser(req))) return fail(res, "You cannot reschedule this appointment", "FORBIDDEN", 403); if (!SCHEDULED_STATUSES.includes(appointment.status)) return fail(res, "This appointment cannot be rescheduled in its current state", "INVALID_STATUS", 422); try { const updated = await prisma.appointment.update({ where: { id: appointment.id }, data: { date: new Date(`${date}T00:00:00.000Z`), startTime, endTime, status: "RESCHEDULED" } }); await notify(appointment.patientId ? (await prisma.patient.findUnique({ where: { id: appointment.patientId } }))?.userId : req.auth.sub, "APPOINTMENT_RESCHEDULED", "Appointment rescheduled", "Your appointment time has been updated."); return ok(res, updated, "Appointment rescheduled successfully"); } catch (error) { if (error.code === "P2002") return fail(res, "This appointment slot is no longer available", "SLOT_UNAVAILABLE", 409); throw error; } }
