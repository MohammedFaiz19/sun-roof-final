import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const MenuSearch = ({ value, onChange }: MenuSearchProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 250);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search dishes, ingredients, categories..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-12 pr-12 h-14 text-lg border-2 border-primary/20 focus:border-primary rounded-full font-inter"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
