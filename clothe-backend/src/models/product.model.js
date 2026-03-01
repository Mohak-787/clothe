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
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["active", "inactive", "archived"]
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
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
    },
    imagePublicId: {
        type: String
    }
}, { timestamps: true });

productSchema.path("sizes").validate(function (sizes) {
    if (!Array.isArray(sizes) || sizes.length === 0) return false;

    const seen = new Set();
    for (const entry of sizes) {
        const normalizedSize = entry?.size?.trim()?.toLowerCase();
        if (!normalizedSize || seen.has(normalizedSize)) return false;
        if (!Number.isFinite(entry?.count) || entry.count < 0) return false;
        seen.add(normalizedSize);
    }

    return true;
}, "Sizes must be unique and contain valid stock counts");

export const Product = mongoose.model("Product", productSchema);
