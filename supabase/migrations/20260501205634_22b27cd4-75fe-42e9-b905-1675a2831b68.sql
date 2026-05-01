DROP POLICY IF EXISTS "Profile logos are publicly viewable" ON storage.objects;

CREATE POLICY "Profile logos are publicly viewable"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'profile-logos'
  AND (storage.foldername(name))[2] IS NULL
  AND name LIKE '%/logo.%'
);