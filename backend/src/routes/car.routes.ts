import { Router } from "express";
import { createCarHandler } from "@/controllers/car.controller";

const router = Router();

router.post("/", createCarHandler);

export { router as carRouter };