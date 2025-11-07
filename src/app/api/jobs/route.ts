import { NextResponse } from "next/server";
import { db, jobs } from "@/db";
import { verifyAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

// GET /api/jobs  →  Public
export async function GET() {
  const allJobs = await db.select().from(jobs).orderBy(jobs.createdAt);
  return NextResponse.json(allJobs);
}

// POST /api/jobs  →  Admin only
export async function POST(req: Request) {
//   const admin = await verifyAdmin();
//   if (!admin) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

  const body = await req.json();
  const { title, department, location, type, description } = body;

  if (!title || !department || !location || !type || !description) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const [newJob] = await db
    .insert(jobs)
    .values({
      title,
      department,
      location,
      type,
      description,
    })
    .returning();

  return NextResponse.json(newJob, { status: 201 });
}
