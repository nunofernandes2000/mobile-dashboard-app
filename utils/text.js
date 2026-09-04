// Normaliza texto para facilitar pesquisas
export function normalizeStr(inputString) {
  if (!inputString) return '';
  return inputString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Limpa e formata texto de anúncios e pautas de notas
export function cleanFormattedText(rawText) {
  if (!rawText) return '';
  const text = String(rawText)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, '\n')
    .replace(/<td[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/(\d+(?:[.,]\d+)?)\s*([A-ZÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÇ][a-záéíóúàèìòùãõâêîôûç])/g, '$1\n$2')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}
