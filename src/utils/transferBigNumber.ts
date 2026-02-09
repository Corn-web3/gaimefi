import { round } from "lodash";

export function transferBigNumber(num: number, digits: number = 1): string {
  const units = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
    { value: 1, symbol: "" },
  ];

  const unit = units.find((unit) => Math.abs(num) >= unit.value);
  if (!unit) return "0";

  return round(num / unit.value, digits) + unit.symbol;
}
