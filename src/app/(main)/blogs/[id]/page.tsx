import { db, blogs, users } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function getBlog(id: number) {
    const [blog] = await db
        .select({
            id: blogs.id,
            title: blogs.title,
            content: blogs.content,
            imageUrl: blogs.imageUrl,
            createdAt: blogs.createdAt,
            updatedAt: blogs.updatedAt,
            authorName: users.name,
            authorEmail: users.email,
        })
        .from(blogs)
        .leftJoin(users, eq(blogs.authorId, users.id))
        .where(eq(blogs.id, id));

    return blog;
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blogId = parseInt(id);

    if (isNaN(blogId)) {
        notFound();
    }

    const blog = await getBlog(blogId);

    if (!blog) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link
                href="/blogs"
                className="text-primary hover:underline mb-6 inline-block"
            >
                ← Back to all blogs
            </Link>

            <article className="mt-4">
                {blog.imageUrl && (
                    <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>

                <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
                    <div>
                        <p className="font-medium text-foreground">
                            {blog.authorName || blog.authorEmail}
                        </p>
                        <p className="text-sm">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {blog.content}
                    </p>
                </div>

                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                    <p className="text-sm text-muted-foreground mt-8 pt-8 border-t">
                        Last updated: {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                )}
            </article>
        </div>
    );
}
