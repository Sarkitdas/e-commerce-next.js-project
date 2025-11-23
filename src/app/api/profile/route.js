import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/DB/dbclient";
import { VerificationToken } from "@/app/utility/JWT_Helper";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    const decoded = await VerificationToken(token);
    const userEmail = decoded.email;

    const connect = await connectDB();
    const db = connect.db("nextjs-authentication");

    const user = await db
      .collection("nextjs_authentication")
      .findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
