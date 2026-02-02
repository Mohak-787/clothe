import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {

});

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    if (!products) {
        return res.status(204).json(
            new ApiError(204, "No products available")
        )
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {

});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json(
            new ApiError(404, "Product not found")
        );
    }

    await Product.findByIdAndDelete(id)
    res.status(204).json(
        new ApiResponse(204, "", "Product deleted successfully")
    );
});

export { getProducts, updateProduct, deleteProduct }