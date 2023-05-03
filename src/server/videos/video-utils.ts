import { SUPPORTED_ASPECT_RATIOS } from "./videos.constants";

function gcd(a: number, b: number) {
  if (!b) return a;
  return gcd(b, a % b);
}

export function getAspectRatio(width: number, height: number): string {
  const r = gcd(width, height);
  const x = Math.trunc(width / r);
  const y = Math.trunc(height / r);
  const ratio = `${x}:${y}`;
  const isCommonRatio = SUPPORTED_ASPECT_RATIOS.includes(ratio);
  return isCommonRatio ? ratio : "custom";
}
