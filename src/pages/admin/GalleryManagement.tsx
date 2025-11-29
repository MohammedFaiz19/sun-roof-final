import GalleryManager from '@/components/admin/GalleryManager';

const GalleryManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold mb-2">Gallery Albums</h1>
        <p className="text-muted-foreground">Organize gallery images into albums</p>
      </div>
      <GalleryManager />
    </div>
  );
};

export default GalleryManagement;