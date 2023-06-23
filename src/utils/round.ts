// ex: round(12.2569456, 3) -> 12.256
export function round(number: number, places: number) {
  const d = Math.pow(10, places);
  return Math.round((number + Number.EPSILON) * d) / d;
}
