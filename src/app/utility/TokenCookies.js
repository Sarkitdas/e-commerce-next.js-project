import { CreateToken } from "./JWT_Helper";

export async function Create_TokenCookies(email) {
  const token = await CreateToken(email); // your JWT token

  // return a proper Set-Cookie string
  return `token=${token}; Max-Age=86400; Path=/; HttpOnly; SameSite=Strict`;
}
