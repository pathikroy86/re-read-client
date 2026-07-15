import "@/lib/dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
}

function getMongoUri() {
    return process.env.MONGODB_URI!.replace(
        "@cluster0.exh2zgz.mongodb.net/?appName=Cluster0",
        "@ac-8wcx1qf-shard-00-00.exh2zgz.mongodb.net:27017,ac-8wcx1qf-shard-00-01.exh2zgz.mongodb.net:27017,ac-8wcx1qf-shard-00-02.exh2zgz.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-hpoy7r-shard-0&retryWrites=true&w=majority&appName=Cluster0"
    ).replace("mongodb+srv://", "mongodb://");
}

const client = new MongoClient(getMongoUri());
const db = client.db("ReRead");

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
