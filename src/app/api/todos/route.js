import { NextResponse } from "next/server";
import { connectDB } from "@/DB/dbclient";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db("LIVING_SUPPLIES_HUB");
    const todos = await db.collection("Product").find({}).toArray();

    return NextResponse.json(
      todos.length === 0 ? {message: "Todos length is: 0"}: todos
    )
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { message: "Failed to fetch todos", error: error.message },
      { status: 500 }
    );
  }
}
