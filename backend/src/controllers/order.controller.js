import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : value);

const placeOrder = asyncHandler(async (req, res) => {
    const fullName = normalizeString(req.body?.fullName);
    const email = normalizeString(req.body?.email)?.toLowerCase();
    const phone = normalizeString(req.body?.phone);
    const address = normalizeString(req.body?.address);
    const payment = normalizeString(req.body?.payment)?.toLowerCase();
    const shipping = normalizeString(req.body?.shipping)?.toLowerCase();
    const productId = normalizeString(req.body?.productId);
    const size = normalizeString(req.body?.size)?.toLowerCase();
    const quantity = req.body?.quantity;

    if (
        [fullName, email, phone, address, payment, shipping, productId, size].some(
            (field) => !field || String(field).trim() === ""
        )
    ) {
        throw new ApiError(400, "All order fields are required");
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        throw new ApiError(400, "Quantity must be a positive integer");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(404, "Product not found");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    if (product.status !== "active") {
        throw new ApiError(400, "This product is not available for ordering");
    }

    const selectedSize = product.sizes.find((item) => item.size === size);
    if (!selectedSize) {
        throw new ApiError(400, "Selected size is not available");
    }

    if (selectedSize.count < parsedQuantity) {
        throw new ApiError(400, "Requested quantity is not in stock");
    }

    const stockUpdateResult = await Product.updateOne(
        {
            _id: productId,
            "sizes.size": size,
            "sizes.count": { $gte: parsedQuantity }
        },
        {
            $inc: { "sizes.$.count": -parsedQuantity }
        }
    );

    if (stockUpdateResult.modifiedCount !== 1) {
        throw new ApiError(400, "Product stock changed, please try again");
    }

    try {
        let customer = await Customer.findOne({ email, phone });

        if (customer) {
            customer.fullName = fullName;
            customer.address = address;
            customer.status = "active";
            await customer.save();
        } else {
            customer = await Customer.create({
                fullName,
                email,
                phone,
                address,
                status: "active"
            });
        }

        const totalPrice = product.price * parsedQuantity;

        const order = await Order.create({
            quantity: parsedQuantity,
            size,
            totalPrice,
            status: "pending",
            payment,
            shipping,
            customer_id: customer._id,
            product_id: product._id
        });

        const createdOrder = await Order.findById(order._id)
            .populate("customer_id", "fullName email phone address")
            .populate("product_id", "name price image category");

        res.status(201).json(
            new ApiResponse(201, createdOrder, "Order placed successfully")
        );
    } catch (error) {
        await Product.updateOne(
            { _id: productId, "sizes.size": size },
            { $inc: { "sizes.$.count": parsedQuantity } }
        );
        throw error;
    }
});

export { placeOrder };
