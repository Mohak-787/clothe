import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new ApiError(204, "No products available")
  }

  res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Product not found")
  }

  const product = await Product.findById(id);

  res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
})

const getProductByName = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const product = Product.findOne({ name: name });

  if (!product) {
    throw new ApiError(204, "No products available")
  }

  res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
})

const getProductByCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;

  const products = Product.find({ category: category });

  if (!products) {
    throw new ApiError(204, "No products available")
  }

  res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

export { getProducts, getProductByName, getProductByCategory, getProductById }