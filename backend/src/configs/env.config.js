import { configDotenv } from "dotenv"
configDotenv()

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    CLOUDINARY_CLOUDNAME: process.env.CLOUDINARY_CLOUDNAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}

export default ENV