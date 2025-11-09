// src/app/portofolio/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

// Tipe data untuk project (sesuai schema)
type Project = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  createdAt?: string;
};

export default function PortofolioPage() {
  // Tidak ada lagi 'useSession'
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({ title: "", description: "", image: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- Fungsi-fungsi CRUD (Sama) ---

  // Load semua project (API GET ini sekarang publik)
  async function loadProjects() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portofolio");
      if (!res.ok) throw new Error("Gagal mengambil data portofolio");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Load data saat halaman pertama kali dibuka
  useEffect(() => {
    loadProjects();
  }, []);

  // Submit form (Create / Update)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
    };
    if (!payload.title || !payload.description) {
      setError("Judul dan deskripsi wajib diisi.");
      return;
    }

    try {
      const url = editingId ? `/api/portofolio/${editingId}` : "/api/portofolio";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Request failed");
      }
      
      await loadProjects(); // Refresh data
      setForm({ title: "", description: "", image: "" });
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    }
  }

  // Set form untuk mode edit
  function handleEdit(p: Project) {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, image: p.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Hapus project
  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus proyek ini?")) return;
    try {
      const res = await fetch(`/api/portofolio/${id}`, { method: "DELETE" });
      if (!res.ok) {
         const errData = await res.json();
         throw new Error(errData.error || "Gagal menghapus");
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Error saat menghapus");
    }
  }

  // --- TAMPILAN / RENDER (Selalu tampil) ---
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-16">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Portofolio Publik
        </h1>
        <Link href="/homepage" className="px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100">
          Kembali ke Homepage
        </Link>
        {/* Tidak ada tombol Login/Logout */}
      </header>

      {/* Form untuk Create/Update (Selalu Tampil) */}
      <section className="max-w-4xl mx-auto mb-10">
        <p className="text-gray-600 mb-6">
          Halaman ini bersifat publik. Siapapun bisa menambah, mengedit, atau menghapus proyek.
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-sm space-y-4"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Judul proyek"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="text"
              placeholder="Nama gambar (contoh: bank.jpg)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>

          <textarea
            placeholder="Deskripsi proyek"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-4 py-2 w-full min-h-[120px]"
            required
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? "Simpan Perubahan" : "Tambah Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", description: "", image: "" });
                }}
                className="px-3 py-2 border rounded-lg text-gray-700"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Daftar Portofolio (Selalu Tampil) */}
      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500">Memuat proyek...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500">Belum ada proyek.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition"
              >
                <div className="relative w-full h-44 bg-gray-100">
                  {p.image ? (
                    <img
                      src={`/images/portofolio/${p.image}`}
                      alt={p.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-3">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                    </div>
                    {/* Tombol CRUD Selalu Tampil */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 rounded text-sm bg-yellow-400 hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}