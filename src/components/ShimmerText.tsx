import type { ReactNode } from 'react';
import './ShimmerText.css';

type ShimmerTextProps = {
  children: ReactNode;
  className?: string;
  /** The colour that travels through the text. Defaults to a light sweep. */
  contrast?: string;
};

/**
 * A highlight that sweeps through text.
 *
 * The text itself is painted by a gradient rather than a fill: the glyphs are
 * transparent and a `currentColor → contrast → currentColor` gradient is
 * clipped to them, then its horizontal position is animated (in CSS — see
 * ShimmerText.css for the timing). So the element takes its base colour from
 * `color` — set that on the parent and the shimmer follows it.
 */
export default function ShimmerText({
  children,
  className = '',
  contrast = 'rgba(255, 255, 255, 0.82)',
}: ShimmerTextProps) {
  return (
    <span
      className={`shimmer ${className}`.trim()}
      style={{ '--shimmer-contrast': contrast } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
