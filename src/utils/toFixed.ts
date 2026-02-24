export function toFixed(value: number) {
  return value.toFixed(2).replace(/[.,]00$/, "");
}
