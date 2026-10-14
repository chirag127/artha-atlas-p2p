/**
 * URL and Path Helper for GitHub Pages Base Path Compatibility
 */

export function getBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function formatUrl(path: string): string {
  const base = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === '/') {
    return `${base}/` || '/';
  }
  const clean = `${base}${normalizedPath}`;
  return clean.endsWith('/') ? clean : `${clean}/`;
}
