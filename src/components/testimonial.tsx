import { Card } from "@/components/ui/card";
import Image from "next/image";

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export default function Testimonial({ name, role, company, content, image }: TestimonialProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative aspect-square w-16 flex-shrink-0">
          <Image src={image} alt={name} fill className="rounded-full object-cover" quality={100} />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">
            {role} at {company}
          </p>
          <blockquote className="mt-3 text-gray-600">"{content}"</blockquote>
        </div>
      </div>
    </Card>
  );
}
