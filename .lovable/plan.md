## Premium Link-in-Bio Redesign

This is a substantial overhaul touching the public profile, dashboard editor, database, and analytics. I'll ship it in phases so each step is reviewable and stable.

### Phase 1 — Public profile redesign (`/u/$username`)
The biggest visible win. Make profiles feel like mini-websites.

**Hero**
- Large circular avatar/logo with subtle ring + shadow
- Display name + optional verified checkmark badge
- Tagline/bio with proper typography (SF-style)
- Animated gradient background option (CSS conic/linear with slow keyframes)
- Social icon row (Instagram, TikTok, YouTube, X, LinkedIn, Facebook, WhatsApp, email)
- Floating glassmorphism card containing the content

**Smart link buttons**
- Large rounded buttons with hover lift + tap scale
- Per-link icon (auto-detected from URL or user-picked from a curated lucide set)
- Per-link thumbnail image (optional)
- Per-link custom color override
- "Most clicked" badge (computed from `scan_events`)
- Featured/pinned links rendered larger at top
- Click tracking already wired via `trackEvent`

**Embed/section blocks (new link types)**
- YouTube / TikTok embed (iframe)
- Spotify / Apple Music embed
- Product card (image + title + price + CTA)
- Image gallery (grid)
- Testimonial card
- Email capture form (writes to a new `email_subscribers` table)
- WhatsApp quick contact button (deeplink)
- Payment link (uses existing Paddle or external URL)
- Appointment booking link (Calendly/Cal.com URL)

**Polish**
- Smooth scroll-in animations (fade-in + translate)
- Premium loading skeleton
- Better dark mode contrast
- "Powered by QRLinkSpot" only on free plans (already present)
- Share + QR button floating in corner that opens a sheet with the profile QR

### Phase 2 — Database schema additions
Single migration adding what the new features need. New columns are nullable with defaults so existing profiles keep working.

**`profiles` additions**
- `is_verified boolean default false`
- `tagline text default ''`
- `cover_url text` (background image)
- `bg_video_url text` (background video)
- `bg_animated boolean default false` (animated gradient toggle)
- `font_family text default 'inter'`
- `social_links jsonb default '{}'` (instagram, tiktok, youtube, x, linkedin, facebook, whatsapp, email)
- `whatsapp_number text`
- `booking_url text`
- `accent_color text default ''`

**`links` additions**
- `link_type text default 'link'` (link | youtube | tiktok | spotify | product | gallery | testimonial | email_capture | whatsapp | payment | booking | header)
- `icon text` (lucide name or emoji)
- `thumbnail_url text`
- `color text` (button override)
- `is_featured boolean default false`
- `is_pinned boolean default false`
- `metadata jsonb default '{}'` (type-specific: price, embed_id, gallery images array, quote/author, etc.)

**New `email_subscribers` table** with RLS so owners see their subscribers and anyone can insert.

### Phase 3 — Dashboard editor upgrade
Visual editor matching the new capabilities.

- Drag-and-drop reorder (use `@dnd-kit/core` + `@dnd-kit/sortable`)
- "Add block" menu with all link types
- Inline thumbnail/icon/color picker per link
- Pin / feature toggles
- Theme preset gallery (8+ presets) + custom color pickers
- Font selector (Inter, SF Pro fallback, Poppins, Playfair, Space Grotesk, JetBrains Mono)
- Background: solid / gradient / animated gradient / image upload / video URL
- Verified badge toggle (Pro)
- Social handles inputs
- WhatsApp / booking URL fields
- **Live preview pane** rendering the actual public profile component side-by-side (desktop) / sheet (mobile)

### Phase 4 — SEO & sharing
- Per-profile `head()` meta in `/u/$username` route loader: title, description, og:title, og:description, og:image (avatar/cover), twitter card, JSON-LD `Person`/`LocalBusiness`
- Sitemap entry generation for public profiles (best-effort)

### Phase 5 — Analytics surfacing
- Per-link click counts already tracked → display in dashboard list
- "Most clicked" badge derived from a lightweight aggregation server fn

### Technical notes
- New components: `PublicProfileHero`, `LinkButton`, `EmbedBlock`, `ProductCard`, `GalleryBlock`, `TestimonialBlock`, `EmailCaptureBlock`, `SocialIconRow`, `VerifiedBadge`, `BackgroundLayer`, `LivePreview`
- Add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- All new colors via tokens in `src/styles.css` (no hardcoded hex in components)
- Mobile-first: profile max-width 28rem, fluid type, safe-area padding
- Animations via existing `animate-fade-in`, `animate-scale-in`, plus a new `animate-gradient` keyframe

### Out of scope (call out for later)
- True drag-and-drop section nesting (we'll keep flat ordering)
- Custom domain per-profile routing (infra change, not a code change)
- Native video upload storage (we'll accept external URLs first; bucket can come later)

### Suggested execution order
1. Migration (Phase 2)
2. New public profile (Phase 1) using new schema with safe defaults
3. SEO meta (Phase 4)
4. Dashboard editor v2 (Phase 3) — biggest UI work
5. Analytics surfacing (Phase 5)

Want me to start with all phases in one go, or ship Phase 1+2 first and iterate?