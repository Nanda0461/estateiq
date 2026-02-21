export const config = {
    database: {
        url: process.env.DATABASE_URL || "",
    },
    auth: {
        secret: process.env.NEXTAUTH_SECRET || "",
        url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
} as const;
