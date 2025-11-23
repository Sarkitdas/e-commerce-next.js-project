import { NextResponse } from "next/server";
import { connectDB } from "@/DB/dbclient";
import { Create_TokenCookies } from "@/app/utility/TokenCookies";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          status: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Connect to DB
    const client = await connectDB();
    const db = client.db("nextjs-authentication");
    const users = db.collection("nextjs_authentication");

    // Find user by email
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check Email Verification
    if (!user.isVerified) {
      return NextResponse.json(
        {
          status: false,
          message: "Please verify your email before logging in.",
        },
        { status: 403 }
      );
    }

    // Check password (plain for now)
    if (user.password !== password) {
      return NextResponse.json(
        {
          status: false,
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    // Create token cookie
    const cookie = await Create_TokenCookies(email);

    return NextResponse.json(
      {
        status: true,
        message: "Login successful",
        email,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Logout function
  return NextResponse.json(
    { status: true, message: "Logout success" },
    {
      headers: {
        "Set-Cookie": `token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`,
      },
    }
  );
}
      