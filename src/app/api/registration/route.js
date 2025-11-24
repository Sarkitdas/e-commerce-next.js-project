import { connectDB } from "@/DB/dbclient";
import { NextResponse } from "next/server";
import { CreateEmailToken } from "@/app/utility/JWT_Helper";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");

    // Check user exists
    let user = await db.collection("nextjs_authentication").findOne({
      email: body.email,
    });

    if (user) {
      return NextResponse.json(
        { message: "User already exists", status: "error" },
        { status: 409 }
      );
    }

    // Generate token
    const verificationToken = await CreateEmailToken(body.email);

    // Insert into DB with TTL field
    await db.collection("nextjs_authentication").insertOne({
      name: body.name,
      address: body.address,
      email: body.email,
      password: body.password,
      isVerified: false,
      verificationToken,
      createdAt: new Date(), // TTL starts counting now
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyURL = `${process.env.NEXT_PUBLIC_BASE_URL}/components/verify-email/?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.email,
      subject: "Verify Your Email",
      html: `<h3>Email Verification</h3>
             <p>Please click the link below to verify your email before 1 minutes:</p>
             <a href="${verifyURL}" target="_blank">${verifyURL}</a>`,
    });

    return NextResponse.json(
      { message: "Signup successful! Verification email sent.", status: "success" },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Adding failed", status: "error", error: error.message },
      { status: 500 }
    );
  }
}
