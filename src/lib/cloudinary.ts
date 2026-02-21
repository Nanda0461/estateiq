import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export async function uploadImage(
    file: string,
    folder: string = "real-estate"
): Promise<{ url: string; publicId: string }> {
    const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "image",
        transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
        ],
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
}

export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
