-- Add logo_url column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '';

-- Create public bucket for profile logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-logos', 'profile-logos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies on storage.objects for this bucket
CREATE POLICY "Profile logos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-logos');

CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);