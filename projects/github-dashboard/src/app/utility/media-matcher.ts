export function isMobile(): boolean {
  return window.matchMedia('(max-width: 700px)').matches;
}
