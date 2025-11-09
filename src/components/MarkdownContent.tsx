"use client";

interface MarkdownContentProps {
    content: string;
    className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
    // Simple markdown parser
    const parseMarkdown = (text: string) => {
        // Replace headings
        text = text.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
        text = text.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
        text = text.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

        // Replace bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');

        // Replace italic
        text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

        // Replace underline
        text = text.replace(/<u>(.+?)<\/u>/g, '<u class="underline">$1</u>');

        // Replace inline code
        text = text.replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

        // Replace unordered lists
        text = text.replace(/^\s*-\s+(.*)$/gim, '<li class="ml-6 list-disc">$1</li>');

        // Replace ordered lists
        text = text.replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-6 list-decimal">$1</li>');

        // Replace line breaks
        text = text.replace(/\n/g, '<br />');

        return text;
    };

    return (
        <div
            className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
    );
}
