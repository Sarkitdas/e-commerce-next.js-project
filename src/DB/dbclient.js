import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

let clientPromise;

export async function connectDB() {
  if (!clientPromise) {
    clientPromise = (async () => {
      await client.connect();
      const db = client.db("nextjs-authentication");

      try {
        // --- UPDATED TTL INDEX ---
        await db.collection("nextjs_authentication").createIndex(
          { createdAt: 1 }, // Index the creation time
          { expireAfterSeconds: 900 } // Set expiration to 900 seconds (15 minutes)
        );
        console.log(" TTL index on 'createdAt' field set to 15 minutes");
      } catch (err) {
        console.error(" Failed to create TTL index:", err.message);
      }

      return client;
    })();
  }

  return clientPromise;
}
