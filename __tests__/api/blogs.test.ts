/**
 * Blog API Routes Tests
 * Tests for CREATE, READ, UPDATE, DELETE blog operations
 */

// Mock Next.js modules before importing route handlers
const mockNextRequest = jest.fn().mockImplementation((url: string, init?: RequestInit) => {
    return {
        url,
        method: init?.method || 'GET',
        headers: new Headers(init?.headers),
        json: async () => JSON.parse((init?.body as string) || '{}'),
    };
});

jest.mock('next/server', () => ({
    NextResponse: {
        json: (data: any, init?: ResponseInit) => {
            return {
                json: async () => data,
                status: init?.status || 200,
                headers: new Headers(init?.headers),
            };
        },
    },
    NextRequest: mockNextRequest,
}));

jest.mock('@/db', () => ({
    db: {
        insert: jest.fn(),
        select: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    blogs: {
        id: 'id',
        title: 'title',
        content: 'content',
        imageUrl: 'imageUrl',
        authorId: 'authorId',
    },
}));

jest.mock('@/lib/auth', () => ({
    verifyAdmin: jest.fn(),
}));

jest.mock('drizzle-orm', () => ({
    eq: jest.fn((field, value) => ({ field, value, type: 'eq' })),
    and: jest.fn((...conditions) => ({ conditions, type: 'and' })),
}));

import { POST } from '@/app/api/blogs/route';
import { GET, PATCH, DELETE } from '@/app/api/blogs/[id]/route';
import { db } from '@/db';
import { verifyAdmin } from '@/lib/auth';

// Get the mocked NextRequest from the mock
const { NextRequest } = jest.requireMock('next/server') as any;

describe('Blog API - CREATE (POST /api/blogs)', () => {
    const mockUser = {
        userId: 'user-123',
        email: 'test@example.com',
    };

    const validBlogData = {
        title: 'Test Blog',
        content: 'This is a test blog content',
        imageUrl: 'https://example.com/image.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new blog when user is authenticated', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);
        
        const mockBlog = {
            id: 1,
            ...validBlogData,
            authorId: mockUser.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockBlog]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs', {
            method: 'POST',
            body: JSON.stringify(validBlogData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.blog).toEqual(mockBlog);
        expect(verifyAdmin).toHaveBeenCalledWith(request);
    });

    it('should return 401 when user is not authenticated', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/blogs', {
            method: 'POST',
            body: JSON.stringify(validBlogData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized. Please login first.');
    });

    it('should return 400 when title is missing', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);

        const invalidData = {
            content: 'Content without title',
            imageUrl: 'https://example.com/image.jpg',
        };

        const request = new NextRequest('http://localhost:3000/api/blogs', {
            method: 'POST',
            body: JSON.stringify(invalidData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Validation failed');
    });

    it('should return 400 when content is missing', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);

        const invalidData = {
            title: 'Title without content',
            imageUrl: 'https://example.com/image.jpg',
        };

        const request = new NextRequest('http://localhost:3000/api/blogs', {
            method: 'POST',
            body: JSON.stringify(invalidData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Validation failed');
    });

    it('should accept blog without imageUrl (optional field)', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);

        const dataWithoutImage = {
            title: 'Test Blog',
            content: 'Content without image',
        };

        const mockBlog = {
            id: 1,
            ...dataWithoutImage,
            imageUrl: null,
            authorId: mockUser.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockBlog]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs', {
            method: 'POST',
            body: JSON.stringify(dataWithoutImage),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
    });

    it('should return 400 when imageUrl is invalid URL', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);

        const invalidData = {
            title: 'Test Blog',
            content: 'Test content',
            imageUrl: 'not-a-valid-url',
        };

        const request = new NextRequest('http://localhost:3000/api/blogs', {
            method: 'POST',
            body: JSON.stringify(invalidData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Validation failed');
    });
});

