import { getDistanceKm } from "./geo";

/* =========================================================
   SORT / RANKING OPTIONS

   Shared by the Specialists and Hospitals pages. "Nearest to
   me" and, where relevant, "Soonest available" / "Lowest
   price" all read from fields already present on the data
   (lat/lng, availabilityHours, feeValue).
========================================================= */

export const SPECIALIST_SORT_OPTIONS = [
  { id: "rating", label: "Top rated first" },
  { id: "distance", label: "Nearest to me" },
  { id: "soonest", label: "Soonest available" },
  { id: "price", label: "Lowest price" },
];

export const HOSPITAL_SORT_OPTIONS = [
  { id: "rating", label: "Top rated first" },
  { id: "distance", label: "Nearest to me" },
];

export function sortDoctors(list, sortKey, userCoords) {
  const items = [...list];

  switch (sortKey) {
    case "distance":
      return items.sort((a, b) => {
        const da = userCoords ? getDistanceKm(userCoords.lat, userCoords.lng, a.lat, a.lng) : null;
        const db = userCoords ? getDistanceKm(userCoords.lat, userCoords.lng, b.lat, b.lng) : null;
        if (da == null && db == null) return b.rating - a.rating;
        if (da == null) return 1;
        if (db == null) return -1;
        return da - db;
      });

    case "soonest":
      return items.sort((a, b) => a.availabilityHours - b.availabilityHours);

    case "price":
      return items.sort((a, b) => a.feeValue - b.feeValue);

    case "rating":
    default:
      return items.sort((a, b) => b.rating - a.rating);
  }
}

export function sortHospitals(list, sortKey, userCoords) {
  const items = [...list];

  switch (sortKey) {
    case "distance":
      return items.sort((a, b) => {
        const da = userCoords ? getDistanceKm(userCoords.lat, userCoords.lng, a.lat, a.lng) : null;
        const db = userCoords ? getDistanceKm(userCoords.lat, userCoords.lng, b.lat, b.lng) : null;
        if (da == null && db == null) return b.rating - a.rating;
        if (da == null) return 1;
        if (db == null) return -1;
        return da - db;
      });

    case "rating":
    default:
      return items.sort((a, b) => b.rating - a.rating);
  }
}
