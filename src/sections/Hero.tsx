import { hero } from '../content/content';
import { media } from '../config/site';
import ShimmerText from '../components/ShimmerText';
import './Hero.css';

/**
 * Full-bleed dark hero. The image fills the viewport; the headline holds the
 * left grid line and the positioning line and action sit as one block on
 * the right, level with the lower half of the headline.
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
        {/* Four set lines, one word to a line, so the break never depends on
            the viewport. The orange pair stays inside one ShimmerText so the
            sweep crosses both lines as one. */}
        <h1 className="hero__headline">
          {hero.headline.line1.split(' ').map((word) => (
            <span key={word} className="hero__line">
              {word}
            </span>
          ))}
          <ShimmerText className="hero__headline-accent">
            {hero.headline.line2.split(' ').map((word) => (
              <span key={word} className="hero__line">
                {word}
              </span>
            ))}
          </ShimmerText>
        </h1>

        <div className="hero__aside">
          <p className="hero__positioning">{hero.positioning}</p>

          <a href={hero.cta.href} className="btn btn--on-dark hero__cta">
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
