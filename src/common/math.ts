export const PI = Math.PI;

export function getLength2(v: { x: number; y: number }): number {
  return v.x * v.x + v.y * v.y;
}

export function getLength(v: { x: number; y: number }): number {
  return Math.sqrt(getLength2(v));
}

export function getNormalized(v: { x: number; y: number }): { x: number; y: number } {
  const len = getLength(v);
  return { x: v.x / len, y: v.y / len };
}

export function getAngle(v: { x: number; y: number }): number {
  const a = Math.acos(v.x / getLength(v));
  return v.y > 0.0 ? a : -a;
}

export function dot(v1: { x: number; y: number }, v2: { x: number; y: number }): number {
  return v1.x * v2.x + v1.y * v2.y;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function toInt(v: number): number {
  return Math.floor(v);
}
