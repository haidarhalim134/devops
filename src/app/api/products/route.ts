import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// === GET semua produk ===
export async function GET() {
  try {
    if (!db) {
      console.error('Database connection not initialized');
      return NextResponse.json(
        { error: 'Database connection not initialized' },
        { status: 500 }
      );
    }

    const allProducts = await db.select().from(products);
    
    if (!Array.isArray(allProducts)) {
      console.error('Unexpected response format:', allProducts);
      return NextResponse.json(
        { error: 'Unexpected response format from database' },
        { status: 500 }
      );
    }

    return NextResponse.json(allProducts);
  } catch (error: any) {
    console.error('Database error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// === POST tambah produk ===
export async function POST(req: Request) {
  const body = await req.json();
  const result = await db
    .insert(products)
    .values({
      name: body.name,
      category: body.category,
      description: body.description,
      price: body.price,
      stock: body.stock,
      image: body.image,
    })
    .returning();
  return NextResponse.json(result[0]);
}

// === PUT update produk ===
export async function PUT(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const result = await db
    .update(products)
    .set({
      name: body.name,
      category: body.category,
      description: body.description,
      price: body.price,
      stock: body.stock,
      image: body.image,
    })
    .where(eq(products.id, body.id))
    .returning();

  return NextResponse.json(result[0]);
}

// === DELETE hapus produk ===
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ success: true });
}
