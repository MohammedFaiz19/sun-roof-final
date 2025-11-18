import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

export const BatchImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ total: 0, successful: 0, failed: 0 });

  const handleBatchGenerate = async () => {
    setIsGenerating(true);
    toast.info("Starting batch image generation...");

    try {
      const { data, error } = await supabase.functions.invoke('batch-generate-images');

      if (error) throw error;

      setProgress(data);
      
      if (data.successful > 0) {
        toast.success(`Successfully generated ${data.successful} images!`);
      }
      
      if (data.failed > 0) {
        toast.error(`Failed to generate ${data.failed} images`);
        console.error('Failed items:', data.errors);
      }
    } catch (error) {
      console.error('Batch generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">AI Image Generation</h3>
          <p className="text-sm text-muted-foreground">
            Generate AI images for all menu items using Lovable AI Gateway
          </p>
        </div>

        {progress.total > 0 && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-semibold">{progress.total}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Successful:</span>
              <span className="font-semibold">{progress.successful}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Failed:</span>
              <span className="font-semibold">{progress.failed}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleBatchGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate All Menu Images
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
