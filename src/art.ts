/** Original explanatory pixel illustrations, not tokens from the collection. */
export const palettes = ['#83b26b', '#76aabc', '#d6b74f', '#b7a0cb'];
export const skinNames = ['Fern', 'Lagoon', 'Golden', 'Lilac'];
export function frog(seed = 0, mystery = false): string {
  const skin = mystery ? '#789181' : palettes[seed % 4];
  const ink = '#253b32';
  const rect = (x: number, y: number, w: number, h: number, c: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  let p = rect(7, 26, 18, 6, ink) + rect(8, 26, 16, 6, mystery ? '#597267' : '#637d93');
  p += rect(6, 12, 20, 13, ink) + rect(4, 16, 24, 7, ink) + rect(7, 10, 8, 5, ink) + rect(17, 10, 8, 5, ink);
  p += rect(7, 13, 18, 12, skin) + rect(5, 17, 22, 5, skin) + rect(8, 11, 6, 6, skin) + rect(18, 11, 6, 6, skin);
  p += rect(8, 13, 6, 4, '#eeeeda') + rect(18, 13, 6, 4, '#eeeeda') + rect(11, 14, 2, 3, ink) + rect(21, 14, 2, 3, ink);
  p += rect(8, 20, 16, 1, ink) + rect(10, 22, 13, 1, ink) + rect(7, 19, 2, 1, ink);
  if (!mystery && seed % 3 === 1) p += rect(6, 12, 20, 1, ink) + rect(8, 13, 7, 4, ink) + rect(17, 13, 7, 4, ink) + rect(9, 13, 2, 1, '#eeeeda') + rect(18, 13, 2, 1, '#eeeeda');
  if (!mystery && seed % 3 === 2) p += rect(9, 7, 14, 4, ink) + rect(6, 10, 21, 2, ink) + rect(10, 9, 12, 1, '#c88b68');
  if (mystery) p = `<g opacity=".25">${p}</g><text x="16" y="23" text-anchor="middle" fill="#f7f5e9" font-family="Georgia,serif" font-size="18">?</text>`;
  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">${p}</svg>`;
}
