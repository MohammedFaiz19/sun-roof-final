/**
 * Image handling utilities for predictable, public asset management
 */

const PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg';
const IMAGE_BASE_PATH = '/assets/images';

/**
 * Normalize filename to lowercase alphanumeric with underscores
 */
export const normalizeFilename = (filename: string): string => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_');
};

/**
 * Get the full image path from a filename
 */
export const getImagePath = (filename: string): string => {
  if (!filename) return PLACEHOLDER_IMAGE;
  
  // If already a full URL or root-relative path, return as is
  if (filename.startsWith('http') || filename.startsWith('/')) {
    return filename;
  }
  
  // Otherwise construct the path
  const normalized = normalizeFilename(filename);
  return `${IMAGE_BASE_PATH}/${normalized}`;
};

/**
 * Handle image load error by setting fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>
): void => {
  const img = event.currentTarget;
  if (img.src !== PLACEHOLDER_IMAGE) {
    img.src = PLACEHOLDER_IMAGE;
  }
};

/**
 * Validate and preview an image file before upload
 */
export const previewImageFile = (
  file: File,
  callback: (dataUrl: string) => void
): void => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result as string);
  };
  reader.readAsDataURL(file);
};

/**
 * Get the public URL for uploaded images (for database storage)
 */
export const getPublicImageUrl = (filename: string): string => {
  const normalized = normalizeFilename(filename);
  return `${IMAGE_BASE_PATH}/${normalized}`;
};
