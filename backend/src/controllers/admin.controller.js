import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js"
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, status, description, category, sizes } = req.body;

    if ([name, price, status, description, category].some((element) => element === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let parsedSizes = sizes;
    if (typeof sizes === "string") {
        try {
            parsedSizes = JSON.parse(sizes);
        } catch (error) {
            throw new ApiError(400, "Invalid sizes format");
        }
    }

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
        throw new ApiError(400, "Sizes are required");
    }

    const existedProduct = await Product.findOne({
        $or: [{ name }]
    })

    if (existedProduct) {
        throw new ApiError(409, "Product already exists")
    }

    const imagePath = req.files?.image?.[0]?.path;

    if (!imagePath) {
        throw new ApiError(400, "Image is required")
    }

    const image = await uploadOnCloudinary(imagePath);

    if (!image) {
        throw new ApiError(500, "Internal server error")
    }

    const product = await Product.create({
        name,
        price,
        status,
        description,
        category,
        sizes: parsedSizes,
        image: image?.url || ""
    })

    const newProduct = await Product.findById(product._id)

    if (!newProduct) {
        throw new ApiError(500, "Something went wrong creating new product")
    }

    res.status(201).json(
        new ApiResponse(201, newProduct, "Product created successfully")
    )
});

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    if (!products) {
        throw new ApiError(204, "No products available")
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, status, description, category, sizes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Product not found");
    }

    if (name !== undefined) {
        const existedProduct = await Product.findOne({
            name,
            _id: { $ne: id }
        });

        if (existedProduct) {
            throw new ApiError(409, "Product with this name already exists");
        }
    }

    const updatedData = {};

    if (name !== undefined) updatedData.name = name;
    if (price !== undefined) updatedData.price = price;
    if (status !== undefined) updatedData.status = status;
    if (description !== undefined) updatedData.description = description;
    if (category !== undefined) updatedData.category = category;

    if (sizes !== undefined) {

        let parsedSizes = sizes;

        if (typeof sizes === "string") {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch (error) {
                throw new ApiError(400, "Invalid sizes format");
            }
        }

        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
            throw new ApiError(400, "Sizes must be a non-empty array");
        }

        updatedData.sizes = parsedSizes;
    }

    const imagePath = req.files?.image?.[0]?.path;

    if (imagePath) {
        const image = await uploadOnCloudinary(imagePath);

        if (!image?.url) {
            throw new ApiError(500, "Image upload failed");
        }

        updatedData.image = image.url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
    );

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found");
    }

    res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Product not found")
    }

    await Product.findByIdAndDelete(id)
    res.status(204).json(
        new ApiResponse(204, "", "Product deleted successfully")
    );
});

export { createProduct, getProducts, updateProduct, deleteProduct }