interface TsugumiMarkProps {
  size?: number;
}

/** ブランドマーク。藍の円に金の継ぎ線が 2 本走る（原本の SVG をそのまま使う）。 */
export const TsugumiMark = ({
  size = 40,
}: TsugumiMarkProps): React.JSX.Element => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="oklch(24% 0.045 258)" />
    <path
      d="M20 3 L14 18 L24 22 L17 37"
      stroke="oklch(74% 0.125 85)"
      strokeWidth="1.6"
      fill="none"
    />
    <path
      d="M3 22 L18 18 L20 27 L37 24"
      stroke="oklch(74% 0.125 85)"
      strokeWidth="1.6"
      fill="none"
    />
    <circle cx="14" cy="18" r="1.6" fill="oklch(74% 0.125 85)" />
    <circle cx="20" cy="27" r="1.6" fill="oklch(74% 0.125 85)" />
  </svg>
);
