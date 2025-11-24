import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getImagePath } from "@/lib/imageUtils";

interface MenuItemCardProps {
  name: string;
  price: string;
  vegNonVeg: string;
  description: string;
  imageUrl?: string;
  index: number;
  category?: string;
}
export const MenuItemCard = ({
  name,
  price,
  vegNonVeg,
  description,
  imageUrl,
  index,
  category
}: MenuItemCardProps) => {
  const isVeg = vegNonVeg === 'veg';
  const isBoth = vegNonVeg === 'both';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/80 backdrop-blur-md">
        {/* Image (only show if imageUrl exists) */}
        {imageUrl && (
          <div className="relative h-56 overflow-hidden">
            <ImageWithFallback 
              src={getImagePath(imageUrl)} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Title and Price */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {price.includes('₹') ? price : `₹${price}`}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Hover shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 animate-shine" />
        </div>
      </Card>
    </motion.div>
  );
};