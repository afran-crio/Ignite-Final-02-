# Transaction tile artwork — sourcing brief

One image per transaction, in the order they appear in `src/content/content.ts`
under `works.transactions`. Each entry there carries a `segment` naming its
sector.

## Technical

**Portrait, not landscape.** The tile is taller than it is wide at every
breakpoint — measured 374x440 at 1440, 498x523 at 1920, 293x333 on mobile, so a
ratio of 0.85–0.95. Landscape stock will have its sides cropped away and the
subject squeezed out. Supply **3:4 portrait, or square at a push.**

| | |
| --- | --- |
| Aspect | 3:4 portrait (square acceptable) |
| Minimum | 1600 x 2000 px — the largest the tile needs is 996 x 1046 @2x |
| Format | JPEG, sRGB |
| Filenames | `01-cross-border.jpg` … `07-automotive.jpg`, exactly as below |

## Art direction

The number sits large and centred over the image, the description at the foot,
and a dark scrim runs top-to-bottom behind them. So:

- **Keep the middle calm.** A busy or high-contrast centre fights the figure.
  Detail in the upper third, quiet in the middle.
- **One clear subject.** These render around 374px wide — anything intricate
  disappears.
- **Shoot or select the set as one commission.** Similar time of day and
  similar grade across all seven; a mix of bright saturated stock and muted
  documentary will look assembled rather than art-directed.
- **Cool or neutral grades sit best** — the scrim is neutral dark and the
  figure is brand orange, so warm-orange images will muddy against it.

## Two cautions

- **No identifiable facilities, logos or branding.** These sit beside real
  transaction records; a recognisable plant or a visible company mark implies
  that business was the client. Keep them generic.
- **Commercial licence required.** Unsplash and Pexels are fine and need no
  attribution. Getty, Adobe Stock and Shutterstock need a purchased licence.
  Record whatever is used in `media-source/CREDITS.md`, as the existing
  editorial imagery is.

## What each one should show

| File | Transaction | Segment | Subject |
| --- | --- | --- | --- |
| `01-cross-border.jpg` | $365m — leveraged acquisition across seven jurisdictions | Cross-border acquisition | Container port or terminal at dawn; scale and reach. Avoid flags and world maps. |
| `02-renewable.jpg` | $100m+ — hybrid renewable project, Gujarat | Renewable energy | Wind turbines with solar array, arid landscape and wide sky. Gujarat-like if possible. |
| `03-food.jpg` | $80m — mid-sized food processing expansion | Food processing | Clean production line, stainless steel, cold storage. Processing plant, not raw produce. |
| `04-logistics.jpg` | $250m — AAA-rated InvIT, successive phases | Infrastructure & logistics | Warehouse racking interior, or a logistics park / highway from above. |
| `05-equipment.jpg` | $200m+ — ECA-backed capital equipment imports | Capital equipment | Industrial machinery being installed or craned into place; reads as imported plant. |
| `06-healthcare.jpg` | $50m+ — pre-IPO recapitalisation, healthcare platform | Healthcare | Modern hospital exterior or a clean clinical corridor. No patients or faces. |
| `07-automotive.jpg` | $100m — IFC sustainability-linked, automotive manufacturing | Automotive manufacturing | Robotic welding or press line in a bright modern plant. |

## Handing them over

Drop the files in this folder, then set `image` on the matching transaction:

```ts
image: '/media/works/02-renewable.jpg' as string | null,
```

The tile switches to its dark photographic treatment on its own — scrim, white
type — so nothing else needs changing. Partial sets are fine: any transaction
still on `image: null` keeps the tinted ground.
