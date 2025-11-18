import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ContactSettingsManager = () => {
  const { data: settings } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Phone</label>
            <p className="text-muted-foreground">{settings?.phone}</p>
          </div>
          <div>
            <label className="text-sm font-semibold">Instagram</label>
            <p className="text-muted-foreground">{settings?.instagram_url}</p>
          </div>
          <div>
            <label className="text-sm font-semibold">Opening Hours</label>
            <p className="text-muted-foreground">{settings?.opening_hours}</p>
          </div>
          <div>
            <label className="text-sm font-semibold">Google Maps</label>
            <p className="text-muted-foreground">{settings?.google_maps_url}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Edit functionality coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSettingsManager;