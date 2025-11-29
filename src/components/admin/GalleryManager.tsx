import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Trash2, Edit2, Save, X, GripVertical, Image as ImageIcon } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type GalleryImage = Tables<"gallery_images">;

const GalleryManager = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({ alt_text: "", caption: "", album: "general" });
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["gallery-images-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (image: Partial<GalleryImage> & { id: string }) => {
      const { error } = await supabase
        .from("gallery_images")
        .update(image)
        .eq("id", image.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images-admin"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Image updated successfully");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update image"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images-admin"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Image deleted successfully");
    },
    onError: () => toast.error("Failed to delete image"),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile) throw new Error("No file selected");

      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      const maxOrder = images.reduce((max, img) => Math.max(max, img.display_order), 0);

      const { error: insertError } = await supabase
        .from("gallery_images")
        .insert({
          image_url: publicUrl,
          alt_text: uploadForm.alt_text,
          caption: uploadForm.caption,
          album: uploadForm.album,
          display_order: maxOrder + 1,
          is_active: true,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images-admin"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Image uploaded successfully");
      setUploadFile(null);
      setUploadForm({ alt_text: "", caption: "", album: "general" });
    },
    onError: () => toast.error("Failed to upload image"),
  });

  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditForm(image);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateMutation.mutate({ ...editForm, id: editingId });
    }
  };

  const toggleActive = (image: GalleryImage) => {
    updateMutation.mutate({ id: image.id, is_active: !image.is_active });
  };

  const moveImage = (id: string, direction: "up" | "down") => {
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) return;
    
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const currentOrder = images[index].display_order;
    const swapOrder = images[swapIndex].display_order;

    updateMutation.mutate({ id: images[index].id, display_order: swapOrder });
    updateMutation.mutate({ id: images[swapIndex].id, display_order: currentOrder });
  };

  if (isLoading) {
    return <Card><CardContent className="pt-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New Image
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="file-upload">Image File</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                placeholder="Descriptive alt text"
                value={uploadForm.alt_text}
                onChange={(e) => setUploadForm({ ...uploadForm, alt_text: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                placeholder="Image caption"
                value={uploadForm.caption}
                onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                placeholder="Album name (e.g., Interior, Food, Events)"
                value={uploadForm.album}
                onChange={(e) => setUploadForm({ ...uploadForm, album: e.target.value })}
              />
            </div>
            <Button
              onClick={() => uploadMutation.mutate()}
              disabled={!uploadFile || !uploadForm.alt_text || uploadMutation.isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>

        {/* Images List */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Gallery Images ({images.length})
          </h3>
          {images.map((image, index) => (
            <div key={image.id} className="border rounded-lg p-4 space-y-3">
              {editingId === image.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Alt Text"
                        value={editForm.alt_text || ""}
                        onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                      />
                      <Input
                        placeholder="Caption"
                        value={editForm.caption || ""}
                        onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                      />
                      <Input
                        placeholder="Album"
                        value={editForm.album || "general"}
                        onChange={(e) => setEditForm({ ...editForm, album: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveImage(image.id, "up")}
                      disabled={index === 0}
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{image.caption}</p>
                    <p className="text-sm text-muted-foreground">{image.alt_text}</p>
                    <p className="text-xs text-muted-foreground">Album: {image.album || 'general'}</p>
                    <p className="text-xs text-muted-foreground">Order: {image.display_order}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${image.id}`} className="text-sm">Active</Label>
                      <Switch
                        id={`active-${image.id}`}
                        checked={image.is_active}
                        onCheckedChange={() => toggleActive(image)}
                      />
                    </div>
                    <Button size="icon" variant="outline" onClick={() => startEdit(image)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Delete this image?")) {
                          deleteMutation.mutate(image.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryManager;
