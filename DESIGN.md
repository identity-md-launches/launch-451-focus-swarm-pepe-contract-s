# Swarm Pepe Field Guide design

## Overview

A public, read-only introduction to Swarm Pepe for someone encountering their first NFT. The implemented design uses a warm paper background, dark green ink, serif headings and small monospaced annotations. Four numbered sections move from claim rules to the reveal experiment, on-chain art and evidence. The simulation is the main action; source links remain close to the claims they support.

Source of truth: `src/style.css`, semantic page structure in `index.html`, simulation presentation in `src/main.ts`, original illustrative SVGs in `src/art.ts`. No component framework or external runtime assets are required.

## Colors

All UI tokens are in `src/style.css:1`. Hex sRGB is the canonical format. There is one light theme; a separate dark theme is not implemented.

| Semantic token | Resolved value | Use |
| --- | --- | --- |
| `--color-page` | `#f7f5eb` | Page paper |
| `--color-surface` | `#fffdf5` | Lab and specimen cards |
| `--color-soft` | `#eeeee1` | Lab section, notes, diagrams |
| `--color-text` | `#20372c` | Main text |
| `--color-muted` | `#53695c` | Supporting copy |
| `--color-border` | `#d5dacb` | Structural dividers, panel boundaries |
| `--color-control-border` | `#809685` | Radio borders and outline details |
| `--color-accent` | `#294d3c` | Primary actions and hidden-art surface |
| `--color-on-accent` | `#fffdf5` | Filled button labels |
| `--color-highlight` | `#dce8ba` | Selected example, current step, selection |
| `--color-creator-bg` / `--color-creator-text` | `#f0e6d4` / `#745135` | Creator statements |
| `--color-focus` | `#805120` | Keyboard outline |
| `--color-art-bg` / `--color-art-back` | `#d9e0b2` / `#d8dce6` | Illustrative art grounds |

Semantic tokens reference the cream, forest, lime and orange primitives. The future comparison panel additionally uses the local surface `#f0f3e7`. Art-only colors are intentionally contained in `src/art.ts` or the captured SVG; they do not encode UI status. Creator/code distinctions also have text labels. Measured foreground/background pairs are recorded in `artifacts/validation.md`.

## Typography

- Body: `'Segoe UI', Arial, sans-serif`, regular text with 600 emphasis; base 16px, line-height 1.6. Hero description is 18px/1.7 on wide screens, 16px on smaller screens. Detailed explanatory paragraphs are 14–15px; captions and source labels are 12px or 13px. There are no downloaded fonts.
- Display: `Georgia, 'Times New Roman', serif`, weight 400; the hero’s final word is italic. H1 uses `clamp(3.5rem, 6.1vw, 5.5rem)` / 1.06; at 48rem and below it uses `clamp(3.25rem, 10vw, 4.75rem)`. H2 uses `clamp(2.35rem, 3.8vw, 3.375rem)` / 1.13. Both use `-.045em` tracking and balanced wrapping.
- H3: body family, 22px/1.35, weight 600; comparison titles 15px, explanatory subheads 18px. This preserves descending visual heading hierarchy.
- Annotation and numbers: `'Courier New', monospace`. Eyebrows are 12px, weight 700, uppercase through CSS, `.1em` tracking. `.mono` applies tabular numerals. Code uses `.9em` and can break long values.
- Text measures: paragraphs capped at 70ch, hero introduction at 44ch, simulation caveat at 100ch. Prose uses `text-wrap: pretty`; the full contract address wraps instead of truncating.

System font rendering depends on the viewer’s installed fonts. `font-synthesis: none` is set globally; Chromium screenshots confirmed clear bold/italic distinction in this environment, not identical faces on every OS.

## Layout

`.wrap` is a 1,200px border-box container with 32px inline padding. Spacing tokens are 8, 12, 16, 24, 32, 48 and 80px. Major sections use 80px vertical space, collapsing to 56px on small screens. Component internals also use local 18, 20 and 26px values, visible in the lab selectors.

Desktop: two-column hero, three claim steps, paired simulation panels and a two-column art section. The block timeline stays three columns to preserve sequence. Article reading order is semantic HTML; the art copy moves above its illustration on mobile.

