import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";
export function calculateAppointmentTotal(appointment) { const base = Number(appointment.doctor.consultationFee); const homeFee = appointment.visitType === "HOME" ? 10000 : 0; const platformFee = 2000; return { consultationFee: base, homeFee, platformFee, total: base + homeFee + platformFee, currency: "TZS" }; }
export async function createPayment(appointment, patientId, method) { const quote = calculateAppointmentTotal(appointment); return prisma.payment.create({ data: { appointmentId: appointment.id, patientId, amount: quote.total, method, transactionReference: `AFY-${crypto.randomUUID()}` } }); }
export function verifyWebhookSignature(signature, rawBody) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || "";
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody || "").digest("hex");
  const received = Buffer.from(signature, "utf8");
  const valid = Buffer.from(expected, "utf8");
  if (received.length !== valid.length) return false;
  return crypto.timingSafeEqual(received, valid);
}
