import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, RefreshCw, Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";

// CSV validation schema
const menuItemSchema = z.object({
  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  price: z.string()
    .trim()
    .regex(/^₹?\d+$/, "Price must be a valid number (e.g., ₹150 or 150)"),
  veg_nonveg: z.enum(["veg", "non-veg", "egg"], {
    errorMap: () => ({ message: "Must be 'veg', 'non-veg', or 'egg'" })
  }),
  description: z.string()
    .trim()
    .max(500, "Description must be less than 500 characters"),
  display_order: z.number().int().nonnegative()
});

type ValidatedMenuItem = z.infer<typeof menuItemSchema>;

const MenuManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  // Fetch menu items
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Upload custom image
  const uploadCustomImage = useMutation({
    mutationFn: async ({ itemId, file }: { itemId: string; file: File }) => {
      const item = menuItems?.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      // Update menu item with custom image URL
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: publicUrl })
        .eq('id', itemId);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({
        title: "Image Uploaded!",
        description: "Custom image has been successfully uploaded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete custom image
  const deleteCustomImage = useMutation({
    mutationFn: async (itemId: string) => {
      const item = menuItems?.find(i => i.id === itemId);
      if (!item?.image_url) throw new Error('No custom image to delete');

      // Extract file path from URL
      const urlParts = item.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('menu-images')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Remove URL from database
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: null })
        .eq('id', itemId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({
        title: "Image Deleted!",
        description: "Custom image has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image.",
        variant: "destructive",
      });
    },
  });

  // Regenerate image for a single item
  const regenerateImage = useMutation({
    mutationFn: async (itemId: string) => {
      const item = menuItems?.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Update status to generating
      await supabase
        .from('menu_items')
        .update({ image_generation_status: 'generating' })
        .eq('id', itemId);

      // Call edge function to generate image
      const { data, error } = await supabase.functions.invoke('generate-dish-image', {
        body: {
          dishName: item.name,
          category: item.category,
          vegNonVeg: item.veg_nonveg,
          description: item.description,
        },
      });

      if (error) throw error;

      // Update with generated image
      await supabase
        .from('menu_items')
        .update({
          generated_image_url: data.imageUrl,
          image_generation_status: 'completed',
        })
        .eq('id', itemId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      toast({
        title: "Image Generated!",
        description: "Dish image has been successfully generated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate all missing images
  const generateAllImages = async () => {
    setIsGeneratingImages(true);
    const itemsWithoutImages = menuItems?.filter(
      item => !item.generated_image_url || item.image_generation_status === 'failed'
    ) || [];

    toast({
      title: "Generating Images...",
      description: `Processing ${itemsWithoutImages.length} dishes`,
    });

    for (const item of itemsWithoutImages) {
      try {
        await regenerateImage.mutateAsync(item.id);
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate image for ${item.name}:`, error);
      }
    }

    setIsGeneratingImages(false);
    toast({
      title: "Batch Complete!",
      description: "All images have been processed.",
    });
  };

  // Handle CSV upload
  const handleCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    const text = await csvFile.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    // Validate required headers
    const requiredHeaders = ['category', 'name', 'price', 'veg_nonveg'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      toast({
        title: "Invalid CSV",
        description: `Missing required columns: ${missingHeaders.join(', ')}. CSV must have 'category', 'name', 'price', 'veg_nonveg', 'description' columns`,
        variant: "destructive",
      });
      return;
    }

    // Parse and validate each item
    const validationErrors: string[] = [];
    const items: ValidatedMenuItem[] = [];
    
    lines.slice(1).forEach((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const item = {
        category: values[headers.indexOf('category')],
        name: values[headers.indexOf('name')],
        price: values[headers.indexOf('price')],
        veg_nonveg: values[headers.indexOf('veg_nonveg')],
        description: values[headers.indexOf('description')] || '',
        display_order: index,
      };

      // Validate with Zod schema
      try {
        const validatedItem = menuItemSchema.parse(item);
        items.push(validatedItem);
      } catch (error) {
        if (error instanceof z.ZodError) {
          validationErrors.push(
            `Row ${index + 2} (${item.name || 'unnamed'}): ${error.errors.map(e => e.message).join(', ')}`
          );
        }
      }
    });

    // If validation errors, show them to user
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Failed",
        description: (
          <div className="max-h-48 overflow-y-auto">
            <p className="font-semibold mb-2">Found {validationErrors.length} error(s):</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              {validationErrors.slice(0, 5).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
              {validationErrors.length > 5 && (
                <li>...and {validationErrors.length - 5} more errors</li>
              )}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "No Valid Items",
        description: "CSV contains no valid menu items to upload",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from('menu_items').insert(
      items as Array<{
        category: string;
        name: string;
        price: string;
        veg_nonveg: string;
        description: string;
        display_order: number;
      }>
    );

    if (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
    setCsvFile(null);
    toast({
      title: "Menu Uploaded!",
      description: `${items.length} items added successfully.`,
    });

    // Auto-generate images for new items
    if (confirm('Generate AI images for all new dishes?')) {
      await generateAllImages();
    }
  };

  const groupedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="space-y-6">
      {/* CSV Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Menu CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCSVUpload} className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="border-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                CSV format: category,name,price,veg_nonveg,description
              </p>
            </div>
            <Button type="submit" disabled={!csvFile}>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Generate Images
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Batch Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateAllImages}
            disabled={isGeneratingImages}
            className="gradient-foodie text-white"
          >
            {isGeneratingImages ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate All Missing Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      {isLoading ? (
        <p>Loading menu items...</p>
      ) : (
        Object.entries(groupedItems || {}).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border-2 border-border rounded-lg"
                  >
                    {/* Image Preview */}
                    <div className="relative w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image_url || item.generated_image_url ? (
                        <>
                          <img
                            src={item.image_url || item.generated_image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {item.image_url && (
                            <Badge className="absolute top-1 left-1 text-xs bg-primary/90">
                              Custom
                            </Badge>
                          )}
                        </>
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <Badge variant={item.veg_nonveg === 'veg' ? 'default' : 'destructive'}>
                          {item.veg_nonveg === 'veg' ? '🟢 Veg' : item.veg_nonveg === 'egg' ? '🟤 Egg' : '🔴 Non-veg'}
                        </Badge>
                        <Badge variant="outline">{item.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Image: {item.image_url ? 'Custom Upload' : item.generated_image_url ? 'AI Generated' : 'None'} • 
                        Status: {item.image_generation_status || 'pending'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* Upload Custom Image */}
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              uploadCustomImage.mutate({ itemId: item.id, file });
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          disabled={uploadCustomImage.isPending}
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4" />
                          </span>
                        </Button>
                      </label>

                      {/* Delete Custom Image */}
                      {item.image_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCustomImage.mutate(item.id)}
                          disabled={deleteCustomImage.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Regenerate AI Image */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateImage.mutate(item.id)}
                        disabled={regenerateImage.isPending}
                      >
                        <RefreshCw className={`h-4 w-4 ${regenerateImage.isPending ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MenuManager;