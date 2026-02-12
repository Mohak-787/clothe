import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js"
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import {
    deleteFromCloudinary,
    extractPublicIdFromUrl,
    uploadOnCloudinary
} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/admin.model.js";
import { Order } from "../models/order.model.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : value);

const parseSizes = (sizes, isRequired = false) => {
    if (sizes === undefined) {
        if (isRequired) {
            throw new ApiError(400, "Sizes are required");
        }
        return undefined;
    }

    let parsedSizes = sizes;
    if (typeof sizes === "string") {
        try {
            parsedSizes = JSON.parse(sizes);
        } catch {
            throw new ApiError(400, "Invalid sizes format");
        }
    }

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
        throw new ApiError(400, "Sizes must be a non-empty array");
    }

    const seen = new Set();
    const normalizedSizes = parsedSizes.map((entry) => {
        const size = normalizeString(entry?.size)?.toLowerCase();
        const count = Number(entry?.count);
        if (!size || !Number.isInteger(count) || count < 0) {
            throw new ApiError(400, "Each size must include valid size and count");
        }
        if (seen.has(size)) {
            throw new ApiError(400, "Duplicate sizes are not allowed");
        }
        seen.add(size);
        return { size, count };
    });

    return normalizedSizes;
};

const generateAccessAndRefreshToken = async (adminId) => {
    const admin = await User.findById(adminId);

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const registerAdmin = asyncHandler(async (req, res) => {
    const username = normalizeString(req.body?.username)?.toLowerCase();
    const email = normalizeString(req.body?.email)?.toLowerCase();
    const fullName = normalizeString(req.body?.fullName);
    const password = req.body?.password;

    if ([username, email, fullName, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existedAdmin) {
        throw new ApiError(409, "Admin already exists with this email or username");
    }

    const admin = await User.create({
        username,
        email,
        fullName,
        password
    });

    const createdAdmin = await User.findById(admin._id).select("-password -refreshToken");

    res.status(201).json(
        new ApiResponse(201, createdAdmin, "Admin registered successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const email = normalizeString(req.body?.email)?.toLowerCase();
    const username = normalizeString(req.body?.username)?.toLowerCase();
    const password = req.body?.password;

    if ((!email && !username) || !password) {
        throw new ApiError(400, "Email or username and password are required");
    }

    const admin = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id);
    const loggedInAdmin = await User.findById(admin._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { admin: loggedInAdmin, accessToken, refreshToken }, "Admin logged in successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.admin._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const admin = await User.findById(decodedToken?._id);

    if (!admin || admin.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is invalid");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, req.admin, "Current admin fetched successfully")
    );
});

const createProduct = asyncHandler(async (req, res) => {
    const name = normalizeString(req.body?.name);
    const price = Number(req.body?.price);
    const status = normalizeString(req.body?.status)?.toLowerCase();
    const description = normalizeString(req.body?.description);
    const category = normalizeString(req.body?.category)?.toLowerCase();
    const parsedSizes = parseSizes(req.body?.sizes, true);

    if ([name, status, description, category].some((element) => !element)) {
        throw new ApiError(400, "All fields are required");
    }
    if (!Number.isFinite(price) || price < 0) {
        throw new ApiError(400, "Price must be a valid non-negative number");
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
        image: image?.url || "",
        imagePublicId: image?.public_id || ""
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
    res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const name = normalizeString(req.body?.name);
    const price = req.body?.price !== undefined ? Number(req.body.price) : undefined;
    const status = normalizeString(req.body?.status)?.toLowerCase();
    const description = normalizeString(req.body?.description);
    const category = normalizeString(req.body?.category)?.toLowerCase();
    const sizes = req.body?.sizes;

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

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
        throw new ApiError(404, "Product not found");
    }

    const updatedData = {};

    if (name !== undefined && !name) {
        throw new ApiError(400, "Name cannot be empty");
    }
    if (status !== undefined && !status) {
        throw new ApiError(400, "Status cannot be empty");
    }
    if (description !== undefined && !description) {
        throw new ApiError(400, "Description cannot be empty");
    }
    if (category !== undefined && !category) {
        throw new ApiError(400, "Category cannot be empty");
    }

    if (name !== undefined) updatedData.name = name;
    if (price !== undefined) {
        if (!Number.isFinite(price) || price < 0) {
            throw new ApiError(400, "Price must be a valid non-negative number");
        }
        updatedData.price = price;
    }
    if (status !== undefined) updatedData.status = status;
    if (description !== undefined) updatedData.description = description;
    if (category !== undefined) updatedData.category = category;

    if (sizes !== undefined) {
        updatedData.sizes = parseSizes(sizes);
    }

    const imagePath = req.files?.image?.[0]?.path;
    let hasNewImage = false;

    if (imagePath) {
        const image = await uploadOnCloudinary(imagePath);

        if (!image?.url) {
            throw new ApiError(500, "Image upload failed");
        }

        updatedData.image = image.url;
        updatedData.imagePublicId = image.public_id || "";
        hasNewImage = true;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
    );

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found");
    }

    if (hasNewImage) {
        const previousPublicId =
            existingProduct.imagePublicId || extractPublicIdFromUrl(existingProduct.image);

        await deleteFromCloudinary(previousPublicId);
    }

    res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
});

const getOrders = asyncHandler(async (_, res) => {
    const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .populate("customer_id", "fullName email phone address status")
        .populate("product_id", "name image category price");

    res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(404, "Product not found")
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const publicId = product.imagePublicId || extractPublicIdFromUrl(product.image);

    await Product.findByIdAndDelete(id);
    await deleteFromCloudinary(publicId);

    res.status(200).json(
        new ApiResponse(200, "", "Product deleted successfully")
    );
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    getCurrentAdmin,
    getOrders,
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
}
