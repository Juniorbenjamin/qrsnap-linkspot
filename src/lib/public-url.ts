// Public base URL for shareable LinkSpot profiles + QR codes.
//
// Priority:
//   1. The user's custom domain (the prettiest, shortest link they can share).
//   2. The stable Lovable project hostname (immutable, survives renames),
//      used as a fallback in preview/dev before the custom domain resolves.
//
// QR codes printed on flyers, business cards, signs, etc. must keep working
// after the project is renamed, so we never use the editor preview URL.

export const PROJECT_ID = "c0acd155-84e1-495c-be73-91e23f2f9733";

// The connected custom domain for this project. Update if the user
// connects a different domain (e.g. linkspot.site) in Lovable settings.
export const CUSTOM_DOMAIN = "qrcodegenerator.life";

export const PUBLIC_BASE_URL = `https://${CUSTOM_DOMAIN}`;
export const FALLBACK_BASE_URL = `https://project--${PROJECT_ID}.lovable.app`;

export function publicProfileUrl(username: string): string {
  return `${PUBLIC_BASE_URL}/u/${encodeURIComponent(username)}`;
}

// Short, human-readable label shown in the UI. Matches the actual URL
// (minus the https://) so what the user sees is what gets shared.
export function shortProfileLabel(username: string): string {
  return `${CUSTOM_DOMAIN}/u/${username}`;
}

// Domain-only prefix, useful for split rendering (gray prefix + bold name).
export const SHORT_DOMAIN_PREFIX = `${CUSTOM_DOMAIN}/u/`;
