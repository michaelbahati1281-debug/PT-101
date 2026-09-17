import { Router } from "express";
import * as c from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  adminCreatePatientSchema,
  adminCreateDoctorSchema,
  adminUpdatePatientSchema,
  adminUpdateDoctorSchema,
  setUserStatusSchema,
  setUserRoleSchema,
} from "../validators/schemas.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/stats", c.adminStats);

router.get("/patients", c.adminPatients);
router.get("/patients/:id", c.adminPatient);
router.post("/patients", validate(adminCreatePatientSchema), c.createPatient);
router.put("/patients/:id", validate(adminUpdatePatientSchema), c.updatePatient);
router.delete("/patients/:id", c.deletePatient);

router.get("/doctors", c.adminDoctors);
router.get("/doctors/:id", c.adminDoctor);
router.post("/doctors", validate(adminCreateDoctorSchema), c.createDoctor);
router.put("/doctors/:id", validate(adminUpdateDoctorSchema), c.updateDoctor);
router.delete("/doctors/:id", c.deleteDoctor);

router.patch("/users/:id/status", validate(setUserStatusSchema), c.setUserStatus);
router.patch("/users/:id/role", validate(setUserRoleSchema), c.setUserRole);

export default router;