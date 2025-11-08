import { db, blogs, users } from "@/db";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { BlogActions } from "@/components/BlogActions";
import { FileText } from "lucide-react";

async function getBlogs() {
    const allBlogs = await db
        .select({
            id: blogs.id,
            title: blogs.title,
            content: blogs.content,
            imageUrl: blogs.imageUrl,
            createdAt: blogs.createdAt,
            authorName: users.name,
            authorEmail: users.email,
        })
        .from(blogs)
        .leftJoin(users, eq(blogs.authorId, users.id))
        .orderBy(desc(blogs.createdAt));

    return allBlogs;
}

export default async function BlogsPage() {
    const allBlogs = await getBlogs();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
                <p className="text-muted-foreground">
                    Discover insights, tutorials, and stories from our team
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBlogs.map((blog) => (
                    <Card key={blog.id} className="flex flex-col hover:shadow-lg transition-shadow">
                        {blog.imageUrl ? (
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                <Image
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                                <FileText className="w-16 h-16 text-muted-foreground/40" />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                            <CardDescription>
                                {blog.authorName || blog.authorEmail} • {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grow">
                            <p className="text-muted-foreground line-clamp-3">
                                {blog.content}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link
                                href={`/blogs/${blog.id}`}
                                className="text-primary hover:underline font-medium"
                            >
                                Read more →
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {allBlogs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No blogs found. Check back soon!</p>
                </div>
            )}

            {/* Floating Action Button - only shown if logged in */}
            <BlogActions />
        </div>
    );
}