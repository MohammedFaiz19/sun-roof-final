import { Route, Routes } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Dashboard from './admin/Dashboard';
import MenuManagement from './admin/MenuManagement';
import EventsManagement from './admin/EventsManagement';
import OffersManagement from './admin/OffersManagement';
import ReviewsManagement from './admin/ReviewsManagement';
import GalleryManagement from './admin/GalleryManagement';
import HeroManagement from './admin/HeroManagement';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-8" id="main-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="events" element={<EventsManagement />} />
          <Route path="offers" element={<OffersManagement />} />
          <Route path="reviews" element={<ReviewsManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="hero" element={<HeroManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;