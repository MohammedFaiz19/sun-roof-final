import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SlidersHorizontal, X } from "lucide-react";

export interface MenuFiltersState {
  categories: string[];
  dietary: string[];
  spiceLevel: string;
  priceRange: [number, number];
  tags: string[];
}

interface MenuFiltersProps {
  filters: MenuFiltersState;
  onFiltersChange: (filters: MenuFiltersState) => void;
  categoryCounts: Record<string, number>;
}

const categories = [
  { value: "Starters → Soups", label: "Starters → Soups" },
  { value: "Chinese Veg Starter", label: "Chinese Veg Starter" },
  { value: "Chinese Non-Veg Starter", label: "Chinese Non-Veg Starter" },
  { value: "Momos", label: "Momos" },
  { value: "Sharings", label: "Sharings" },
  { value: "Main Course Chinese → Rice", label: "Main Course Chinese → Rice" },
  { value: "Main Course Chinese → Noodles", label: "Main Course Chinese → Noodles" },
  { value: "Pasta", label: "Pasta" },
  { value: "Pizza", label: "Pizza" },
  { value: "Burger", label: "Burgers" },
  { value: "Sandwiches", label: "Sandwiches" },
  { value: "Healthy & Light → Salads", label: "Healthy & Light → Salads" },
  { value: "Healthy & Light → Juices", label: "Healthy & Light → Juices" },
  { value: "Desserts", label: "Desserts" },
  { value: "Beverages → Mojitos", label: "Beverages → Mojitos" },
  { value: "Beverages → Milkshakes", label: "Beverages → Milkshakes" },
  { value: "Beverages", label: "Beverages (Other)" },
];

const dietaryOptions = [
  { value: "veg", label: "Vegetarian" },
  { value: "non-veg", label: "Non-Vegetarian" },
];

const spiceLevels = [
  { value: "all", label: "All Spice Levels" },
  { value: "mild", label: "Mild 🌶️" },
  { value: "medium", label: "Medium 🌶️🌶️" },
  { value: "hot", label: "Hot 🌶️🌶️🌶️" },
  { value: "extra", label: "Extra Hot 🌶️🌶️🌶️🌶️" },
];

export const MenuFilters = ({ filters, onFiltersChange, categoryCounts }: MenuFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleDietary = (dietary: string) => {
    const newDietary = filters.dietary.includes(dietary)
      ? filters.dietary.filter((d) => d !== dietary)
      : [...filters.dietary, dietary];
    onFiltersChange({ ...filters, dietary: newDietary });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      dietary: [],
      spiceLevel: "all",
      priceRange: [0, 500],
      tags: [],
    });
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.dietary.length + 
    (filters.spiceLevel !== "all" ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-playfair text-2xl">Filters</SheetTitle>
          <SheetDescription className="font-inter">
            Refine your menu selection
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full gap-2"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          )}

          <Accordion type="multiple" defaultValue={["categories", "dietary", "spice"]}>
            {/* Categories */}
            <AccordionItem value="categories">
              <AccordionTrigger className="font-inter font-semibold">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={filters.categories.includes(category.value)}
                          onCheckedChange={() => toggleCategory(category.value)}
                        />
                        <Label
                          htmlFor={category.value}
                          className="text-sm font-inter cursor-pointer"
                        >
                          {category.label}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {categoryCounts[category.value] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Dietary */}
            <AccordionItem value="dietary">
              <AccordionTrigger className="font-inter font-semibold">
                Dietary Preferences
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {dietaryOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={filters.dietary.includes(option.value)}
                        onCheckedChange={() => toggleDietary(option.value)}
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-sm font-inter cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Spice Level */}
            <AccordionItem value="spice">
              <AccordionTrigger className="font-inter font-semibold">
                Spice Level
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={filters.spiceLevel}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, spiceLevel: value })
                  }
                >
                  <div className="space-y-3">
                    {spiceLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.value} id={level.value} />
                        <Label
                          htmlFor={level.value}
                          className="text-sm font-inter cursor-pointer"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger className="font-inter font-semibold">
                Price Range
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      onFiltersChange({ ...filters, priceRange: value as [number, number] })
                    }
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};
