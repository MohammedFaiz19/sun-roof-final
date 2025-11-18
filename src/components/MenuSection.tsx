import { MenuCategory } from "@/data/menuData";
import { categoryImages } from "@/data/categoryImages";
import MenuCard from "./MenuCard";

interface MenuSectionProps {
  category: MenuCategory;
}

const MenuSection = ({ category }: MenuSectionProps) => {
  const categoryImage = categoryImages[category.id];
  
  return (
    <div className="mb-16" id={category.id}>
      <h3 className="mb-8 font-playfair text-3xl font-bold text-primary border-l-4 border-primary pl-4 animate-slide-in-left">
        {category.title}
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.items.map((item, index) => (
          <MenuCard 
            key={`${item.name}-${index}`} 
            item={item} 
            image={categoryImage}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
