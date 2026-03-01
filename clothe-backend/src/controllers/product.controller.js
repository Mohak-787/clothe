import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Product not found")
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
})

const getProductByName = asyncHandler(async (req, res) => {
  const name = req.params?.name?.trim();
  if (!name) {
    throw new ApiError(400, "Product name is required");
  }

  const product = await Product.findOne({ name: new RegExp(`^${escapeRegExp(name)}$`, "i") });

  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
})

const getProductByCategory = asyncHandler(async (req, res) => {
  const category = req.params?.category?.trim()?.toLowerCase();
  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const products = await Product.find({ category });

  res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

export { getProducts, getProductByName, getProductByCategory, getProductById }
