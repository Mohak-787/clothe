import { Router } from "express";
import { getProducts, getProductByCategory, getProductById, getProductByName } from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(getProducts);
router.route("/id/:id").get(getProductById);
router.route("/name/:name").get(getProductByName);
router.route("/category/:category").get(getProductByCategory);

export default router;
