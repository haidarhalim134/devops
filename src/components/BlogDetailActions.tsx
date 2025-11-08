"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Code, Eye, EyeOff } from "lucide-react";

interface BlogActionsProps {
    blogId: number;
    authorId: string;
    initialTitle: string;
    initialContent: string;
    initialImageUrl: string | null;
}

export function BlogDetailActions({ blogId, authorId, initialTitle, initialContent, initialImageUrl }: BlogActionsProps) {
    const [isAuthor, setIsAuthor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState({
        title: initialTitle,
        content: initialContent,
        imageUrl: initialImageUrl || "",
    });

    useEffect(() => {
        // Check if current user is the author
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (data.user && data.user.id === authorId) {
                    setIsAuthor(true);
                }
            })
            .catch(() => {
                setIsAuthor(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [authorId]);

    const insertFormatting = (prefix: string, suffix: string = "", placeholder: string = "text") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        const textToInsert = selectedText || placeholder;
        
        const before = formData.content.substring(0, start);
        const after = formData.content.substring(end);
        
        const newContent = before + prefix + textToInsert + suffix + after;
        setFormData({ ...formData, content: newContent });

        setTimeout(() => {
            const newPosition = start + prefix.length + textToInsert.length;
            textarea.focus();
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const parseMarkdown = (text: string) => {
        let parsed = text;
        parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
        parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>');
        parsed = parsed.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
        parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
        parsed = parsed.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
        parsed = parsed.replace(/<u>(.+?)<\/u>/g, '<u class="underline">$1</u>');
        parsed = parsed.replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        parsed = parsed.replace(/^\s*-\s+(.*)$/gim, '<li class="ml-6 list-disc">$1</li>');
        parsed = parsed.replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-6 list-decimal">$1</li>');
        parsed = parsed.replace(/\n/g, '<br />');
        return parsed;
    };

    const formatButtons = [
        { icon: Bold, label: "Bold", action: () => insertFormatting("**", "**", "bold text") },
        { icon: Italic, label: "Italic", action: () => insertFormatting("*", "*", "italic text") },
        { icon: Underline, label: "Underline", action: () => insertFormatting("<u>", "</u>", "underlined text") },
        { icon: Code, label: "Code", action: () => insertFormatting("`", "`", "code") },
        { icon: Heading1, label: "Heading 1", action: () => insertFormatting("# ", "", "Heading 1") },
        { icon: Heading2, label: "Heading 2", action: () => insertFormatting("## ", "", "Heading 2") },
        { icon: List, label: "Bullet List", action: () => insertFormatting("- ", "", "List item") },
        { icon: ListOrdered, label: "Numbered List", action: () => insertFormatting("1. ", "", "List item") },
    ];

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const response = await fetch(`/api/blogs/${blogId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update blog");
            }

            setEditOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setSubmitting(true);
        setError("");

        try {
            const response = await fetch(`/api/blogs/${blogId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete blog");
            }

            router.push("/blogs");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setSubmitting(false);
        }
    };

    if (loading || !isAuthor) {
        return null;
    }

    return (
        <>
            <div className="flex gap-2 mb-4">
                <Button
                    onClick={() => setEditOpen(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <Pencil className="w-4 h-4" />
                    Edit
                </Button>
                <Button
                    onClick={() => setDeleteOpen(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Blog</DialogTitle>
                        <DialogDescription>
                            Update your blog post. Changes will be saved immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="edit-title" className="text-sm font-medium">
                                    Judul <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="edit-title"
                                    placeholder="Masukkan judul blog"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="edit-content" className="text-sm font-medium">
                                    Konten <span className="text-red-500">*</span>
                                </label>
                                
                                <div className="flex items-center justify-between p-2 bg-muted rounded-md border">
                                    <div className="flex flex-wrap gap-1">
                                        {formatButtons.map((btn, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={btn.action}
                                                disabled={submitting}
                                                className="p-2 hover:bg-background rounded transition-colors disabled:opacity-50"
                                                title={btn.label}
                                            >
                                                <btn.icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="p-2 hover:bg-background rounded transition-colors flex items-center gap-2 text-sm"
                                        title={showPreview ? "Edit" : "Preview"}
                                    >
                                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {showPreview ? "Edit" : "Preview"}
                                    </button>
                                </div>

                                {!showPreview ? (
                                    <Textarea
                                        ref={textareaRef}
                                        id="edit-content"
                                        placeholder="Tulis konten blog Anda di sini..."
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({ ...formData, content: e.target.value })
                                        }
                                        required
                                        disabled={submitting}
                                        rows={10}
                                        className="resize-none font-mono text-sm"
                                    />
                                ) : (
                                    <div 
                                        className="min-h-[250px] p-3 border rounded-md bg-background"
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content || "*Preview akan muncul di sini...*") }}
                                    />
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="edit-imageUrl" className="text-sm font-medium">
                                    URL Gambar (opsional)
                                </label>
                                <Input
                                    id="edit-imageUrl"
                                    type="url"
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={formData.imageUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, imageUrl: e.target.value })
                                    }
                                    disabled={submitting}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditOpen(false)}
                                disabled={submitting}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Blog?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Blog ini akan dihapus secara permanen dari database.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                            disabled={submitting}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={submitting}
                            variant="destructive"
                        >
                            {submitting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
