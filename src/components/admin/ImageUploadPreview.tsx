import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Eye } from "lucide-react";
import { previewImageFile, normalizeFilename } from "@/lib/imageUtils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadPreviewProps {
  onUpload: (file: File, normalizedName: string) => Promise<void>;
  label?: string;
  currentImage?: string;
}

/**
 * Image upload component with local preview before server upload
 */
export const ImageUploadPreview = ({
  onUpload,
  label = "Upload Image",
  currentImage
}: ImageUploadPreviewProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [normalizedName, setNormalizedName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Generate normalized filename
      const normalized = normalizeFilename(file.name);
      setNormalizedName(normalized);
      
      // Create preview
      previewImageFile(file, (dataUrl) => {
        setPreview(dataUrl);
        setSelectedFile(file);
      });

      toast({
        title: "Preview Ready",
        description: `File will be saved as: ${normalized}`,
      });
    } catch (error: any) {
      toast({
        title: "Invalid File",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile, normalizedName);
      
      toast({
        title: "Upload Successful",
        description: "Image has been uploaded to public assets",
      });

      // Clear preview
      setPreview(null);
      setSelectedFile(null);
      setNormalizedName("");
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setNormalizedName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image */}
        {currentImage && !preview && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Current Image</Label>
            <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
              <img
                src={currentImage}
                alt="Current"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="text-xs">Select Image</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Preview
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPreview}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden border-2 border-primary">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Will be saved as: <code className="text-primary">{normalizedName}</code>
            </p>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload to Public Assets"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
