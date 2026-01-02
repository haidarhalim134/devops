"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductFormDialog from "@/components/ui/ProductFormDialog";
import { Button } from "@/components/ui/button";

export type Product = {
  id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<Product | null>(null);

  // 🔹 Ambil data dari API
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Data is not in expected format');
      }
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Simpan (Create / Update)
  const handleSave = async (product: Omit<Product, "id">) => {
    if (editData) {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, id: editData.id }),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    }
    setOpenDialog(false);
    setEditData(null);
    fetchProducts(); // refresh data
  };

  // 🔹 Hapus
  const handleDelete = async (id: number) => {
    if (confirm("Hapus produk ini?")) {
      await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchProducts();
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
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

      <ProductFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSave}
        initialData={editData || undefined}
      />
    </main>
  );
}