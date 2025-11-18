import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Egg, Plus } from 'lucide-react';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  veg: boolean;
  nonVeg?: boolean;
  egg?: boolean;
  image?: string;
  tags?: string[];
}

interface EnhancedMenuCardProps {
  item: MenuItem;
  isAnimated: boolean;
  index: number;
  onClick: () => void;
}

export const EnhancedMenuCard = ({ item, isAnimated, index, onClick }: EnhancedMenuCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSteam, setShowSteam] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Show steam effect for hot dishes
    if (item.tags?.includes('soup') || item.tags?.includes('hot')) {
      setShowSteam(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowSteam(false);
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "bg-background/60 backdrop-blur-md border-border/50",
        "hover:bg-background/80 hover:shadow-2xl hover:border-primary/30",
        isAnimated && "animate-fade-in",
        isHovered && "scale-105 -translate-y-2"
      )}
      style={{
        animationDelay: isAnimated ? `${index * 50}ms` : undefined,
        transform: isHovered ? 'perspective(1000px) rotateX(2deg)' : undefined,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm" />
      
      {/* Image container with tilt effect */}
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovered && "scale-110"
            )}
            style={{
              transform: isHovered ? 'perspective(1000px) rotateX(-5deg) translateZ(20px)' : undefined
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-6xl opacity-50">🍽️</span>
          </div>
        )}

        {/* Steam animation overlay */}
        {showSteam && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full animate-[rise_2s_ease-in-out_infinite]"
                  style={{
                    left: `${i * 10}px`,
                    animationDelay: `${i * 0.3}s`,
                    filter: 'blur(3px)'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Veg/Non-veg badge */}
        <div className="absolute top-2 right-2 flex gap-1">
          {item.veg && (
            <Badge variant="outline" className="bg-green-500/90 text-white border-green-600">
              <Leaf className="h-3 w-3 mr-1" />
              Veg
            </Badge>
          )}
          {item.nonVeg && (
            <Badge variant="outline" className="bg-red-500/90 text-white border-red-600">
              Non-Veg
            </Badge>
          )}
          {item.egg && (
            <Badge variant="outline" className="bg-amber-500/90 text-white border-amber-600">
              <Egg className="h-3 w-3 mr-1" />
              Egg
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="relative p-4 space-y-3">
        {/* Floating gradient orb background */}
        <div className={cn(
          "absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        <div className="relative space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-primary">
              ₹{item.price}
            </span>
            
            <Button
              size="sm"
              className={cn(
                "gap-1 transition-all duration-300",
                isHovered && "animate-pulse scale-110"
              )}
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic
              }}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Shine effect on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "pointer-events-none"
      )} 
      style={{
        transform: 'translateX(-100%)',
        animation: isHovered ? 'shine 1s ease-in-out' : undefined
      }}
      />
    </Card>
  );
};
