import { Router } from "express";
import * as c from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
router.get("/", c.users);
router.get("/:id", c.user);
export default router;