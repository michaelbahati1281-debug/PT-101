import { Router } from "express";
import * as controller from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";
const router = Router();
router.post("/register", validate(registerSchema), controller.register); router.post("/login", validate(loginSchema), controller.login); router.post("/logout", controller.logout); router.post("/refresh", controller.refresh); router.get("/me", authenticate, controller.me);
router.post("/forgot-password", (req, res) => res.status(501).json({ success: false, message: "Password reset delivery needs an email provider configuration", error: "NOT_CONFIGURED" }));
router.post("/reset-password", (req, res) => res.status(501).json({ success: false, message: "Password reset delivery needs an email provider configuration", error: "NOT_CONFIGURED" })); export default router;
