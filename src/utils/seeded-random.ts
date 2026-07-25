/**
 * 文字列から決定論的な擬似乱数を作る。
 * Mock の AI 応答とプレビュー線の形を「同じ入力なら同じ結果」にするために使う。
 * 暗号用途では使わない。
 */
export const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export type RandomFn = () => number;

/** mulberry32。seed から 0〜1 の乱数を返す関数を作る。 */
export const createRandom = (seed: number): RandomFn => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const createRandomFromString = (seed: string): RandomFn =>
  createRandom(hashString(seed));

/** 0〜1 の乱数を [min, max] の整数へ写す。 */
export const randomInt = (
  random: RandomFn,
  min: number,
  max: number
): number => min + Math.floor(random() * (max - min + 1));

export const pickOne = <T>(random: RandomFn, items: readonly T[]): T =>
  items[Math.floor(random() * items.length)];
