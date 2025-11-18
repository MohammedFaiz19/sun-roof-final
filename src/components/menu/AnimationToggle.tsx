import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AnimationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const AnimationToggle = ({ enabled, onToggle }: AnimationToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
      <Sparkles className={`h-4 w-4 transition-colors ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
      <Label htmlFor="animation-toggle" className="text-sm cursor-pointer">
        Background Animations
      </Label>
      <Switch
        id="animation-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
        aria-label="Toggle background animations"
      />
    </div>
  );
};
