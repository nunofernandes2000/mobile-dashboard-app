// Converte bytes para um formato legível (KB, MB, GB)
export function formatBytes(totalBytes, decimalPlaces = 2) {
  if (!totalBytes || totalBytes === 0) return '0 Bytes';
  const kilobyteUnit = 1024;
  const safeDecimalPlaces = decimalPlaces < 0 ? 0 : decimalPlaces;
  const sizeUnits = ['Bytes', 'KB', 'MB', 'GB'];
  const unitIndex = Math.floor(Math.log(totalBytes) / Math.log(kilobyteUnit));
  return parseFloat((totalBytes / Math.pow(kilobyteUnit, unitIndex)).toFixed(safeDecimalPlaces)) + ' ' + sizeUnits[unitIndex];
}

// Formata datas para o padrão português (DD/MM/AAAA às HH:MM)
export function formatDatePt(isoDateString) {
  if (!isoDateString) return '';
  try {
    const parsedDate = new Date(isoDateString);
    if (isNaN(parsedDate.getTime())) return String(isoDateString);
    return (
      parsedDate.toLocaleDateString('pt-PT') +
      ' às ' +
      parsedDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    );
  } catch {
    return String(isoDateString);
  }
}

