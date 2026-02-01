import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: Text,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);