Implemented breakpoints:

- **65rem / 1,040px:** hide the optional read-only header badge, shrink specimen art, wrap the contract strip, put comparison badges below their headings, tighten grids.
- **48rem / 768px:** 24px page gutters; header navigation gets its own row; hero, claim steps, comparison and supporting notes stack; main simulation action becomes full-width. Art copy appears before its picture. Source categories get a separate line.
- **23rem / 368px:** 18px page gutters; brand icon hides, specimens shrink again, preview art drops to 65px and trait type to 19.2px.

DOM overflow checks passed at 320, 390, 768, 900 and 1,440px. Screenshots were inspected at 320, 900 and 1,440px. Doubling root text size to 32px at 1,440px produced no horizontal overflow; this is not native browser zoom verification.

## Elevation & Depth

The interface is mostly flat. Pale section backgrounds and 1px dividers communicate grouping. The tilted hero specimen cards alone use `0 8px 18px #20372c12` shadows; the front card uses z-index 2. The skip link uses z-index 10. There is no sticky header or overlay. A faint 27px graph grid sits behind decorative hero art.

## Shapes

Control radius is 5px; the lab panel is 10px; comparison cards 6px; radio labels 4px. Step numbers and the brand symbol are circles. The read-only badge is a pill. Pixel illustrations use crisp rectangle edges. The full contract image remains square and uses `image-rendering: pixelated`. Its caption links to Etherscan’s token-specific `/nft/<contract>/1` page.

## Components

These are HTML/CSS patterns, not an exported component library.

- **Navigation / source links:** native anchors in `index.html`; `.source-link` is underlined with a descriptive contract/function label. Main navigation uses fragment URLs, with no router or server rewrite.
- **Primary action:** `.button.primary`; minimum 50px tall, green fill, visible hover and focus. Anchor variant moves to the lab; `#advance` advances the simulation. No claim/mint transaction control exists.
- **Example selector:** native fieldset, legend and labeled radios. Custom visual labels retain native arrow-key behavior. Selected state has both a thicker border and green fill. Committed inputs become disabled with dashed outlines and adjacent explanatory text.
- **Simulation:** `src/simulation.ts` owns `choose → committed → target → ready → revealed`. Entropy is created at the target phase, after commitment. `src/main.ts` updates persistent DOM nodes, current-step text, artwork and a stable polite status region. `#reset` starts a separate experiment. Repeating reveal keeps the stored result. This is explicitly a toy model, with invented examples and no network interaction.
- **Pixel preview:** `frog(seed, mystery)` in `src/art.ts`. SVGs are decorative; nearby text conveys the result. These drawings are separate from the real locally bundled token #1 capture in `public/swarm-pepe-1.svg`.
- **Disclosure:** native `details/summary`, minimum 56px summary height. The plus rotates when open; the explanatory content and source links remain in normal flow.
- **Creator note / source row:** `.creator-note`, `.source-list`, `.source-tag`. Warm brown labels identify creator assertions separately from verified source code.
- **Focus and motion:** 3px outline, 4px offset; radios outline their visible label. Forced-colors mode uses `Highlight`. Button-only 150ms color/scale transitions and `.96` press scale occur only with `prefers-reduced-motion: no-preference`. No autoplay or entrance animations.
- **Unavailable JavaScript:** static guide and disclosures still work; a visible noscript explanation replaces the hidden lab. No remote loading, wallet, signature, transaction or token-approval states exist.

## Do’s and Don’ts

Use `.wrap`, the existing spacing scale and semantic tokens. Keep an evidence link beside new contract assertions and explicitly label creator claims. Preserve one primary action per interaction area. Keep full values copyable and use native controls.

Do not reuse a simulation drawing as authenticated collection art. Do not label creator automation as a contract guarantee. Keep wallet infrastructure, analytics, external fonts and mint controls out of this guide.

To add a related page, reuse the header/footer and `.section` / `.section-heading` patterns, introduce only the necessary static content, and link it with a relative HTML URL. Recheck subpath assets, small-screen layout, keyboard order and source attribution.

Design-method attribution and licenses: `artifacts/ATTRIBUTION.md` and `artifacts/design-guidance-LICENSE.txt`.
