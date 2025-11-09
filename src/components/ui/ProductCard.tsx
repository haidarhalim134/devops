import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/product/page";
import { Pencil, Trash2 } from "lucide-react";

type ProductCardProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold">
            Rp {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">Stok: {product.stock}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-4 pb-4">
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="flex items-center gap-1"
        >
          <Pencil size={16} /> Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} /> Hapus
        </Button>
      </CardFooter>
    </Card>
  );
}

export {ProductCard}