import { connectDB } from "@/DB/dbclient";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const collect = await connectDB();
    const db = collect.db("LIVING_SUPPLIES_HUB");

    const result = await db.collection("Product").updateOne(
      { _id: new ObjectId(body.id) }, // search database item id = user insert id
      {
        $set: {
          name: body.name,
          weight: body.weight,
          price: body.price,
        },
      }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({
        message: "No Data Found in Database",
      });
    } else {
      return NextResponse.json({
        message: "Succefully Updated!",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Error is",
      status: "500",
      error: message.error,
    });
  }
}
