import { Router } from "express";
import * as c from "../controllers/catalogController.js";
import { authenticate } from "../middleware/auth.js";
const doctors = Router(); doctors.get("/", c.doctors); doctors.get("/:id", c.doctor); doctors.get("/:id/hospitals", c.doctorHospitals); doctors.get("/:id/services", c.doctorServices); doctors.get("/:id/availability", c.availability); doctors.get("/:id/available-slots", c.availability);
const hospitals = Router(); hospitals.get("/", c.hospitals); hospitals.get("/:id", c.hospital); hospitals.get("/:id/doctors", c.hospitalDoctors); hospitals.get("/:id/services", c.hospitalServices); hospitals.get("/:id/appointments", authenticate, c.hospitalAppointments);
const services = Router(); services.get("/", c.services); services.get("/:id", c.service); services.get("/:id/doctors", c.serviceDoctors); services.get("/:id/hospitals", c.serviceHospitals); export { doctors, hospitals, services };
