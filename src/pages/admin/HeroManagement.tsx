import HeroSlidesManager from '@/components/admin/HeroSlidesManager';

const HeroManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold mb-2">Hero Slides</h1>
        <p className="text-muted-foreground">Manage homepage hero carousel with overlays and CTAs</p>
      </div>
      <HeroSlidesManager />
    </div>
  );
};

export default HeroManagement;