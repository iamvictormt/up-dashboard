export function capitalizeFirst(text?: string): string {
  if (!text) return '';
  const s = String(text).trim();
  if (!s) return '';
  // usa locale pt-BR para acentuação correta
  const first = s.charAt(0).toLocaleUpperCase('pt-BR');
  const rest = s.slice(1).toLocaleLowerCase('pt-BR');
  return first + rest;
}
