import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  await db.insert(contactMessages).values({ name, email, message });
  return NextResponse.json({ success: true });
}

export async function GET() {
  const messages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return NextResponse.json(messages);
}
