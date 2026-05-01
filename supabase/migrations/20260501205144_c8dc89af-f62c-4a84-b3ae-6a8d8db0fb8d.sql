ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bg_color text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS button_color text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS button_text_color text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS button_style text NOT NULL DEFAULT 'rounded',
  ADD COLUMN IF NOT EXISTS font_weight text NOT NULL DEFAULT 'semibold';