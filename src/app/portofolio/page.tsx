import Image from "next/image";

const projects = [
  {
    title: "Aplikasi Mobile BankLink",
    description:
      "Sistem mobile banking modern untuk transaksi cepat dan aman, dibuat untuk salah satu bank nasional.",
    image: "/images/portofolio/bank.jpg",
    client: "Bank Nusantara",
  },
  {
    title: "Website E-Commerce GoStyle",
    description:
      "Platform fashion e-commerce dengan sistem rekomendasi berbasis AI dan dashboard analytics.",
    image: "/images/portofolio/gostyle.png",
    client: "GoStyle Indonesia",
  },
  {
    title: "Dashboard Analitik DataHealth",
    description:
      "Sistem visualisasi data kesehatan dengan integrasi real-time dari berbagai sumber rumah sakit.",
    image: "/images/portofolio/datahealth.jpg",
    client: "DataHealth Labs",
  },
];

const testimonials = [
  {
    name: "Andi Pratama",
    position: "CEO, GoStyle",
    message:
      "Tim ini sangat profesional! Website kami kini jauh lebih cepat dan mudah diatur. Hasil melebihi ekspektasi.",
  },
  {
    name: "Rina Dewi",
    position: "Head of IT, Bank Nusantara",
    message:
      "Komunikasi yang cepat dan solusi yang efisien. Mereka memahami kebutuhan bisnis dengan sangat baik.",
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 md:px-20">
      {/* Header Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Portofolio & Proyek Kami
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Berikut adalah beberapa proyek unggulan yang telah kami selesaikan
          untuk berbagai klien dari industri berbeda.
        </p>
      </section>

      {/* Project Gallery */}
      <section className="grid md:grid-cols-3 gap-10 mb-24">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <Image
              src={project.image}
              alt={project.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <span className="text-sm text-gray-500">
                Klien: {project.client}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="bg-white rounded-2xl shadow-md p-10">
        <h2 className="text-2xl font-bold text-center mb-8">
          Testimoni Pelanggan
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <p className="text-gray-700 italic mb-4">“{t.message}”</p>
              <div className="text-sm font-medium text-gray-800">
                {t.name} <span className="text-gray-500">— {t.position}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
