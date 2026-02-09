// Calculate days
export function calculateDays(from: number, to: number): string {
  const diffMs = to - from;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // CoinGecko supported days parameter values: 1, 7, 14, 30, 90, 180, 365, max
  if (diffDays <= 1) return "1";
  if (diffDays <= 7) return "7";
  if (diffDays <= 14) return "14";
  if (diffDays <= 30) return "30";
  if (diffDays <= 90) return "90";
  if (diffDays <= 180) return "180";
  if (diffDays <= 365) return "365";
  return "max";
}
