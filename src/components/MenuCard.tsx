import { Card } from "@/components/ui/card";
import { MenuItem } from "@/data/menuData";

interface MenuCardProps {
  item: MenuItem;
  image?: string;
  index: number;
}

const MenuCard = ({ item, image, index }: MenuCardProps) => {
  const renderPrice = () => {
    if (typeof item.price === "string") {
      return <span className="text-primary font-bold text-lg">₹{item.price}</span>;
    }

    return (
      <div className="flex flex-col gap-1 text-sm">
        {item.price.veg && (
          <span className="text-muted-foreground">
            Veg: <span className="text-food-green font-semibold">₹{item.price.veg}</span>
          </span>
        )}
        {item.price.chicken && (
          <span className="text-muted-foreground">
            Chicken: <span className="text-food-orange font-semibold">₹{item.price.chicken}</span>
          </span>
        )}
        {item.price.nonVeg && (
          <span className="text-muted-foreground">
            Non-Veg: <span className="text-food-red font-semibold">₹{item.price.nonVeg}</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <Card 
      className="group overflow-hidden gradient-card hover-lift cursor-pointer border-2 border-border/50 transition-all duration-500 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2 flex-1">
            <h4 className="font-inter text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </h4>
            {/* Veg/Non-Veg Tag */}
            {item.type && (
              <span className={`flex-shrink-0 w-5 h-5 rounded-sm border-2 flex items-center justify-center mt-0.5 ${
                item.type === "veg" 
                  ? "border-green-600" 
                  : "border-red-600"
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  item.type === "veg" 
                    ? "bg-green-600" 
                    : "bg-red-600"
                }`}></span>
              </span>
            )}
          </div>
          <div className="shrink-0">{renderPrice()}</div>
        </div>
        
        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default MenuCard;
