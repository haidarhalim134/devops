import { Button } from "@/components/ui/button";
import Product from "@/components/product";
import Service from "@/components/service";
import Testimonial from "@/components/testimonial";
import Link from "next/link";

export default function TryPage() {
  const products = [
    {
      title: "Cloud Solutions",
      description: "Enterprise-grade cloud infrastructure and services for modern businesses",
      image: "/images/products/cloud.png",
    },
    {
      title: "DevOps Platform",
      description: "Streamline your development and operations with our integrated platform",
      image: "/images/products/devops.png",
    },
    {
      title: "Security Suite",
      description: "Comprehensive security solutions to protect your digital assets",
      image: "/images/products/security.png",
    },
  ];

  const services = [
    {
      title: "Consulting",
      description: "Expert guidance on digital transformation and technology strategy",
      icon: "/images/icons/consulting.png",
    },
    {
      title: "Implementation",
      description: "Professional deployment and integration of solutions",
      icon: "/images/icons/implementation.png",
    },
    {
      title: "Support",
      description: "24/7 technical support and maintenance services",
      icon: "/images/icons/support.png",
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "CTO",
      company: "TechCorp",
      content: "The DevOps platform has revolutionized our development workflow. Deployment times are down 75%.",
      image: "/images/testimonials/alex.png",
    },
    {
      name: "Sarah Miller",
      role: "VP Engineering",
      company: "InnovateTech",
      content: "Outstanding cloud solutions and support. Our infrastructure has never been more reliable.",
      image: "/images/testimonials/sarah.png",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold leading-tight bg-clip-text text-transparent pb-2 bg-gradient-to-r from-blue-600 to-indigo-600">Empowering Digital Innovation</h1>
          <p className="text-xl text-gray-600">We help businesses transform, innovate, and thrive in the digital age through cutting-edge technology solutions and expert services</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/career">View Careers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Our Products</h2>
            <p className="text-gray-600">Discover our suite of enterprise solutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Product key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <p className="text-gray-600">Comprehensive support for your business needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Service key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Client Testimonials</h2>
            <p className="text-gray-600">What our clients say about us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <Testimonial key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
