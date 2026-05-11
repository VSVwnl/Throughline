const CM_PER_IN = 2.54;
const LB_PER_KG = 2.2046226218;

export const HEIGHT_IN_MIN = Math.round(140 / CM_PER_IN);
export const HEIGHT_IN_MAX = Math.round(220 / CM_PER_IN);
export const HEIGHT_IN_DEFAULT = Math.round(178 / CM_PER_IN);

export const WEIGHT_LB_MIN = Math.round(40 * LB_PER_KG);
export const WEIGHT_LB_MAX = Math.round(160 * LB_PER_KG);
export const WEIGHT_LB_DEFAULT = Math.round(75 * LB_PER_KG);

export function inchesToCm(inches: number): number {
  return Math.round(inches * CM_PER_IN);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / LB_PER_KG);
}

export function cmToInches(cm: number): number {
  return Math.round(cm / CM_PER_IN);
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * LB_PER_KG);
}

export function formatHeightImperial(totalInches: number): string {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches}"`;
}

export function formatHeightImperialFromCm(cm: number): string {
  return formatHeightImperial(cmToInches(cm));
}

export function formatWeightImperial(lbs: number): string {
  return `${lbs} lb`;
}

export function formatWeightImperialFromKg(kg: number): string {
  return formatWeightImperial(kgToLbs(kg));
}
