import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/homepage", "http://localhost:3000"));
}
