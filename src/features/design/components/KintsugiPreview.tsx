"use client";

import { useId } from "react";
import {
  METAL_COLOR_HEX,
  type LineStyle,
  type MetalColor,
} from "@/constants/design/expression";
import { cn } from "@/features/common/utils/cn";

interface KintsugiPreviewProps {
  imageDataUrl: string | null;
  linePaths: string[];
  lineStyle: LineStyle;
  metalColor: MetalColor;
  className?: string;
  /** 線が引かれていく演出を出すか */
  animate?: boolean;
}

/** 線の太さ（viewBox 100 に対する比）。 */
const STROKE_WIDTH: Record<LineStyle, number> = {
  quiet: 0.9,
  flowing: 1.25,
  branching: 1.1,
  dramatic: 2,
};

/**
 * 写真の上に継ぎ線を重ねた簡易プレビュー（設計書 9.1 の P1）。
 * 生成画像ではなく、コードで作った SVG パスを重ねている。
 */
export const KintsugiPreview = ({
  imageDataUrl,
  linePaths,
  lineStyle,
  metalColor,
  className,
  animate = false,
}: KintsugiPreviewProps): React.JSX.Element => {
  const id = useId();
  const gradientId = `kintsugi-metal-${id}`;
  const glowId = `kintsugi-glow-${id}`;
  const base = METAL_COLOR_HEX[metalColor];
  const width = STROKE_WIDTH[lineStyle];

  return (
    <div
      className={cn(
        "bg-night relative overflow-hidden",
        className ?? "aspect-square"
      )}
    >
      {imageDataUrl ? (
        // ユーザーがアップロードした画像なので next/image の最適化は使わない。
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageDataUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="bg-hatch-night h-full w-full" />
      )}

      {/* 金線を浮かせるための軽い焼き込み。 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,transparent_0%,oklch(20%_0.03_258/0.5)_100%)]" />

      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={base} stopOpacity="0.75" />
            <stop offset="45%" stopColor="#f3e0b0" />
            <stop offset="100%" stopColor={base} />
          </linearGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 割れ目そのものの影 */}
        {linePaths.map((d, index) => (
          <path
            key={`shadow-${index}`}
            d={d}
            fill="none"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={width + 0.7}
            strokeLinecap="round"
          />
        ))}

        {/* 継ぎの金属 */}
        <g filter={`url(#${glowId})`}>
          {linePaths.map((d, index) => (
            <path
              key={`metal-${index}`}
              d={d}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={width}
              strokeLinecap="round"
              className={animate ? "animate-draw" : undefined}
              style={
                animate ? { animationDelay: `${index * 180}ms` } : undefined
              }
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
