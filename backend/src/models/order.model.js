import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    payment: {
        type: String,
        required: true
    },
    shipping: {
        type: String,
        required: true
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema)