"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface Product {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Product) => void;
  initialData?: Product;
}

export default function ProductFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<Product>({
    name: "",
    category: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    onOpenChange(false); // ✅ tutup dialog setelah submit
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Produk" : "Tambah Produk"}
          </DialogTitle>
          {/* Tombol X */}
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            name="name"
            placeholder="Nama produk"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="category"
            placeholder="Kategori"
            value={form.category}
            onChange={handleChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            required
          />
          <Input
            name="price"
            type="number"
            placeholder="Harga (Rp)"
            value={form.price}
            onChange={handleChange}
            required
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <Input
            name="image"
            placeholder="URL Gambar"
            value={form.image}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit">
              {initialData ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ProductFormDialog };
