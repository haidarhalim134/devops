import { NextRequest, NextResponse } from "next/server";
import { db, blogs } from "@/db";
import { verifyAdmin } from "@/lib/auth";
import { z } from "zod";
import { eq } from "drizzle-orm";

const updateBlogSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blogId = parseInt(id);

        if (isNaN(blogId)) {
            return NextResponse.json(
                { error: "Invalid blog ID" },
                { status: 400 }
            );
        }

        const [blog] = await db
            .select()
            .from(blogs)
            .where(eq(blogs.id, blogId));

        if (!blog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAdmin(req);

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const blogId = parseInt(id);

        if (isNaN(blogId)) {
            return NextResponse.json(
                { error: "Invalid blog ID" },
                { status: 400 }
            );
        }

        // Check if blog exists and user is the author
        const [existingBlog] = await db
            .select()
            .from(blogs)
            .where(eq(blogs.id, blogId));

        if (!existingBlog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        if (existingBlog.authorId !== user.userId) {
            return NextResponse.json(
                { error: "You can only edit your own blogs" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const validatedData = updateBlogSchema.parse(body);

        // Update blog
        const [updatedBlog] = await db
            .update(blogs)
            .set({
                title: validatedData.title,
                content: validatedData.content,
                imageUrl: validatedData.imageUrl || null,
                updatedAt: new Date(),
            })
            .where(eq(blogs.id, blogId))
            .returning();

        return NextResponse.json(
            { success: true, blog: updatedBlog },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }

        console.error("Error updating blog:", error);
        return NextResponse.json(
            { error: "Failed to update blog" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAdmin(req);

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const blogId = parseInt(id);

        if (isNaN(blogId)) {
            return NextResponse.json(
                { error: "Invalid blog ID" },
                { status: 400 }
            );
        }

        // Check if blog exists and user is the author
        const [existingBlog] = await db
            .select()
            .from(blogs)
            .where(eq(blogs.id, blogId));

        if (!existingBlog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        if (existingBlog.authorId !== user.userId) {
            return NextResponse.json(
                { error: "You can only delete your own blogs" },
                { status: 403 }
            );
        }

        // Delete blog
        await db.delete(blogs).where(eq(blogs.id, blogId));

        return NextResponse.json(
            { success: true, message: "Blog deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { error: "Failed to delete blog" },
            { status: 500 }
        );
    }
}
