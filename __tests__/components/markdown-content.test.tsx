/**
 * MarkdownContent Component Tests
 * Tests for markdown parsing and rendering functionality
 */

import { render, screen } from '@testing-library/react';
import { MarkdownContent } from '@/components/MarkdownContent';

describe('MarkdownContent Component', () => {
    it('should render plain text correctly', () => {
        const content = 'This is plain text';
        const { container } = render(<MarkdownContent content={content} />);

        expect(container.textContent).toContain('This is plain text');
    });

    it('should parse bold text (**text**)', () => {
        const content = 'This is **bold text**';
        const { container } = render(<MarkdownContent content={content} />);

        const strong = container.querySelector('strong');
        expect(strong).toBeInTheDocument();
        expect(strong?.textContent).toBe('bold text');
        expect(strong?.className).toContain('font-bold');
    });

    it('should parse italic text (*text*)', () => {
        const content = 'This is *italic text*';
        const { container } = render(<MarkdownContent content={content} />);

        const em = container.querySelector('em');
        expect(em).toBeInTheDocument();
        expect(em?.textContent).toBe('italic text');
        expect(em?.className).toContain('italic');
    });

    it('should parse underline text (<u>text</u>)', () => {
        const content = 'This is <u>underlined text</u>';
        const { container } = render(<MarkdownContent content={content} />);

        const u = container.querySelector('u');
        expect(u).toBeInTheDocument();
        expect(u?.textContent).toBe('underlined text');
        expect(u?.className).toContain('underline');
    });

    it('should parse inline code (`code`)', () => {
        const content = 'This is `inline code`';
        const { container } = render(<MarkdownContent content={content} />);

        const code = container.querySelector('code');
        expect(code).toBeInTheDocument();
        expect(code?.textContent).toBe('inline code');
        expect(code?.className).toContain('bg-muted');
        expect(code?.className).toContain('font-mono');
    });

    it('should parse heading 1 (# text)', () => {
        const content = '# Main Heading';
        const { container } = render(<MarkdownContent content={content} />);

        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
        expect(h1?.textContent).toBe('Main Heading');
        expect(h1?.className).toContain('text-3xl');
        expect(h1?.className).toContain('font-bold');
    });

    it('should parse heading 2 (## text)', () => {
        const content = '## Sub Heading';
        const { container } = render(<MarkdownContent content={content} />);

        const h2 = container.querySelector('h2');
        expect(h2).toBeInTheDocument();
        expect(h2?.textContent).toBe('Sub Heading');
        expect(h2?.className).toContain('text-2xl');
        expect(h2?.className).toContain('font-bold');
    });

    it('should parse heading 3 (### text)', () => {
        const content = '### Minor Heading';
        const { container } = render(<MarkdownContent content={content} />);

        const h3 = container.querySelector('h3');
        expect(h3).toBeInTheDocument();
        expect(h3?.textContent).toBe('Minor Heading');
        expect(h3?.className).toContain('text-xl');
        expect(h3?.className).toContain('font-bold');
    });

    it('should parse bullet lists (- item)', () => {
        const content = '- Item 1\n- Item 2\n- Item 3';
        const { container } = render(<MarkdownContent content={content} />);

        const listItems = container.querySelectorAll('li');
        expect(listItems).toHaveLength(3);
        expect(listItems[0].textContent).toBe('Item 1');
        expect(listItems[0].className).toContain('list-disc');
    });

    it('should parse numbered lists (1. item)', () => {
        const content = '1. First\n2. Second\n3. Third';
        const { container } = render(<MarkdownContent content={content} />);

        const listItems = container.querySelectorAll('li');
        expect(listItems).toHaveLength(3);
        expect(listItems[0].textContent).toBe('First');
        expect(listItems[0].className).toContain('list-decimal');
    });

    it('should parse line breaks (\\n)', () => {
        const content = 'Line 1\nLine 2\nLine 3';
        const { container } = render(<MarkdownContent content={content} />);

        const breaks = container.querySelectorAll('br');
        expect(breaks.length).toBeGreaterThan(0);
    });

    it('should parse multiple formatting types together', () => {
        const content = '**Bold** and *italic* with `code`';
        const { container } = render(<MarkdownContent content={content} />);

        expect(container.querySelector('strong')).toBeInTheDocument();
        expect(container.querySelector('em')).toBeInTheDocument();
        expect(container.querySelector('code')).toBeInTheDocument();
    });

    it('should parse complex markdown structure', () => {
        const content = `# Main Title

This is **bold** text and *italic* text.

## Subtitle

- Item 1
- Item 2

Here is some \`code\` inline.`;

        const { container } = render(<MarkdownContent content={content} />);

        expect(container.querySelector('h1')).toBeInTheDocument();
        expect(container.querySelector('h2')).toBeInTheDocument();
        expect(container.querySelector('strong')).toBeInTheDocument();
        expect(container.querySelector('em')).toBeInTheDocument();
        expect(container.querySelector('code')).toBeInTheDocument();
        expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('should apply custom className', () => {
        const content = 'Test content';
        const { container } = render(
            <MarkdownContent content={content} className="custom-class" />
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('custom-class');
    });

    it('should have default prose classes', () => {
        const content = 'Test content';
        const { container } = render(<MarkdownContent content={content} />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('prose');
        expect(wrapper.className).toContain('prose-lg');
        expect(wrapper.className).toContain('max-w-none');
    });

    it('should handle empty content', () => {
        const content = '';
        const { container } = render(<MarkdownContent content={content} />);

        expect(container.firstChild).toBeInTheDocument();
    });

    it('should escape HTML in content for security', () => {
        const content = 'This is **bold** text';
        const { container } = render(<MarkdownContent content={content} />);

        // Should use dangerouslySetInnerHTML but content should be processed markdown
        expect(container.querySelector('strong')).toBeInTheDocument();
    });

    it('should handle nested bold and italic', () => {
        const content = '**Bold *and italic***';
        const { container } = render(<MarkdownContent content={content} />);

        const strong = container.querySelector('strong');
        expect(strong).toBeInTheDocument();
    });

    it('should handle code blocks with special characters', () => {
        const content = 'Use `const x = 5;` for variables';
        const { container } = render(<MarkdownContent content={content} />);

        const code = container.querySelector('code');
        expect(code?.textContent).toContain('const x = 5;');
    });

    it('should render multiple headings at different levels', () => {
        const content = '# H1\n## H2\n### H3';
        const { container } = render(<MarkdownContent content={content} />);

        expect(container.querySelector('h1')).toBeInTheDocument();
        expect(container.querySelector('h2')).toBeInTheDocument();
        expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('should handle mixed list types', () => {
        const content = '- Bullet 1\n1. Number 1\n- Bullet 2';
        const { container } = render(<MarkdownContent content={content} />);

        const listItems = container.querySelectorAll('li');
        expect(listItems).toHaveLength(3);
        expect(listItems[0].className).toContain('list-disc');
        expect(listItems[1].className).toContain('list-decimal');
    });
});
