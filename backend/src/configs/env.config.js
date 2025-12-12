import { configDotenv } from "dotenv"
configDotenv()

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY
}

export default ENV