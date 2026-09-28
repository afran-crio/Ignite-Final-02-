/**
 * Every client mark gets a similar visual weight: the height falls as the
 * logo gets wider, but more gently than an equal-area rule would (which
 * leaves long wordmarks thin). The width follows from the ratio. Units are
 * `--spacing` (px at a 16px root).
 */
export const logoHeight = (ratio: number, scale: number) =>
  58 * Math.pow(ratio, -0.3) * scale;
