import { Router } from "express";
import * as c from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { paymentSchema } from "../validators/schemas.js";
const router = Router(); router.post("/webhook", c.webhook); router.use(authenticate); router.post("/initiate", validate(paymentSchema), c.initiate); router.get("/:id", c.getPayment); router.post("/verify", (req, res) => res.status(501).json({ success: false, message: "Payment verification is provider-webhook only", error: "NOT_AVAILABLE" })); router.get("/appointment/:appointmentId", c.getPaymentByAppointment); export default router;
