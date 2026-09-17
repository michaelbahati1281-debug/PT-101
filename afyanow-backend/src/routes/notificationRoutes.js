import { Router } from "express";
import * as c from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";
const router = Router(); router.use(authenticate); router.get("/", c.list); router.patch("/read-all", c.readAll); router.patch("/:id/read", c.read); export default router;
