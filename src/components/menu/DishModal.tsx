import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/hooks/useMenu";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DishModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const spiceLevelIcons = {
  mild: "🌶️",
  medium: "🌶️🌶️",
  hot: "🌶️🌶️🌶️",
  extra: "🌶️🌶️🌶️🌶️",
};

const spiceLevelText = {
  mild: "Mild",
  medium: "Medium",
  hot: "Hot",
  extra: "Extra Hot",
};

export const DishModal = ({ item, isOpen, onClose }: DishModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle className="font-playfair text-3xl pr-8">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
            <img
              src={item.image}
              alt={item.alt}
              className="h-full w-full object-cover"
            />
            
            {/* Veg/Non-veg Badge */}
            <div className={cn(
              "absolute top-4 left-4 w-8 h-8 border-2 flex items-center justify-center rounded-sm bg-background/90",
              item.veg ? "border-food-veg" : "border-food-nonveg"
            )}>
              <div className={cn(
                "w-4 h-4 rounded-full",
                item.veg ? "bg-food-veg" : "bg-food-nonveg"
              )} />
            </div>
          </div>

          {/* Price & Tags */}
          <div className="flex items-center justify-between">
            <div className="font-inter font-bold text-3xl text-primary">
              ₹{item.price}
            </div>
            <div className="flex gap-2">
              {item.tags?.map((tag) => (
                <Badge key={tag} className="bg-flat-yellow text-foreground font-semibold">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-inter font-semibold text-lg mb-2">Description</h3>
            <p className="text-muted-foreground font-inter leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
            <div>
              <h4 className="font-inter font-semibold text-sm text-muted-foreground mb-1">
                Category
              </h4>
              <p className="font-inter">{item.category}</p>
            </div>
            <div>
              <h4 className="font-inter font-semibold text-sm text-muted-foreground mb-1">
                Subcategory
              </h4>
              <p className="font-inter">{item.subCategory}</p>
            </div>
            <div>
              <h4 className="font-inter font-semibold text-sm text-muted-foreground mb-1">
                Spice Level
              </h4>
              <p className="font-inter flex items-center gap-2">
                <span>{spiceLevelIcons[item.spiceLevel]}</span>
                <span>{spiceLevelText[item.spiceLevel]}</span>
              </p>
            </div>
            <div>
              <h4 className="font-inter font-semibold text-sm text-muted-foreground mb-1">
                Type
              </h4>
              <p className="font-inter">{item.veg ? 'Vegetarian' : 'Non-Vegetarian'}</p>
            </div>
          </div>

          {/* Allergens */}
          {item.allergens.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <h3 className="font-inter font-semibold text-lg mb-2 flex items-center gap-2">
                <span>⚠️</span>
                Allergen Information
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                This dish contains: <span className="font-semibold">{item.allergens.join(', ')}</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
