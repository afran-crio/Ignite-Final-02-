import { hero } from '../content/content';
import { media } from '../config/site';
import ShimmerText from '../components/ShimmerText';
import './Hero.css';

/**
 * Full-bleed dark hero. The image fills the viewport; the headline — two
 * lines, set a step down so the brand in the nav carries more of the frame
 * (client feedback, Sep 2026) — holds the left grid line, with the
 * positioning line and the action beneath it on the same edge.
 */
export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__media">
        <picture>
          <source type="image/avif" srcSet={media.hero.posterAvifSrcSet} sizes={media.hero.posterSizes} />
          <img
            src={media.hero.poster ?? undefined}
            srcSet={media.hero.posterSrcSet}
            sizes={media.hero.posterSizes}
            alt={media.hero.alt}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero__scrim" aria-hidden="true" />
      </div>

      <div className="hero__content wrap">
        {/* Two lines, one statement to a line; on narrow screens each
            wraps within itself. The second is set in a softer white, and is
            a ShimmerText so a light sweep crosses it. */}
        <h1 className="hero__headline">
          <span className="hero__line">{hero.headline.line1}</span>{' '}
          <ShimmerText className="hero__line hero__headline-accent">{hero.headline.line2}</ShimmerText>
        </h1>

        <div className="hero__aside">
          <p className="hero__positioning">{hero.positioning}</p>

          <a href={hero.cta.href} className="btn btn--accent hero__cta">
            {hero.cta.label}
          </a>
        </div>
      </div>

      <div className="hero__scroll mono mono--on-dark" aria-hidden="true">
        Scroll
      </div>
    </section>
  );
}
