import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
};

const uploadOnCloudinary = async (filePath) => {
    try {
        configureCloudinary();

        if (!filePath) return null
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        });
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return response
    } catch (error) {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return null;
    }
};

const extractPublicIdFromUrl = (url) => {
    if (!url) return null;

    const marker = "/upload/";
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) return null;

    let pathAfterUpload = url.substring(markerIndex + marker.length);
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");
    const extensionIndex = pathAfterUpload.lastIndexOf(".");
    if (extensionIndex === -1) return pathAfterUpload;

    return pathAfterUpload.substring(0, extensionIndex);
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        configureCloudinary();
        return await cloudinary.uploader.destroy(publicId, { invalidate: true });
    } catch {
        return null;
    }
};

export { uploadOnCloudinary, extractPublicIdFromUrl, deleteFromCloudinary }
