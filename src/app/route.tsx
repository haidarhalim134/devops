import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/homepage", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
