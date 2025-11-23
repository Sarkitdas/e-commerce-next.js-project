//src/utility/JWT_Helper.js

import { SignJWT, jwtVerify } from "jose";

// ✅ Create JWT
export async function CreateToken(email) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER)
    .setExpirationTime(process.env.JWT_EXPIRATION)
    .sign(secret);

  return token;        //return only token
}


export async function CreateEmailToken(email) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(process.env.JWT_ISSUER)
      .setExpirationTime(process.env.JWT_EXPIRATION_EMAIL) // e.g., "15m"
      .sign(secret);

    return token;
  } catch (err) {
    console.error("Error creating email token:", err);
    throw err; // so API can catch it
  }
}




// ✅ Verify and decode JWT
export async function VerificationToken(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const decoded = await jwtVerify(token, secret);

  // decoded has structure: { payload, protectedHeader }
  return decoded.payload; // ✅ return only payload
}
