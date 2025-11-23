import { connectDB } from "@/DB/dbclient";
import { NextResponse } from "next/server";
import { VerificationToken } from "@/app/utility/JWT_Helper";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "NOT_LOGGED_IN" }, { status: 401 });
    }

    const decoded = await VerificationToken(token);
    const userEmail = decoded.email;

    const body = await req.json();
    const { cartItems, totalPrice, totaltax, totalshipping } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, message: "No items to order" }, { status: 400 });
    }

    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");

    const orderDoc = {
      userEmail,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        weight: item.weight
      })),
      totalPrice,
      totaltax,
      totalshipping,
      orderDate: new Date(),
      status: "pending"
    };

    await db.collection("Orders").insertOne(orderDoc);
    await db.collection("Cart").deleteMany({ email: userEmail });

    return NextResponse.json({ message: "Order placed successfully", status: "success" });

  } catch (error) {
    return NextResponse.json({ message: "Order failed", status: "error", error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value; 
    if (!token) {
      return NextResponse.json({ success: false, message: "NOT_LOGGED_IN" }, { status: 401 });
    }
    const decoded = await VerificationToken(token);
    const userEmail = decoded.email;
    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");
    const orders = await db.collection("Orders").find({ userEmail }).toArray();
    return NextResponse.json({ status: "success", data: orders });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders", status: "error", error: error.message }, { status: 500 });
  }
}