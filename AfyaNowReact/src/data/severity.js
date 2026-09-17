import { Smile, Meh, AlertTriangle, Siren } from "lucide-react";

/* =========================================================
   CONDITION SEVERITY LEVELS

   Used by the specialist "Quick Find" search and by the
   booking flow so patients can flag how urgent their
   condition is. This never replaces professional medical
   judgement — it only helps route the patient to the right
   access tier (standard queue vs Priority/Convenience) and,
   for Emergency, points them to immediate in-person care.
========================================================= */

export const severityLevels = [
  {
    id: "mild",
    label: "Mild",
    icon: Smile,
    description: "Manageable symptoms that aren't affecting daily activities.",
    guidance: "Standard booking is usually fine — pick any time that suits you.",
    recommendedCategory: "standard",
    tone: "success",
  },
  {
    id: "moderate",
    label: "Moderate",
    icon: Meh,
    description: "Noticeable symptoms that should be checked soon.",
    guidance: "Consider booking within the next few days.",
    recommendedCategory: "standard",
    tone: "info",
  },
  {
    id: "severe",
    label: "Severe",
    icon: AlertTriangle,
    description: "Significant symptoms that need prompt attention.",
    guidance: "Priority/Convenience access can get you seen faster.",
    recommendedCategory: "priority",
    tone: "warning",
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: Siren,
    description: "Life-threatening symptoms needing immediate care.",
    guidance: "Don't wait for an appointment — go to the nearest hospital or call 112 (Ambulance) immediately.",
    recommendedCategory: "priority",
    tone: "danger",
  },
];

export function getSeverityLevel(id) {
  return severityLevels.find((level) => level.id === id) || null;
}
