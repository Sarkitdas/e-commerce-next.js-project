import { NextResponse } from "next/server";
import { CheckCookieAuth } from "./app/utility/MiddleWare_Utility";

export async function middleware(req) {
  if (req.nextUrl.pathname.startsWith("/components/Cart")) {
    return CheckCookieAuth(req);
  }

  else if(req.nextUrl.pathname.startsWith("/components/Order"))
  {
    return CheckCookieAuth(req);
  }
  else if(req.nextUrl.pathname.startsWith("/components/Profile"))
  {
    return CheckCookieAuth(req);
  }

  return NextResponse.next();
}


