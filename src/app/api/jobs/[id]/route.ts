import { NextResponse } from "next/server";
import { db, jobs } from "@/db";
import { eq } from "drizzle-orm";
import { verifyAdmin } from "@/lib/auth";

interface Params {
  params: { id: string };
}

// GET /api/jobs/:id → Public
export async function GET(_req: Request, { params }: Params) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, Number(params.id)),
  });

  if (!job) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(job);
}


export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; 
    // const id = Number(params.id);
    const data = await req.json();
    console.log(id, data)
    const updated = await db
      .update(jobs)
      .set({
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
      })
      .where(eq(jobs.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PUT /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/:id → Admin only
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 

  await db.delete(jobs).where(eq(jobs.id, id));
  return new NextResponse(null, { status: 204 });
}
