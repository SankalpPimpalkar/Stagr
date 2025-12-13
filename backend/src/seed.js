import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import User from "./models/user.model.js";   // adjust if your path is different
import Post from "./models/post.model.js";   // adjust path
dotenv.config();


// Connect
await mongoose.connect(process.env.DB_URL);
console.log("Connected to DB for seeding posts.");

async function seedPosts() {
    try {
        // Remove existing posts
        await Post.deleteMany({});
        console.log("Cleared existing posts.");

        // Fetch existing users
        const users = await User.find({});
        if (users.length === 0) {
            throw new Error("No users in DB — seeding cannot proceed without owners!");
        }

        const total = 50;
        const posts = [];

        for (let i = 0; i < total; i++) {
            const owner = users[Math.floor(Math.random() * users.length)];

            // Random likes from existing users (can be empty)
            const likes = faker.helpers
                .shuffle(users)
                .slice(0, faker.number.int({ min: 0, max: users.length }))
                .map(u => u._id);

            posts.push({
                images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) })
                    .map(() => faker.image.url()),
                tags: faker.helpers
                    .shuffle(["fun", "tech", "dev", "life", "coding", "random"])
                    .slice(0, faker.number.int({ min: 1, max: 5 })),
                description: faker.lorem.sentence(),
                owner: owner._id,
                likes,
            });
        }

        await Post.insertMany(posts);
        console.log(`Seeded ${total} posts!`);
    } catch (err) {
        console.error("Seeding failed:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

await seedPosts();
