import { hospitals } from "./hospitals";

/* =========================================================
   SPECIALISTS

   Field notes:
   - facilities: a specialist can practise at more than one
     health centre. Each entry references a hospitalId from
     hospitals.js (for name/location/coordinates) plus the
     days they see patients there. facilities[0] is treated
     as the primary/default facility.
   - homeService: whether this specialist offers home visits.
   - categories: which access tiers this specialist offers —
     "standard" (public queue) and/or "priority" (paid
     Priority/Convenience fast-track).
   - availabilityHours: hours from now until their next open
     slot. Used to sort by "Soonest available" and to derive
     a human label (Available Today / Tomorrow / in X days).
   - feeValue: numeric consultation fee (TSh) used for
     "Lowest price" sorting; consultationFee is the display
     string version.
========================================================= */

function findHospital(hospitalId) {
  return hospitals.find((h) => h.id === hospitalId);
}

function buildFacilities(entries) {
  return entries.map(({ hospitalId, days }) => {
    const hospital = findHospital(hospitalId);
    return {
      hospitalId,
      name: hospital ? hospital.name : "Unknown Facility",
      location: hospital ? hospital.location : "",
      lat: hospital ? hospital.lat : null,
      lng: hospital ? hospital.lng : null,
      days,
    };
  });
}

export function getAvailabilityLabel(hours) {
  if (hours <= 24) return "Available Today";
  if (hours <= 48) return "Available Tomorrow";
  const days = Math.ceil(hours / 24);
  return `Available in ${days} days`;
}

