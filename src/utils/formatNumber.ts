export function formatNumber(num: any, decimals: number = 2) {
  // Handle non-numeric input
  if (isNaN(num)) return "0";

  try {
    // Fixed decimal places
    let fixed = Number(num).toFixed(decimals);
    fixed = String(Number(fixed));
    // Split integer and decimal parts
    const parts = fixed.split(".");

    // Handle integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine results
    return parts.join(".");
  } catch (error) {
    return "0";
  }
}

export function isNumber(str) {
  return Number.isFinite(Number(str));
}
