import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/admin.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/", upload.fields([{ name: "image", maxCount: 1 }]),createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;