const rawDoctors = [
  {
    id: 1,
    name: "Dr. Amina Hassan",
    specialty: "General Medicine",
    facilityEntries: [
      { hospitalId: 1, days: ["Mon", "Tue", "Wed", "Thu"] },
      { hospitalId: 6, days: ["Sat"] },
    ],
    experience: "10 years",
    rating: 4.8,
    reviews: 124,
    availabilityHours: 6,
    feeValue: 20000,
    homeService: true,
    homeServiceFee: 15000,
    categories: ["standard", "priority"],
    priorityFeeExtra: 15000,
    image: null,
    about:
      "Dr. Amina Hassan is an experienced medical doctor providing general medical consultations, diagnosis and treatment for common health conditions.",
    languages: ["English", "Swahili"],
  },
  {
    id: 2,
    name: "Dr. John Michael",
    specialty: "Cardiology",
    facilityEntries: [
      { hospitalId: 1, days: ["Mon", "Wed", "Fri"] },
      { hospitalId: 5, days: ["Tue", "Thu"] },
    ],
    experience: "12 years",
    rating: 4.9,
    reviews: 98,
    availabilityHours: 30,
    feeValue: 50000,
    homeService: false,
    categories: ["standard", "priority"],
    priorityFeeExtra: 25000,
    image: null,
    about:
      "Dr. John Michael specializes in cardiovascular health, heart disease prevention, diagnosis and treatment.",
    languages: ["English", "Swahili"],
  },
  {
    id: 3,
    name: "Dr. Neema Joseph",
    specialty: "Paediatrics",
    facilityEntries: [{ hospitalId: 2, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] }],
    experience: "8 years",
    rating: 4.7,
    reviews: 86,
    availabilityHours: 4,
    feeValue: 25000,
    homeService: true,
    homeServiceFee: 18000,
    categories: ["standard"],
    priorityFeeExtra: 0,
    image: null,
    about:
      "Dr. Neema Joseph provides healthcare services for infants, children and adolescents.",
    languages: ["English", "Swahili"],
  },
  {
    id: 4,
    name: "Dr. David Peter",
    specialty: "Dentistry",
    facilityEntries: [{ hospitalId: 6, days: ["Mon", "Wed", "Fri", "Sat"] }],
    experience: "7 years",
    rating: 4.6,
    reviews: 71,
    availabilityHours: 10,
    feeValue: 30000,
    homeService: false,
    categories: ["standard"],
    priorityFeeExtra: 0,
    image: null,
    about:
      "Dr. David Peter provides preventive dental care, diagnosis and treatment of dental conditions.",
    languages: ["English", "Swahili"],
  },
  {
    id: 5,
    name: "Dr. Sarah Emmanuel",
    specialty: "Dermatology",
    facilityEntries: [
      { hospitalId: 1, days: ["Tue", "Thu"] },
      { hospitalId: 7, days: ["Mon", "Wed"] },
    ],
    experience: "9 years",
    rating: 4.8,
    reviews: 92,
    availabilityHours: 28,
    feeValue: 40000,
    homeService: false,
    categories: ["standard", "priority"],
    priorityFeeExtra: 20000,
    image: null,
    about:
      "Dr. Sarah Emmanuel specializes in diagnosis and treatment of skin, hair and nail conditions.",
    languages: ["English", "Swahili", "French"],
  },
  {
    id: 6,
    name: "Dr. Patrick George",
    specialty: "Orthopaedics",
    facilityEntries: [{ hospitalId: 2, days: ["Mon", "Tue", "Thu"] }],
    experience: "11 years",
    rating: 4.7,
    reviews: 63,
    availabilityHours: 12,
    feeValue: 45000,
    homeService: false,
    categories: ["standard", "priority"],
    priorityFeeExtra: 20000,
    image: null,
    about:
      "Dr. Patrick George provides assessment and treatment of bone, joint and muscle conditions.",
    languages: ["English", "Swahili"],
  },
  {
    id: 7,
    name: "Dr. Fatuma Rajabu",
    specialty: "Maternity",
    facilityEntries: [
      { hospitalId: 3, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      { hospitalId: 7, days: ["Sat"] },
    ],
    experience: "14 years",
    rating: 4.9,
    reviews: 156,
    availabilityHours: 5,
    feeValue: 35000,
    homeService: true,
    homeServiceFee: 20000,
    categories: ["standard", "priority"],
    priorityFeeExtra: 22000,
    image: null,
    about:
      "Dr. Fatuma Rajabu offers antenatal, delivery and postnatal care for mothers and newborns.",
    languages: ["English", "Swahili", "Arabic"],
  },
  {
    id: 8,
    name: "Dr. Elias Mrema",
    specialty: "Surgery",
    facilityEntries: [
      { hospitalId: 1, days: ["Mon", "Wed"] },
      { hospitalId: 9, days: ["Fri"] },
    ],
    experience: "16 years",
    rating: 4.8,
    reviews: 112,
    availabilityHours: 52,
    feeValue: 80000,
    homeService: false,
    categories: ["priority"],
    priorityFeeExtra: 0,
    image: null,
    about:
      "Dr. Elias Mrema is a general surgeon experienced in both elective and emergency surgical procedures.",
    languages: ["English", "Swahili"],
  },
  {
    id: 9,
    name: "Dr. Grace Kimaro",
    specialty: "General Medicine",
    facilityEntries: [{ hospitalId: 10, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] }],
    experience: "6 years",
    rating: 4.4,
    reviews: 38,
    availabilityHours: 3,
    feeValue: 18000,
    homeService: true,
    homeServiceFee: 12000,
    categories: ["standard"],
    priorityFeeExtra: 0,
    image: null,
    about:
      "Dr. Grace Kimaro provides general consultations, diagnosis and treatment in Arusha region.",
    languages: ["English", "Swahili"],
  },
  {
    id: 10,
    name: "Dr. Omar Said",
    specialty: "Cardiology",
    facilityEntries: [{ hospitalId: 11, days: ["Mon", "Wed", "Fri"] }],
    experience: "13 years",
    rating: 4.6,
    reviews: 74,
    availabilityHours: 40,
    feeValue: 48000,
    homeService: false,
    categories: ["standard", "priority"],
    priorityFeeExtra: 24000,
    image: null,
    about:
      "Dr. Omar Said manages cardiovascular conditions at Bugando Medical Centre, serving the Lake Zone.",
    languages: ["English", "Swahili"],
  },
];

export const doctors = rawDoctors.map((doctor) => {
  const facilities = buildFacilities(doctor.facilityEntries);
  const primary = facilities[0];
  const consultationFee = `TSh ${doctor.feeValue.toLocaleString()}`;

  return {
    ...doctor,
    facilities,
    hospital: primary.name,
    location: primary.location,
    lat: primary.lat,
    lng: primary.lng,
    consultationFee,
    availability: getAvailabilityLabel(doctor.availabilityHours),
  };
});

export const specialties = [
  "All",
  ...Array.from(new Set(doctors.map((doctor) => doctor.specialty))).sort(),
];

export const languageOptions = [
  "All",
  ...Array.from(new Set(doctors.flatMap((doctor) => doctor.languages))).sort(),
];
