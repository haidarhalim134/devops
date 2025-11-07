import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ServiceProps {
  title: string;
  description: string;
  icon: string;
}

export default function Service({ title, description, icon }: ServiceProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative aspect-square w-48 mb-4">
          <Image src={icon} alt={title} fill className="object-contain" quality={100} />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
