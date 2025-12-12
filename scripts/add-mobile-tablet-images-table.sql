-- Migration: Add hero_section_mobile_tablet_background_images table
-- This table stores mobile/tablet background images for the hero section global
-- Matches the structure of hero_section_background_images table

-- Create the table (matching the pattern of hero_section_background_images)
CREATE TABLE IF NOT EXISTS "hero_section_mobile_tablet_background_images" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "image_id" integer
);

-- Add foreign key constraint to hero_section (only if hero_section table exists and constraint doesn't exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hero_section') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'hero_section_mobile_tablet_background_images_parent_id_fk'
    ) THEN
      ALTER TABLE "hero_section_mobile_tablet_background_images" 
        ADD CONSTRAINT "hero_section_mobile_tablet_background_images_parent_id_fk" 
        FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_section"("id") 
        ON DELETE cascade ON UPDATE no action;
    END IF;
  END IF;
END $$;

-- Add foreign key constraint to media (only if media table exists and constraint doesn't exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'media') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'hero_section_mobile_tablet_background_images_image_id_media_id_fk'
    ) THEN
      ALTER TABLE "hero_section_mobile_tablet_background_images" 
        ADD CONSTRAINT "hero_section_mobile_tablet_background_images_image_id_media_id_fk" 
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") 
        ON DELETE set null ON UPDATE no action;
    END IF;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "hero_section_mobile_tablet_background_images_order_idx" 
  ON "hero_section_mobile_tablet_background_images" USING btree ("_order");

CREATE INDEX IF NOT EXISTS "hero_section_mobile_tablet_background_images_parent_id_idx" 
  ON "hero_section_mobile_tablet_background_images" USING btree ("_parent_id");

CREATE INDEX IF NOT EXISTS "hero_section_mobile_tablet_background_images_image_id_idx" 
  ON "hero_section_mobile_tablet_background_images" USING btree ("image_id");

