import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface MenuItemCardProps {
  name: string;
  price: string;
  vegNonVeg: string;
  description: string;
  imageUrl?: string;
  index: number;
}

export const MenuItemCard = ({ name, price, vegNonVeg, description, imageUrl, index }: MenuItemCardProps) => {
  const isVeg = vegNonVeg === 'veg';
  const isBoth = vegNonVeg === 'both';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/80 backdrop-blur-md">
        {/* Image */}
        {imageUrl && (
          <div className="relative h-56 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Veg/Non-Veg Badge */}
            <div className="absolute top-3 left-3 flex gap-2">
              {isBoth ? (
                <>
                  <div className="w-8 h-8 rounded border-2 flex items-center justify-center backdrop-blur-sm border-green-500 bg-green-500/20">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                  </div>
                  <div className="w-8 h-8 rounded border-2 flex items-center justify-center backdrop-blur-sm border-red-500 bg-red-500/20">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                  </div>
                </>
              ) : (
                <div className={`w-8 h-8 rounded border-2 flex items-center justify-center backdrop-blur-sm ${
                  isVeg 
                    ? 'border-green-500 bg-green-500/20' 
                    : 'border-red-500 bg-red-500/20'
                }`}>
                  <div className={`w-4 h-4 rounded-full ${
                    isVeg ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              )}
            </div>
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
