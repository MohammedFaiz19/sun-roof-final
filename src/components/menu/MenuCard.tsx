import { Heart, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/hooks/useMenu";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MenuCardProps {
  item: MenuItem;
  onViewDetails: () => void;
}

const spiceLevelIcons = {
  mild: "🌶️",
  medium: "🌶️🌶️",
  hot: "🌶️🌶️🌶️",
  extra: "🌶️🌶️🌶️🌶️",
};

export const MenuCard = ({ item, onViewDetails }: MenuCardProps) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('menu-favorites') || '[]');
    return favorites.includes(item.id);
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('menu-favorites') || '[]');
    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== item.id);
      localStorage.setItem('menu-favorites', JSON.stringify(updated));
    } else {
      favorites.push(item.id);
      localStorage.setItem('menu-favorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-border"
      onClick={onViewDetails}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Veg/Non-veg Badge */}
        <div className={cn(
          "absolute top-3 left-3 w-6 h-6 border-2 flex items-center justify-center rounded-sm",
          item.veg ? "border-food-veg" : "border-food-nonveg"
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full",
            item.veg ? "bg-food-veg" : "bg-food-nonveg"
          )} />
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background",
            isFavorite && "text-accent"
          )}
          onClick={toggleFavorite}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-3 left-3">
            {item.tags.map((tag) => (
              <Badge key={tag} className="bg-flat-yellow text-foreground font-semibold">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-playfair font-bold text-lg line-clamp-2 flex-1">
            {item.name}
          </h3>
          <span className="font-inter font-bold text-primary text-lg whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-inter">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs" title={`Spice Level: ${item.spiceLevel}`}>
              {spiceLevelIcons[item.spiceLevel]}
            </span>
            {item.allergens.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Contains: {item.allergens.slice(0, 2).join(', ')}
                {item.allergens.length > 2 && '...'}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
