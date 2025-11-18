import { useEffect } from "react";
import { MenuItem } from "@/hooks/useMenu";

interface MenuSchemaProps {
  items: MenuItem[];
}

export const MenuSchema = ({ items }: MenuSchemaProps) => {
  useEffect(() => {
    const groupedByCategory = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    const menuSections = Object.entries(groupedByCategory).map(([category, categoryItems]) => ({
      "@type": "MenuSection",
      "name": category,
      "hasMenuItem": categoryItems.map((item) => ({
        "@type": "MenuItem",
        "name": item.name,
        "description": item.description,
        "image": `${window.location.origin}${item.image}`,
        "offers": {
          "@type": "Offer",
          "price": item.price.toString(),
          "priceCurrency": "INR",
        },
        "suitableForDiet": item.veg 
          ? "https://schema.org/VegetarianDiet" 
          : "https://schema.org/NonVegetarianDiet",
      })),
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Sunroof Cafe & Restaurant",
      "description": "Experience authentic cuisine in a warm, inviting atmosphere with 145+ dishes including Indo-Chinese starters, pasta, pizza, burgers, desserts, and beverages.",
      "hasMenu": {
        "@type": "Menu",
        "hasMenuSection": menuSections,
      },
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(schema);
    scriptTag.id = 'menu-schema';

    const existingScript = document.getElementById('menu-schema');
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(scriptTag);

    return () => {
      const script = document.getElementById('menu-schema');
      if (script) {
        script.remove();
      }
    };
  }, [items]);

  return null;
};
