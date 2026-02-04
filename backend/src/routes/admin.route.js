import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/admin.controller.js";

const router = Router();

router.route("/products").get(getProducts);
router.route("/products").post(upload.fields([{ name: "image", maxCount: 1 }]),createProduct);
router.route("/products/:id").patch(upload.fields([{ name: "image", maxCount: 1 }]), updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;