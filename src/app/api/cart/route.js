import { NextResponse } from "next/server";
import { connectDB } from "@/DB/dbclient";
import { VerificationToken } from "@/app/utility/JWT_Helper";

// POST → Add to Cart
export async function POST(req) {
  try {

    //read email from token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "NOT_LOGGED_IN" }, { status: 401 });
    }
    const decoded = await VerificationToken(token);
    const email = decoded.email;

    
    const body = await req.json();
    const { productId, price, image ,name,weight } = body;

    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");

    const existing = await db.collection("Cart").findOne({ email, productId });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "ALREADY_IN_CART" },
        { status: 400 }
      );
    }

    await db.collection("Cart").insertOne({
      email,
      productId,
      name,
      image,
      weight,
      price,
      quantity: 1,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST Cart Error:", err);
    return NextResponse.json({ success: false, message: "SERVER_ERROR" }, { status: 500 });
  }
}

// GET → Fetch Cart Items
export async function GET(req) {
  try {
    // 1. Read token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "NOT_LOGGED_IN" }, { status: 401 });
    }

    // 2. Decode token → get email
    const decoded = await VerificationToken(token);
    const email = decoded.email;

    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");

    const cartItems = await db.collection("Cart").find({ email }).toArray();

    return NextResponse.json(cartItems);
  } catch (err) {
    console.error("GET Cart Error:", err);
    return NextResponse.json({ success: false, message: "SERVER_ERROR" }, { status: 500 });
  }
}
