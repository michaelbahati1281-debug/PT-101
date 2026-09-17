import { Router } from "express";
import * as c from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { appointmentSchema, rescheduleSchema } from "../validators/schemas.js";
const router = Router(); router.use(authenticate); router.post("/", validate(appointmentSchema), c.create); router.get("/", c.list); router.get("/:id", c.byId); router.post("/:id/cancel", c.cancel); router.post("/:id/reschedule", validate(rescheduleSchema), c.reschedule); export default router;
