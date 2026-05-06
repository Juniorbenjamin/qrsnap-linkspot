
CREATE TABLE public.mockup_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mockup_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mockup slides are viewable by everyone"
  ON public.mockup_slides FOR SELECT USING (true);

-- Admin role for managing landing page mockups
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage mockup slides insert"
  ON public.mockup_slides FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage mockup slides update"
  ON public.mockup_slides FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage mockup slides delete"
  ON public.mockup_slides FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER touch_mockup_slides
  BEFORE UPDATE ON public.mockup_slides
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Public storage bucket for landing-page mockup images
INSERT INTO storage.buckets (id, name, public) VALUES ('mockups', 'mockups', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read mockups"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'mockups');

CREATE POLICY "Admins upload mockups"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'mockups' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update mockups"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'mockups' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete mockups"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'mockups' AND public.has_role(auth.uid(), 'admin'));
