import express from "express";
import { deleteProduct, createProduct, getProducts, getProduct, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.route("/").get(getProducts);
router.route("/:id").get(getProduct);

router.route("/").post(createProduct);

router.route("/:id").put(updateProduct);

router.route("/:id").delete(deleteProduct);

export default router;