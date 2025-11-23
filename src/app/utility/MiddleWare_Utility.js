//src/utility/MiddleWare_utility.js

import { NextResponse } from "next/server";
import { VerificationToken } from "./JWT_Helper";

export async function CheckCookieAuth(req)
{
  try{

    let CheckExistTOken=req.cookies.get('token');      //verify exist token and create a variable
    let token=await VerificationToken(CheckExistTOken.value);    //for decode token pass the variable value to VerificationToken function

    const requestHeader=new Headers(req.headers); //create Header which name requestHeader
    requestHeader.set('email',token['email']);      //set requestheader Email=from payload email

    return NextResponse.next({
      request:{headers:requestHeader},  //after verify email then it carry to header and goes to next step
    })
  }
  catch(error)
  {
    return NextResponse.redirect(new URL("/components/login",req.url));  //if login fail then it redirect to login page
  }
}

