export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          About SoftwareOne
        </h1>
        <p className="text-gray-700 leading-relaxed text-lg">
          At SoftwareOne, we go beyond the ordinary—helping businesses transform,
          innovate, and thrive in the digital age. We believe that technology should
          empower people, not complicate their work. That’s why we specialize in
          modern, scalable cloud and software solutions that maximize value and drive innovation.
        </p>
      </section>

      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Our Mission
        </h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          We aim to simplify technology adoption by optimizing IT environments and
          reducing costs—allowing organizations to focus on what matters most: growth,
          creativity, and innovation. From cloud migration to cybersecurity, our
          solutions are designed to make the (im)possible achievable.
        </p>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Expertise</h3>
          <p className="text-gray-700">
            Our team helps enterprises migrate and manage workloads across Microsoft Azure,
            AWS, and Google Cloud with seamless integration and cost optimization.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation Focus</h3>
          <p className="text-gray-700">
            We support innovation by developing modern applications, integrating AI and
            data analytics, and enabling faster, more agile digital transformation.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
          <p className="text-gray-700">
            As a global partner with Microsoft, AWS, and Google, we serve organizations
            across industries—providing solutions that scale globally and perform locally.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Promise</h2>
        <p className="text-gray-700 leading-relaxed">
          Every project we take on is guided by our commitment to quality, collaboration,
          and long-term partnership. We don’t just deliver software—we deliver results that
          empower people, streamline workflows, and create measurable business impact.
        </p>
      </section>
    </main>
  );
}
