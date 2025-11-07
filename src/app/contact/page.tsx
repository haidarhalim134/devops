"use client";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Kontak Kami</h1>

      {/* Info Kontak */}
      <section className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Informasi</h2>
          <p className="mb-2">📍 <strong>Alamat  :</strong> Itämerenkatu 11-13, 00180 Helsinki, Finland </p>
          <p className="mb-2">📞 <strong>Telepon:</strong> +358 9 2316 4600</p>
          <p className="mb-2">📧 <strong>Email :</strong> parents@supercell.com</p>


          {/* Ikon Media Sosial */}
          <div className="flex items-center gap-5 mt-6">
            <a
              href="https://www.facebook.com/supercell"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://www.instagram.com/supercell/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white hover:opacity-90 transition"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.linkedin.com/company/supercell/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>

        {/* Peta Lokasi */}
        <div>
          <iframe
            title="Supercell HQ Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.4920242761255!2d24.91890807641217!3d60.16080387843254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bca7a839b05%3A0x5319379f5c4ccae8!2sSupercell!5e0!3m2!1sen!2sid!4v1730974668012!5m2!1sen!2sid"
            className="w-full h-72 rounded-xl border-0 shadow"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Form Kontak */}
      <section className="max-w-3xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-4">Hubungi Kami</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Nama" className="w-full border rounded-lg p-2" required />
          <input type="email" placeholder="Email" className="w-full border rounded-lg p-2" required />
          <textarea placeholder="Pesan Anda" className="w-full border rounded-lg p-2 h-32" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Kirim
          </button>
        </form>
      </section>
    </main>
  );
}