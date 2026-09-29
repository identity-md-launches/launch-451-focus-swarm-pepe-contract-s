# Swarm Pepe Field Guide

A small public, read-only guide to Ethereum contract **0x999ce0ce8c5f7661e0c74a568ffe27ceb9177bdb**. It explains the owner-managed allowance, free claim versus gas, delayed blockhash reveal and embedded on-chain artwork. Contract facts have source links; the creator’s selection and bot statements are labeled separately.

The interactive lab compares known-hash previews with committing before a future hash exists. It uses invented tokens, local randomness, a toy mixing function and illustrative artwork. It cannot predict real traits. There is no wallet connection, signature, token approval, mint button, RPC client or backend.

## Install and develop

Use Node **22.12+** and npm. The stack is Vite 7.3.1 and strict TypeScript 5.9.3 with semantic HTML and CSS. Vanilla TypeScript keeps this single-page guide small and leaves its explanatory content readable without JavaScript.

```sh
npm ci
npm run dev
```

The dev command prints the local URL. `package-lock.json` pins dependencies. Never submit `node_modules`, package caches or vendored dependency archives; the ignore rules apply at every nesting level.

During this assignment, repository `node_modules/` was prohibited. Tooling was installed outside the repository in `/tmp/swarm-pepe-toolchain` using an npm cache in `/tmp/swarm-pepe-npm-cache`. The lockfile was generated using `npm install --package-lock-only`. Normal development uses `npm ci` as above.

## Check, rebuild and preview

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Preview serves the production `dist/` export, normally on the URL printed by Vite. A dependency-free alternative after building is `python3 -m http.server 8080 --directory dist`, then open `http://localhost:8080/`. Use an HTTP server instead of double-clicking the HTML file: browsers restrict local JavaScript modules.

The seven maintained tests check the simulation’s actual invariants: input locking, entropy timing, reveal timing, immutable results and independent resets. The runner transpiles into an OS temporary directory and cleans it, so it also works with Node builds lacking TypeScript stripping. Type checking is a separate command.

`dist/index.html`, both hashed CSS/JavaScript files, favicon and token image are included as the finished export alongside source and lockfile. Rebuild after source changes and include the updated **entire** dist directory in the submission. Vite removes stale assets during a build. `base: './'` makes all runtime asset URLs relative, including for gateway subpaths and ENS/IPFS hosting. The page uses fragment navigation only.

## Publish the public page

Publish the **contents of `dist/`** to the static host’s public directory, preserving `assets/` and the two SVG files. Set `index.html` as the default document. No environment variables, build service, application server, wallet setup or route rewrites are needed. HTTPS is recommended. The assignment publisher should serve the provided export without rebuilding it.

For IPFS, add the complete dist folder and serve the resulting directory CID; verify its `index.html` at the chosen gateway before assigning an ENS content hash. For any host, check the reveal flow and reload at `#reveal` after publishing. Never publish the repository root as the site root.

This workspace has no public-host credentials or assigned public URL. The production export was served and checked locally at `/preview/`; remote publication is the submission publisher’s step. No public deployment is claimed here.

## Actual validation

On 29 September 2026, the final source passed:

- `npm run typecheck` — exit 0.
- `npm run build` — exit 0, all runtime files emitted with relative URLs.
- `npm test` — 7 passed, 0 failed.
- Chromium production-export interaction checks — navigation, example selection, commitment, block advancement, reveal, repeated reveal, reset and both disclosures passed. Keyboard flow passed; the instrumented wallet API received **zero calls**. No site external requests or JavaScript errors were observed.
- Layout checks — no horizontal overflow at 320, 390, 768, 900 and 1440 CSS pixels; screenshots inspected at 320, 900 and 1440. The real token image loaded locally.
- Axe 4.11.1 WCAG A/AA scan — zero detected violations, 28 passing rules; contrast manual-review items remain documented. Reduced motion and forced colors were exercised. JavaScript-disabled reading/navigation passed.

The exact command environment, repairs, six-domain Better Interface review, measured contrast, screenshots and limitations are in [artifacts/validation.md](artifacts/validation.md). These are worker-run results, not independent certification. Native screen-reader sessions, physical devices, Safari/Firefox, native browser zoom and a remote published URL were not checked. The simulation is not a security audit or proof of unbiased blockchain randomness.

## Files and evidence

- [DESIGN.md](DESIGN.md): implemented tokens, typography, components and responsive behavior.
- `index.html`, `src/`: complete source; `public/`: locally bundled static assets.
- [Contract research](artifacts/contract-research.md): exact functions, caveats and source provenance; `artifacts/sources/` contains small verified-source extracts.
- [Artwork provenance](artifacts/swarm-pepe-1-provenance.json): captured token #1 render, dated 29 September 2026, using a read-only latest-block call. No precise block pin or live-status claim.
- [Path budget](artifacts/path-budget.md): explicit `.gitignore` budget and submission allocations under the 8 MiB limit.
- [Attribution](artifacts/ATTRIBUTION.md): Better Interface and Impeccable guidance credits and licenses.
