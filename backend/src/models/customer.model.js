import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String, 
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["active", "blocked"],
        default: "active"
    }
}, { timestamps: true });

customerSchema.index({ email: 1, phone: 1 }, { unique: true });

export const Customer = mongoose.model("Customer", customerSchema);
