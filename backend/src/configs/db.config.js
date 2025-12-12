import mongoose from "mongoose";
import ENV from "../configs/env.config.js";

export default async function dbconnect() {
    try {
        const response = await mongoose.connect(ENV.DB_URL)
        console.log(`✅ Connected to MongoDB: ${response.connection.host}`)
    } catch (error) {
        console.error("❌ MongoDB Connection Error", error)
        process.exit(1)
    }
}