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
import orderRoutes from "./routes/order.route.js"
import { ApiError } from "./utils/ApiError.js";

// routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use((_, __, next) => {
    next(new ApiError(404, "Route not found"));
});

app.use((err, _, res, __) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            success: false,
            errors: err.errors || []
        });
    }

    if (err?.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            statusCode: 400,
            message: "Validation failed",
            success: false,
            errors: messages
        });
    }

    if (err?.code === 11000) {
        return res.status(409).json({
            statusCode: 409,
            message: "Duplicate value",
            success: false,
            errors: [JSON.stringify(err.keyValue)]
        });
    }

    return res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        success: false,
        errors: []
    });
});

export { app }
