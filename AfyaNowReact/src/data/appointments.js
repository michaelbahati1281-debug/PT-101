/* =========================================================
   APPOINTMENTS — DATA + LOCALSTORAGE HELPERS
========================================================= */

export const STORAGE_KEY = "afyanowAppointment";

export const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export const consultationTypes = [
  { id: "in-person", label: "In-Person Visit" },
  { id: "online", label: "Online Consultation" },
  { id: "home-visit", label: "Home Visit" },
];

/* Read the single active/upcoming appointment saved by the
   booking flow (kept as an object, not an array, to match the
   existing afyanowAppointment key used by BookAppointment). */
export function getAppointment() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAppointment(appointment) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointment));
}

export function cancelAppointment() {
  const appointment = getAppointment();
  if (!appointment) return null;

  const updated = { ...appointment, status: "Cancelled" };
  saveAppointment(updated);
  return updated;
}

export function rescheduleAppointment(newDate, newTime) {
  const appointment = getAppointment();
  if (!appointment) return null;

  const updated = {
    ...appointment,
    date: newDate,
    time: newTime,
    status: "Confirmed",
  };
  saveAppointment(updated);
  return updated;
}

/* Realistic sample past appointments for the prototype. These
   are static (not persisted) since they represent history that
   would normally come from a backend. */
export const pastAppointments = [
  {
    id: "past-1",
    doctorName: "Dr. Sarah Emmanuel",
    specialty: "Dermatology",
    hospital: "Muhimbili National Hospital",
    date: "2026-06-14",
    status: "Completed",
  },
  {
    id: "past-2",
    doctorName: "Dr. Patrick George",
    specialty: "Orthopaedics",
    hospital: "Mwananyamala Regional Referral Hospital",
    date: "2026-04-02",
    status: "Completed",
  },
  {
    id: "past-3",
    doctorName: "Dr. Amina Hassan",
    specialty: "General Medicine",
    hospital: "Muhimbili National Hospital",
    date: "2026-02-20",
    status: "Cancelled",
  },
];
