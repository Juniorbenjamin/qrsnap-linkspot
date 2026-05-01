// Stable public base URL for QR codes.
// QR codes printed on flyers, business cards, signs, etc. must keep working
// after the project is renamed or the preview URL changes. Lovable provides
// stable per-project hostnames that always serve the latest deployment.
//
// Pattern (immutable, survives renames):
//   - Production: project--{project-id}.lovable.app
//   - Preview:    project--{project-id}-dev.lovable.app
//
// We hard-code the project ID so QR codes generated in the editor preview
// still resolve to the public site once the user clicks Publish.

export const PROJECT_ID = "c0acd155-84e1-495c-be73-91e23f2f9733";

export const PUBLIC_BASE_URL = `https://project--${PROJECT_ID}.lovable.app`;

export function publicProfileUrl(username: string): string {
  return `${PUBLIC_BASE_URL}/u/${encodeURIComponent(username)}`;
}
