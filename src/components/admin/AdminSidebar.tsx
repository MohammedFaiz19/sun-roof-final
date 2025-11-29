import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Calendar, 
  Tag, 
  Image, 
  ImageIcon, 
  Star, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/sunroof-logo-new.jpg';

const AdminSidebar = () => {
  const { signOut } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { to: '/admin/events', label: 'Events', icon: Calendar },
    { to: '/admin/offers', label: 'Offers & Coupons', icon: Tag },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/gallery', label: 'Gallery Albums', icon: Image },
    { to: '/admin/hero', label: 'Hero Slides', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Sunroof Logo" className="h-10 w-10 rounded-full" />
          <div>
            <h2 className="font-playfair font-bold text-lg">Sunroof</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-inter">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button 
          onClick={signOut} 
          variant="outline" 
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;