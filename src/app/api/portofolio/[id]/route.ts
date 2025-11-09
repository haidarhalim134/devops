import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db'; 
import { portfoliosTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Params { params: { id: string } }

// --- PUT (Publik) ---
// Meng-update project berdasarkan ID
export async function PUT(request: NextRequest, { params }: Params) {
  // Tidak ada cek session
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, image } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Judul dan deskripsi wajib diisi' }, { status: 400 });
    }

    const updatedProject = await db
      .update(portfoliosTable)
      .set({ title, description, image, updatedAt: new Date() })
      .where(eq(portfoliosTable.id, Number(id)))
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updatedProject[0]);
  } catch (error) {
    console.error("Error PUT:", error);
    return NextResponse.json({ error: 'Gagal meng-update project' }, { status: 500 });
  }
}

// --- DELETE (Publik) ---
// Menghapus project berdasarkan ID
export async function DELETE(request: NextRequest, { params }: Params) {
  // Tidak ada cek session
  try {
    const { id } = params;

    const deletedProject = await db
      .delete(portfoliosTable)
      .where(eq(portfoliosTable.id, Number(id)))
      .returning();

    if (deletedProject.length === 0) {
      return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project berhasil dihapus' });
  } catch (error) {
    console.error("Error DELETE:", error);
    return NextResponse.json({ error: 'Gagal menghapus project' }, { status: 500 });
  }
}