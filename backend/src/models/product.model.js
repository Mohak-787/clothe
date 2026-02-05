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
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sizes: [
        {
            size: {
                type: String,
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);