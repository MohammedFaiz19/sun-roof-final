import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import GalleryManager from "@/components/admin/GalleryManager";
import MenuManager from "@/components/admin/MenuManager";
import { BatchImageGenerator } from "@/components/admin/BatchImageGenerator";
import ContactSettingsManager from "@/components/admin/ContactSettingsManager";
import { Shield } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24" id="main-content">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-playfair text-4xl font-bold gradient-text">Admin Panel</h1>
          </div>
          <p className="font-inter text-muted-foreground">
            Manage your restaurant's content, menu, and settings
          </p>
        </div>

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="hero">Hero Slides</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="contact">Contact Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <BatchImageGenerator />
            <MenuManager />
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <HeroSlidesManager />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactSettingsManager />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;