--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: contact_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    instagram_url text NOT NULL,
    google_maps_url text NOT NULL,
    opening_hours text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    alt_text text NOT NULL,
    caption text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hero_slides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_slides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    alt_text text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    name text NOT NULL,
    price text NOT NULL,
    veg_nonveg text NOT NULL,
    description text NOT NULL,
    image_url text,
    generated_image_url text,
    image_generation_status text DEFAULT 'pending'::text,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT menu_items_image_generation_status_check CHECK ((image_generation_status = ANY (ARRAY['pending'::text, 'generating'::text, 'completed'::text, 'failed'::text]))),
    CONSTRAINT menu_items_veg_nonveg_check CHECK ((veg_nonveg = ANY (ARRAY['veg'::text, 'non-veg'::text, 'egg'::text])))
);


--
-- Name: contact_settings contact_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_settings
    ADD CONSTRAINT contact_settings_pkey PRIMARY KEY (id);


--
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- Name: hero_slides hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: idx_gallery_images_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_images_order ON public.gallery_images USING btree (display_order);


--
-- Name: idx_hero_slides_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hero_slides_order ON public.hero_slides USING btree (display_order);


--
-- Name: idx_menu_items_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_menu_items_category ON public.menu_items USING btree (category);


--
-- Name: idx_menu_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_menu_items_order ON public.menu_items USING btree (display_order);


--
-- Name: contact_settings update_contact_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_contact_settings_updated_at BEFORE UPDATE ON public.contact_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: gallery_images update_gallery_images_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: hero_slides update_hero_slides_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: menu_items update_menu_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contact_settings Public can view contact settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view contact settings" ON public.contact_settings FOR SELECT USING (true);


--
-- Name: gallery_images Public can view gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view gallery images" ON public.gallery_images FOR SELECT USING ((is_active = true));


--
-- Name: hero_slides Public can view hero slides; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view hero slides" ON public.hero_slides FOR SELECT USING ((is_active = true));


--
-- Name: menu_items Public can view menu items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING ((is_active = true));


--
-- Name: contact_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

--
-- Name: hero_slides; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

--
-- Name: menu_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


