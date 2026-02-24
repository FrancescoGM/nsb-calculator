export function toFixed(value: number): string {
  const rounded = Math.round(value * 100) / 100;

  const fractional = rounded - Math.floor(rounded);
  if (fractional > 0 && fractional < 0.1) {
    return Math.round(rounded).toString();
  }

  return rounded.toFixed(2).replace(/\.?0+$/, "");
}
