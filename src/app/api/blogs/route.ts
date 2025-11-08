import { NextRequest, NextResponse } from "next/server";
import { db, blogs } from "@/db";
import { verifyAdmin } from "@/lib/auth";
import { z } from "zod";

const createBlogSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
    try {
        // Verify user is logged in
        const user = await verifyAdmin(req);
        
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = createBlogSchema.parse(body);

        // Insert blog into database
        const [newBlog] = await db
            .insert(blogs)
            .values({
                title: validatedData.title,
                content: validatedData.content,
                imageUrl: validatedData.imageUrl || null,
                authorId: user.userId,
            })
            .returning();

        return NextResponse.json(
            { success: true, blog: newBlog },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }

        console.error("Error creating blog:", error);
        return NextResponse.json(
            { error: "Failed to create blog" },
            { status: 500 }
        );
    }
}
