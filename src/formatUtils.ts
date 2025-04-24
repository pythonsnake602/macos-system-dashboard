/**
 * Format bytes to a human-readable format
 * @param bytes - The number of bytes to format
 * @param decimals - The number of decimal places to show
 * @returns A formatted string representation of the bytes
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (isNaN(bytes) || !isFinite(bytes)) return 'N/A';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format frequency to a human-readable format
 * @param hz - The frequency in hertz
 * @returns A formatted string representation of the frequency
 */
export const formatFrequency = (hz: number) => {
  if (isNaN(hz) || !isFinite(hz)) return 'N/A';
  if (hz === 0) return '0 Hz';
  if (hz < 1e6) return `${(hz / 1e3).toFixed(2)} kHz`;
  if (hz < 1e9) return `${(hz / 1e6).toFixed(2)} MHz`;
  return `${(hz / 1e9).toFixed(2)} GHz`;
};

/**
 * Format a ratio as a percentage
 * @param ratio - The ratio to format (0-1)
 * @returns A formatted percentage string
 */
export const formatPercentage = (ratio: number) => {
  if (isNaN(ratio) || !isFinite(ratio)) return 'N/A';
  return `${(ratio * 100).toFixed(2)}%`;
};
