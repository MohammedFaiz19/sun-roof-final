import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HeroSlidesManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Slides Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Hero slides management coming soon. Currently using static images from gallery.
        </p>
      </CardContent>
    </Card>
  );
};

export default HeroSlidesManager;