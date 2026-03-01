import { Router } from "express";
import { placeOrder } from "../controllers/order.controller.js";

const router = Router();

router.route("/").post(placeOrder);

export default router;
