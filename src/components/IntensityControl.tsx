import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IntensityLevel } from "./FoodieBackground";

interface IntensityControlProps {
  intensity: IntensityLevel;
  onIntensityChange: (intensity: IntensityLevel) => void;
}

export const IntensityControl = ({ intensity, onIntensityChange }: IntensityControlProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:scale-105 transition-transform"
        >
          <Settings className="w-4 h-4 mr-2" />
          Background
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Animation Intensity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onIntensityChange("light")}
          className={intensity === "light" ? "bg-accent" : ""}
        >
          <span className="mr-2">🌟</span>
          Light (8 stickers)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onIntensityChange("medium")}
          className={intensity === "medium" ? "bg-accent" : ""}
        >
          <span className="mr-2">✨</span>
          Medium (15 stickers)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onIntensityChange("heavy")}
          className={intensity === "heavy" ? "bg-accent" : ""}
        >
          <span className="mr-2">🎉</span>
          Heavy (25 stickers)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
