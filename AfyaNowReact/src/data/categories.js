import { Users, Zap } from "lucide-react";

export const serviceCategories = [
  {
    id: "standard",
    label: "Standard",
    icon: Users,
    description: "Regular queue-based access at no extra cost.",
  },
  {
    id: "priority",
    label: "Priority / Convenience",
    icon: Zap,
    description: "Pay a small extra fee to skip the queue and get faster access.",
  },
];

export function getServiceCategory(id) {
  return serviceCategories.find((category) => category.id === id) || null;
}
