// Small helper kept outside any component body — calling Date.now()/new
// Date() directly inside a Server Component's render trips the
// react-hooks/purity ESLint rule (it can't tell a Server Component's
// per-request freshness is intentional, not a render-purity bug).
export function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}
