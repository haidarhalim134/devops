import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ProductProps {
  title: string;
  description: string;
  image: string;
}

export default function Product({ title, description, image }: ProductProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          quality={100}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
