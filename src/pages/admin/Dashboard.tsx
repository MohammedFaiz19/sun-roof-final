import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Calendar, Tag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { data: menuCount } = useQuery({
    queryKey: ['menu-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      return count || 0;
    },
  });

  const { data: eventsCount } = useQuery({
    queryKey: ['events-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      return count || 0;
    },
  });

  const { data: offersCount } = useQuery({
    queryKey: ['offers-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      return count || 0;
    },
  });

  const stats = [
    { title: 'Menu Items', value: menuCount || 0, icon: UtensilsCrossed, link: '/admin/menu' },
    { title: 'Active Events', value: eventsCount || 0, icon: Calendar, link: '/admin/events' },
    { title: 'Active Offers', value: offersCount || 0, icon: Tag, link: '/admin/offers' },
    { title: 'Reviews', value: 3, icon: Star, link: '/admin/reviews' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Sunroof Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <Link to={stat.link}>
                <Button variant="link" className="px-0 text-xs">
                  View details →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/menu">
              <Button className="w-full justify-start" variant="outline">
                <UtensilsCrossed className="mr-2 h-4 w-4" />
                Manage Menu Items
              </Button>
            </Link>
            <Link to="/admin/events">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
            </Link>
            <Link to="/admin/offers">
              <Button className="w-full justify-start" variant="outline">
                <Tag className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking coming soon. This will show recent changes to menu, events, and offers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;