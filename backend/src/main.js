import { functions, INNGEST } from "./configs/inggest.config.js";
import { clerkMiddleware } from "@clerk/express"
import dbconnect from "./configs/db.config.js";
import ENV from "./configs/env.config.js";
import { serve } from "inngest/express";
import express from "express";
import path from "path"
import cors from "cors"
import postRouter from "./routes/post.routes.js";

const app = express()
const __dirname = path.resolve()

// Middlewares
app.use(express.json())
app.use(clerkMiddleware())
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}))

// Routes
app.use("/api/inngest", serve({ client: INNGEST, functions }));

app.use("/api/posts", postRouter)
app.get("/", (req, res) => {
    return res.send("Hello World")
})

if (ENV.NODE_ENV == "PROD") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("/{*any}", (req, res) => {
        return res
            .sendFile(path.join(__dirname, "../client", "dist", "index.html"))
    })
}


// Listening
app.listen(ENV.PORT, () => {
    dbconnect()
    console.log(`Server is listening at PORT:`, ENV.PORT)
})