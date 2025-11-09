/**
 * Blog Components Tests
 * Tests for AddBlogButton, BlogActions, and BlogDetailActions components
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { AddBlogButton } from '@/components/AddBlogButton';
import { BlogActions } from '@/components/BlogActions';
import { BlogDetailActions } from '@/components/BlogDetailActions';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('AddBlogButton Component', () => {
    const mockRouter = {
        refresh: jest.fn(),
        push: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (global.fetch as jest.Mock).mockClear();
    });

    it('should render floating action button', () => {
        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        expect(button).toBeInTheDocument();
    });

    it('should open dialog when FAB is clicked', () => {
        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        expect(screen.getByText('Tambah Blog Baru')).toBeInTheDocument();
        expect(screen.getByText('Buat artikel blog baru. Isi semua field yang diperlukan.')).toBeInTheDocument();
    });

    it('should close dialog when cancel button is clicked', () => {
        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        const cancelButton = screen.getByText('Batal');
        fireEvent.click(cancelButton);

        // Dialog should be closed, so the title should not be visible
        expect(screen.queryByText('Tambah Blog Baru')).not.toBeInTheDocument();
    });

    it('should show validation error when submitting empty form', async () => {
        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        const form = screen.getByRole('button', { name: /simpan blog/i }).closest('form');
        fireEvent.submit(form!);

        // Form validation should prevent submission
        await waitFor(() => {
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    it('should submit form with valid data', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, blog: { id: 1 } }),
        });

        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        // Fill form
        const titleInput = screen.getByPlaceholderText('Masukkan judul blog');
        const contentTextarea = screen.getByPlaceholderText(/Tulis konten blog/i);

        fireEvent.change(titleInput, { target: { value: 'Test Blog Title' } });
        fireEvent.change(contentTextarea, { target: { value: 'Test blog content' } });

        const submitButton = screen.getByRole('button', { name: /simpan blog/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Test Blog Title',
                    content: 'Test blog content',
                    imageUrl: '',
                }),
            });
            expect(mockRouter.refresh).toHaveBeenCalled();
        });
    });

    it('should show error message when API returns error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Failed to create blog' }),
        });

        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        const titleInput = screen.getByPlaceholderText('Masukkan judul blog');
        const contentTextarea = screen.getByPlaceholderText(/Tulis konten blog/i);

        fireEvent.change(titleInput, { target: { value: 'Test Blog Title' } });
        fireEvent.change(contentTextarea, { target: { value: 'Test blog content' } });

        const submitButton = screen.getByRole('button', { name: /simpan blog/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to create blog')).toBeInTheDocument();
        });
    });

    it('should toggle preview mode', () => {
        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        const contentTextarea = screen.getByPlaceholderText(/Tulis konten blog/i);
        fireEvent.change(contentTextarea, { target: { value: '**Bold text**' } });

        const previewButton = screen.getByText('Preview');
        fireEvent.click(previewButton);

        // Preview mode should be active
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/Tulis konten blog/i)).not.toBeInTheDocument();
    });

    it('should apply formatting when toolbar button is clicked', () => {
        render(<AddBlogButton />);
        const button = screen.getByLabelText('Add new blog');
        fireEvent.click(button);

        const contentTextarea = screen.getByPlaceholderText(/Tulis konten blog/i) as HTMLTextAreaElement;
        fireEvent.change(contentTextarea, { target: { value: 'test' } });

        // Select text
        contentTextarea.setSelectionRange(0, 4);

        const boldButton = screen.getByTitle('Bold');
        fireEvent.click(boldButton);

        // Text should be wrapped with **
        expect(contentTextarea.value).toContain('**test**');
    });
});

describe('BlogActions Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    it('should not render when user is not logged in', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: null }),
        });

        const { container } = render(<BlogActions />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should render AddBlogButton when user is logged in', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: 'user-123' } }),
        });

        render(<BlogActions />);

        await waitFor(() => {
            expect(screen.getByLabelText('Add new blog')).toBeInTheDocument();
        });
    });

    it('should check auth status on mount', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: 'user-123' } }),
        });

        render(<BlogActions />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify');
        });
    });
});

describe('BlogDetailActions Component', () => {
    const mockRouter = {
        refresh: jest.fn(),
        push: jest.fn(),
    };

    const defaultProps = {
        blogId: 1,
        authorId: 'user-123',
        initialTitle: 'Test Blog',
        initialContent: 'Test content',
        initialImageUrl: 'https://example.com/image.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (global.fetch as jest.Mock).mockClear();
    });

    it('should not render when user is not the author', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: 'different-user' } }),
        });

        const { container } = render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should render edit and delete buttons when user is the author', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: 'user-123' } }),
        });

        render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });
    });

    it('should open edit dialog with pre-filled data', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: 'user-123' } }),
        });

        render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            const editButton = screen.getByText('Edit');
            fireEvent.click(editButton);
        });

        expect(screen.getByDisplayValue('Test Blog')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
    });

    it('should submit edit form successfully', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: { id: 'user-123' } }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            });

        render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            const editButton = screen.getByText('Edit');
            fireEvent.click(editButton);
        });

        const titleInput = screen.getByDisplayValue('Test Blog');
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

        const submitButton = screen.getByText('Simpan Perubahan');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/blogs/1',
                expect.objectContaining({
                    method: 'PATCH',
                })
            );
            expect(mockRouter.refresh).toHaveBeenCalled();
        });
    });

    it('should open delete confirmation dialog', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: 'user-123' } }),
        });

        render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            const deleteButton = screen.getByText('Delete');
            fireEvent.click(deleteButton);
        });

        expect(screen.getByText('Hapus Blog?')).toBeInTheDocument();
        expect(screen.getByText(/Tindakan ini tidak dapat dibatalkan/i)).toBeInTheDocument();
    });

    it('should delete blog successfully', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: { id: 'user-123' } }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            });

        render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            const deleteButton = screen.getByText('Delete');
            fireEvent.click(deleteButton);
        });

        const confirmButton = screen.getByText('Hapus');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/blogs/1',
                expect.objectContaining({
                    method: 'DELETE',
                })
            );
            expect(mockRouter.push).toHaveBeenCalledWith('/blogs');
        });
    });

    it('should show error message when edit fails', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: { id: 'user-123' } }),
            })
            .mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Update failed' }),
            });

        render(<BlogDetailActions {...defaultProps} />);

        await waitFor(() => {
            const editButton = screen.getByText('Edit');
            fireEvent.click(editButton);
        });

        const submitButton = screen.getByText('Simpan Perubahan');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Update failed')).toBeInTheDocument();
        });
    });
});
