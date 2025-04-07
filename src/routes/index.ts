import { Router } from "express";
import AdminRoutes from "./admin.routes";

const router = Router();

router.use("/admin", AdminRoutes);

export default router;
