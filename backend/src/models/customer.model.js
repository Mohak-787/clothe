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
        trim: true
    }
}, { timestamps: true });

export const Customer = mongoose.Model("Customer", customerSchema);