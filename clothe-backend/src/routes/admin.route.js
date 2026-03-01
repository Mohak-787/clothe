import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import {
    createProduct,
    deleteProduct,
    getCurrentAdmin,
    getOrders,
    getProducts,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    registerAdmin,
    updateProduct
} from "../controllers/admin.controller.js";
import { verifyJWTAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWTAdmin, logoutAdmin);
router.route("/me").get(verifyJWTAdmin, getCurrentAdmin);
router.route("/orders").get(verifyJWTAdmin, getOrders);

router.route("/products").get(verifyJWTAdmin, getProducts);
router.route("/products").post(verifyJWTAdmin, upload.fields([{ name: "image", maxCount: 1 }]), createProduct);
router.route("/products/:id").patch(verifyJWTAdmin, upload.fields([{ name: "image", maxCount: 1 }]), updateProduct);
router.route("/products/:id").delete(verifyJWTAdmin, deleteProduct);

export default router;
