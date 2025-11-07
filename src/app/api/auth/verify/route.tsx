import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookieName, secret } from "../../../../../middleware";


export async function GET(req: NextRequest) {
  const jwt = req.cookies.get(cookieName)?.value;

  if (!jwt) {
    return NextResponse.json({ isAdmin: false, user: null });
  }

  try {
    const { payload } = await jwtVerify(jwt, secret);

    const user = {
      id: payload.userId,
      email: payload.email,
    };

    return NextResponse.json({
      isAdmin: true,
      user,
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ isAdmin: false, user: null });
  }
}
