import { connectDB } from "@/DB/dbclient";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        JSON.stringify({ status: "error", message: "No token provided" }),
        { status: 400 }
      );
    }

    const collect = await connectDB();
    const db = collect.db("nextjs-authentication");

    const user = await db
      .collection("nextjs_authentication")
      .findOne({ verificationToken: token });

    if (!user) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Invalid or expired token",
        }),
        { status: 400 }
      );
    }

    await db.collection("nextjs_authentication").updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: { verificationToken: "", expiry: "",createdAt:"" }, // stops TTL deletion
      }
    );

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Email verified successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    );
  }
}
