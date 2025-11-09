"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductFormDialog from "@/components/ui/ProductFormDialog";
import { Button } from "@/components/ui/button";

export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<Product | null>(null);

  useEffect(() => {
    // Data dummy awal (bisa diganti fetch API)
    setProducts([
      {
        id: 1,
        name: "Kamera DSLR Canon 600D",
        category: "Elektronik",
        description:
          "Kamera profesional untuk dokumentasi kegiatan atau proyek.",
        price: 150000,
        stock: 5,
        image: "https://images.unsplash.com/photo-1519183071298-a2962eadc7b9",
      },
      {
        id: 2,
        name: "Tripod Aluminium",
        category: "Aksesoris Kamera",
        description: "Tripod ringan dan kokoh, mudah dibawa ke mana saja.",
        price: 50000,
        stock: 10,
        image: "https://images.unsplash.com/photo-1586443004499-43e5c7bd3d8d",
      },
      {
        id: 3,
        name: "Proyektor Epson XGA",
        category: "Elektronik",
        description: "Cocok untuk presentasi, acara, dan kegiatan kampus.",
        price: 200000,
        stock: 3,
        image: "https://images.unsplash.com/photo-1587094312382-e318bd90e3b7",
      },
    ]);
  }, []);

  // Fungsi tambah atau edit produk
  const handleSave = (product: Omit<Product, "id">) => {
    if (editData) {
      // update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editData.id ? { ...editData, ...product } : p
        )
      );
    } else {
      // create
      setProducts((prev) => [
        ...prev,
        { ...product, id: Date.now() },
      ]);
    }
    setOpenDialog(false);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Produk & Layanan
        </h1>
        <Button
          onClick={() => {
            setEditData(null);
            setOpenDialog(true);
          }}
        >
          + Tambah Produk
        </Button>
      </div>

      {/* Daftar Produk */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          Belum ada produk yang tersedia.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => {
                setEditData(product);
                setOpenDialog(true);
              }}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}

      {/* Dialog Form Produk */}
      <ProductFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSave}
        initialData={editData || undefined}
      />
    </main>
  );
}
