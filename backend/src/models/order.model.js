import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    size: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    payment: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["cod", "khalti", "esewa", "card", "bank-transfer"]
    },
    shipping: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["standard", "express", "pickup"]
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Customer"
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    }
}, { timestamps: true });

orderSchema.index({ customer_id: 1, createdAt: -1 });
orderSchema.index({ product_id: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema)
