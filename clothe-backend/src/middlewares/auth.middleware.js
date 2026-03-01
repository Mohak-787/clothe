import jwt from "jsonwebtoken";
import { User } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWTAdmin = asyncHandler(async (req, _, next) => {
    const authHeader = req.header("Authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;
    const token = tokenFromHeader || req.cookies?.accessToken;

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired access token");
    }

    const admin = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!admin) {
        throw new ApiError(401, "Invalid access token");
    }

    req.admin = admin;
    next();
});

export { verifyJWTAdmin };
