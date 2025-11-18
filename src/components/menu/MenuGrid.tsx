import { MenuCard } from "./MenuCard";
import { MenuItem } from "@/hooks/useMenu";

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export const MenuGrid = ({ items, onItemClick }: MenuGridProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-6 text-6xl">🍽️</div>
        <h3 className="font-playfair text-2xl font-bold mb-2">No dishes found</h3>
        <p className="text-muted-foreground font-inter mb-6">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onViewDetails={() => onItemClick(item)}
        />
      ))}
    </div>
  );
};
