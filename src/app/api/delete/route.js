import { connectDB } from "@/DB/dbclient";
import { NextResponse } from "next/server";
import { VerificationToken } from "@/app/utility/JWT_Helper";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "NOT_LOGGED_IN" },
        { status: 401 }
      );
    }

    // Decode token → get email
    const decoded = await VerificationToken(token);
    const email = decoded.email;

    const body = await req.json();
    const { productId } = body;

    // ✅ Validate productId BEFORE deletion
    if (!productId) {
      return NextResponse.json({
        message: "ProductId is required",
        status: "400",
      });
    }

    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");

    const result = await db.collection("Cart").deleteOne({
      email,
      productId,
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: "Deleted successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No document found for this user",
      });
    }
  } catch (error) {
    console.error("Cart Delete Error:", error);
    return NextResponse.json({
      success: false,
      message: "Deleting failed",
      error: error.message,
    });
  }
}
