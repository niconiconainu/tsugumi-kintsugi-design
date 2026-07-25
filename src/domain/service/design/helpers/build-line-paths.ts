import type { LineStyle } from "@/constants/design/taste";
import { createRandomFromString, type RandomFn } from "@/utils/seeded-random";

/**
 * 継ぎ線プレビュー用の SVG パスを組み立てる（viewBox = 0 0 100 100）。
 *
 * 画像生成モデルは使わず、破損の本数と線のスタイルからコードで描く
 * （設計書 11「画像編集の品質」の代替案 = 線の SVG オーバーレイ）。
 */
interface Point {
  x: number;
  y: number;
}

/** 器の見立て。中心と、線の端点を置く半径。 */
const CENTER: Point = { x: 50, y: 50 };
const RIM_RADIUS = 36;

/**
 * スタイルごとの線の性格。
 * `spread` は始点と終点の開き角（rad）。大きくしすぎると中心を貫く直径になり、
 * 継ぎ目ではなく放射状の星に見えてしまうので 1.6rad（約 90°）までに抑える。
 */
const LINE_SHAPE: Record<
  LineStyle,
  { spread: number; bow: number; jitter: number; branches: number }
> = {
  quiet: { spread: 0.7, bow: 5, jitter: 1.1, branches: 0 },
  flowing: { spread: 1.3, bow: 10, jitter: 1.8, branches: 1 },
  branching: { spread: 1.0, bow: 7, jitter: 2.0, branches: 3 },
  dramatic: { spread: 1.6, bow: 13, jitter: 2.6, branches: 2 },
};

const format = (value: number): string => value.toFixed(1);

const polar = (angle: number, radius: number): Point => ({
  x: CENTER.x + Math.cos(angle) * radius,
  y: CENTER.y + Math.sin(angle) * radius,
});

/** 点列を滑らかな path 文字列へ。 */
const toSmoothPath = (points: Point[]): string => {
  if (points.length < 2) return "";
  let d = `M ${format(points[0].x)} ${format(points[0].y)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mid = {
      x: (points[i].x + points[i + 1].x) / 2,
      y: (points[i].y + points[i + 1].y) / 2,
    };
    d += ` Q ${format(points[i].x)} ${format(points[i].y)} ${format(mid.x)} ${format(mid.y)}`;
  }
  const last = points[points.length - 1];
  return `${d} T ${format(last.x)} ${format(last.y)}`;
};

/** 始点から終点へ、中心側へ弓なりに反らせながら点を打つ。 */
const buildCurve = (
  from: Point,
  to: Point,
  options: { bow: number; jitter: number; steps: number; random: RandomFn }
): Point[] => {
  const points: Point[] = [];
  for (let step = 0; step <= options.steps; step++) {
    const t = step / options.steps;
    const base = {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
    // 中心へ向かうベクトル。両端では 0、中央で最大にたわませる。
    const towardCenter = Math.sin(Math.PI * t) * options.bow;
    const dx = CENTER.x - base.x;
    const dy = CENTER.y - base.y;
    const length = Math.hypot(dx, dy) || 1;
    const wobble = step === 0 || step === options.steps ? 0 : options.jitter;
    points.push({
      x:
        base.x + (dx / length) * towardCenter + (options.random() - 0.5) * wobble,
      y:
        base.y + (dy / length) * towardCenter + (options.random() - 0.5) * wobble,
    });
  }
  return points;
};

/**
 * デザイン案 1 件ぶんの継ぎ線を作る。
 * `seed` が同じなら常に同じ形になる（案を切り替えても線が跳ねない）。
 */
export const buildLinePaths = (params: {
  lineStyle: LineStyle;
  crackCount: number;
  seed: string;
}): string[] => {
  const random = createRandomFromString(params.seed);
  const shape = LINE_SHAPE[params.lineStyle];
  const paths: string[] = [];

  // 主線。ひびが複数あるときは本数を増やす（上限 3 本）。
  const mainLineCount = Math.min(3, Math.max(1, params.crackCount));
  const baseAngle = random() * Math.PI * 2;
  // 主線どうしが同じ場所に集まらないよう、円周を等分して割り当てる。
  const angleStep = (Math.PI * 2) / mainLineCount;

  for (let index = 0; index < mainLineCount; index++) {
    const startAngle =
      baseAngle + angleStep * index + (random() - 0.5) * angleStep * 0.4;
    const direction = random() > 0.5 ? 1 : -1;
    const endAngle =
      startAngle + shape.spread * direction * (0.8 + random() * 0.4);
    const from = polar(startAngle, RIM_RADIUS);
    const to = polar(endAngle, RIM_RADIUS);
    const curve = buildCurve(from, to, {
      bow: shape.bow * (0.7 + random() * 0.6),
      jitter: shape.jitter,
      steps: 6,
      random,
    });
    paths.push(toSmoothPath(curve));

    // 枝は主線の途中から、外側へ向けて短く伸ばす（内側へ向けると中心で交差してしまう）。
    if (index === 0) {
      for (let branch = 0; branch < shape.branches; branch++) {
        const anchor = curve[2 + branch] ?? curve[1];
        const outward = Math.atan2(anchor.y - CENTER.y, anchor.x - CENTER.x);
        const branchAngle = outward + (random() - 0.5) * 1.6;
        const branchLength = 6 + random() * 8;
        const tip = {
          x: anchor.x + Math.cos(branchAngle) * branchLength,
          y: anchor.y + Math.sin(branchAngle) * branchLength,
        };
        paths.push(
          toSmoothPath(
            buildCurve(anchor, tip, {
              bow: 2,
              jitter: shape.jitter * 0.5,
              steps: 3,
              random,
            })
          )
        );
      }
    }
  }

  return paths;
};
