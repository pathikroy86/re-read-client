import "@/lib/dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoDbName, getMongoUri } from "./env";

if (!process.env.MONGODB_URI && !process.env.MONGODB_DIRECT_URI) {
    throw new Error("Please define MONGODB_URI or MONGODB_DIRECT_URI in .env");
}

const client = new MongoClient(getMongoUri());
const db = client.db(getMongoDbName());

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
});
