import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/admin.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;