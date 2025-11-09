import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { portfoliosTable } from '@/db/schema'; // Impor tabel yang benar
import { desc } from 'drizzle-orm';

// --- GET (Publik) ---
// Mengambil semua project
export async function GET() {
  try {
    const projects = await db
      .select()
      .from(portfoliosTable)
      .orderBy(desc(portfoliosTable.createdAt)); 

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json({ error: 'Gagal mengambil data project' }, { status: 500 });
  }
}

// --- POST (Publik) ---
// Membuat project baru
export async function POST(request: NextRequest) {
  // Tidak ada cek session
  try {
    const body = await request.json();
    const { title, description, image } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Judul dan deskripsi wajib diisi' }, { status: 400 });
    }

    const newProject = await db
      .insert(portfoliosTable)
      .values({ title, description, image }) // Tidak ada 'userId'
      .returning(); 

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Error POST:", error);
    return NextResponse.json({ error: 'Gagal membuat project' }, { status: 500 });
  }
}