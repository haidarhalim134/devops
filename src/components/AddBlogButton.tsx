"use client";

import { useState, useRef } from "react";
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
import { Plus, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Code, Eye, EyeOff } from "lucide-react";

export function AddBlogButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
    });

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

        // Set cursor position after the inserted text
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate required fields
        if (!formData.title.trim() || !formData.content.trim()) {
            setError("Title and content are required");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create blog");
            }

            // Reset form and close dialog
            setFormData({ title: "", content: "", imageUrl: "" });
            setOpen(false);

            // Refresh the page to show the new blog
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
                aria-label="Add new blog"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Dialog Form */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Blog Baru</DialogTitle>
                        <DialogDescription>
                            Buat artikel blog baru. Isi semua field yang diperlukan.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Judul <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="title"
                                    placeholder="Masukkan judul blog"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="content" className="text-sm font-medium">
                                    Konten <span className="text-red-500">*</span>
                                </label>

                                {/* Formatting Toolbar */}
                                <div className="flex items-center justify-between p-2 bg-muted rounded-md border">
                                    <div className="flex flex-wrap gap-1">
                                        {formatButtons.map((btn, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={btn.action}
                                                disabled={loading}
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
                                        id="content"
                                        placeholder="Tulis konten blog Anda di sini... &#10;&#10;Gunakan toolbar di atas untuk memformat teks:&#10;**bold** untuk tebal&#10;*italic* untuk miring&#10;# Heading untuk judul&#10;- List untuk daftar"
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({ ...formData, content: e.target.value })
                                        }
                                        required
                                        disabled={loading}
                                        rows={10}
                                        className="resize-none font-mono text-sm"
                                    />
                                ) : (
                                    <div
                                        className="min-h-[250px] p-3 border rounded-md bg-background"
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content || "*Preview akan muncul di sini...*") }}
                                    />
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Gunakan toolbar untuk memformat teks atau ketik Markdown secara manual
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="imageUrl" className="text-sm font-medium">
                                    URL Gambar (opsional)
                                </label>
                                <Input
                                    id="imageUrl"
                                    type="url"
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={formData.imageUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, imageUrl: e.target.value })
                                    }
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Gunakan URL gambar dari Unsplash atau sumber lain
                                </p>
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
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan Blog"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
