import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getImagePath } from "@/lib/imageUtils";
import { SoupAnimation, AnimationStyle } from "./SoupAnimation";

interface MenuItemCardProps {
  name: string;
  price: string;
  vegNonVeg: string;
  description: string;
  imageUrl?: string;
  index: number;
  category?: string;
  soupAnimationStyle?: AnimationStyle;
}
export const MenuItemCard = ({
  name,
  price,
  vegNonVeg,
  description,
  imageUrl,
  index,
  category,
  soupAnimationStyle = "cartoon"
}: MenuItemCardProps) => {
  const isVeg = vegNonVeg === 'veg';
  const isBoth = vegNonVeg === 'both';
  const isSoup = category?.toLowerCase().includes('soup');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/80 backdrop-blur-md">
        {/* Soup Animation or Image */}
        {isSoup ? (
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-8">
            <SoupAnimation 
              soupName={name} 
              style={soupAnimationStyle}
              className="w-full h-full max-w-[200px] max-h-[200px]"
            />
          </div>
        ) : imageUrl ? (
          <div className="relative h-56 overflow-hidden">
            <ImageWithFallback 
              src={getImagePath(imageUrl)} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ) : null}

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