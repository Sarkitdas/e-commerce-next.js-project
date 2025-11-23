import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;

const client = new MongoClient(url);

export async function connectDB() {
  await client.connect();
  return client;
}
