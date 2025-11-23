import { cookies } from "next/headers";
import { VerificationToken } from "@/app/utility/JWT_Helper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Await cookies() because it returns a Promise
    const cookieStore = await cookies();

    //Retrieves the token cookie
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;

    console.log("Token from cookie:", token);

    if (!token) return NextResponse.json({ email: null });

    //decode/validate the token
    const decoded = await VerificationToken(token);
    console.log("Decoded token:", decoded);

    //Returns the decoded email inside
    return NextResponse.json({ email: decoded?.email ?? null });
  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json({ email: null });
  }
}
