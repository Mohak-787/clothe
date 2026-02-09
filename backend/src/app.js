import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import adminRoutes from "./routes/admin.route.js";
import productRoutes from "./routes/product.route.js"

// routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes);

export { app }