describe('Blog API - READ (GET /api/blogs/[id])', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return blog when valid ID is provided', async () => {
        const mockBlog = {
            id: 1,
            title: 'Test Blog',
            content: 'Test content',
            imageUrl: 'https://example.com/image.jpg',
            authorId: 'user-123',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([mockBlog]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/1');
        const params = Promise.resolve({ id: '1' });

        const response = await GET(request, { params });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.blog).toEqual(mockBlog);
    });

    it('should return 404 when blog not found', async () => {
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/999');
        const params = Promise.resolve({ id: '999' });

        const response = await GET(request, { params });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Blog not found');
    });

    it('should return 400 when ID is not a number', async () => {
        const request = new NextRequest('http://localhost:3000/api/blogs/abc');
        const params = Promise.resolve({ id: 'abc' });

        const response = await GET(request, { params });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid blog ID');
    });
});

describe('Blog API - UPDATE (PATCH /api/blogs/[id])', () => {
    const mockUser = {
        userId: 'user-123',
        email: 'test@example.com',
    };

    const existingBlog = {
        id: 1,
        title: 'Original Title',
        content: 'Original content',
        imageUrl: 'https://example.com/old.jpg',
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        imageUrl: 'https://example.com/new.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update blog when user is the author', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);
        
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([existingBlog]),
            }),
        });

        const updatedBlog = { ...existingBlog, ...updateData };
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([updatedBlog]),
                }),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/1', {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });
        const params = Promise.resolve({ id: '1' });

        const response = await PATCH(request, { params });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.blog.title).toBe(updateData.title);
    });

    it('should return 401 when user is not authenticated', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/blogs/1', {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });
        const params = Promise.resolve({ id: '1' });

        const response = await PATCH(request, { params });
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized. Please login first.');
    });

    it('should return 403 when user is not the author', async () => {
        const differentUser = {
            userId: 'user-456',
            email: 'other@example.com',
        };

        (verifyAdmin as jest.Mock).mockResolvedValue(differentUser);
        
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([existingBlog]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/1', {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });
        const params = Promise.resolve({ id: '1' });

        const response = await PATCH(request, { params });
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('You can only edit your own blogs');
    });

    it('should return 404 when blog does not exist', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);
        
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/999', {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });
        const params = Promise.resolve({ id: '999' });

        const response = await PATCH(request, { params });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Blog not found');
    });
});

describe('Blog API - DELETE (DELETE /api/blogs/[id])', () => {
    const mockUser = {
        userId: 'user-123',
        email: 'test@example.com',
    };

    const existingBlog = {
        id: 1,
        title: 'Test Blog',
        content: 'Test content',
        imageUrl: 'https://example.com/image.jpg',
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete blog when user is the author', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);
        
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([existingBlog]),
            }),
        });

        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValue(undefined),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/1', {
            method: 'DELETE',
        });
        const params = Promise.resolve({ id: '1' });

        const response = await DELETE(request, { params });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Blog deleted successfully');
    });

    it('should return 401 when user is not authenticated', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/blogs/1', {
            method: 'DELETE',
        });
        const params = Promise.resolve({ id: '1' });

        const response = await DELETE(request, { params });
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized. Please login first.');
    });

    it('should return 403 when user is not the author', async () => {
        const differentUser = {
            userId: 'user-456',
            email: 'other@example.com',
        };

        (verifyAdmin as jest.Mock).mockResolvedValue(differentUser);
        
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([existingBlog]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/1', {
            method: 'DELETE',
        });
        const params = Promise.resolve({ id: '1' });

        const response = await DELETE(request, { params });
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('You can only delete your own blogs');
    });

    it('should return 404 when blog does not exist', async () => {
        (verifyAdmin as jest.Mock).mockResolvedValue(mockUser);
        
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const request = new NextRequest('http://localhost:3000/api/blogs/999', {
            method: 'DELETE',
        });
        const params = Promise.resolve({ id: '999' });

        const response = await DELETE(request, { params });
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Blog not found');
    });
});
