# Dojo Deckbuilder

The official interactive companion and Quick Duel field test for **Dojo Deckbuilder**.

## Live site

<https://nullableninja.github.io/dojo-deckbuilder-2a/>

## Fight Night in 2a

Choose either fighter from the 41-character roster, select rival difficulty, and start a Quick Duel from the bout card. Instant rematch keeps the same fighters.

The Deck Notebook groups your collection, discard pile, and equipped cards without revealing draw order. Open it from the utility bar or the Deck and Discard counters, then select a card to inspect its full rules.

Finished bouts build a device-local record of the last 30 results, including wins, consecutive wins, rounds, damage, purchases, and final belt. Reloading a result does not count it twice. Clearing browser storage removes that record.

Browser saves, settings, theme, profile, and binder use a dedicated `ddb-2a-` namespace. The first visit to this release starts an independent save; legacy entries belonging to other versions are retained and are not imported automatically.

## Source of truth

Game content is authored under `content/`.

- `content/dojo-game.json` — executable game definition and global configuration
- `content/rules.json` — rules and rulings content
- `content/cards.json` — canonical printed card catalog
- `content/effects.json` — reusable structured-effect vocabulary
- `content/card-effects/*.json` — executable card behavior by family
- `content/card-effects.json` — generated aggregate; do not hand-edit

`app/data/` is generated application data. It is a consumer of canonical content, not an authoring surface. Run `npm run game:generate` after canonical edits and commit the generated result.

## Local development

Requires Node.js 22.12 or newer.

```bash
npm ci
npm run dev
```

Useful commands:

```bash
npm run verify          # canonical generation/check + runtime tests + production build
npm run game:generate   # regenerate application data from content/
npm run engine:local    # two-player terminal engine
npm run engine:ai       # human vs. bot terminal engine
npm run simulate -- 10000
```

Simulation output is local/generated analysis under `reports/` and is intentionally not committed.

## Architecture

The maintenance rule is simple:

> **Canonical JSON defines the game. Runtime code executes it. React orchestrates it. CSS presents it.**

Do not add a mechanic to React or CSS when it belongs in canonical content or a reusable resolver. Compatibility fallbacks may still exist while older printed effects finish migrating; new mechanics should not extend those fallbacks.

See `docs/ENGINE-ARCHITECTURE.md` for the executable-data boundary.

## Project structure

- `content/` — canonical rules, cards, effects, schemas, and structured card behavior
- `engine/` — deterministic terminal/simulation engine
- `app/` — React companion, Quick Duel orchestration, shared runtime hosts, and generated `app/data/`
- `src/` — Vite entry point and Playtest event/VFX infrastructure
- `tests/` — small permanent architecture/runtime behavior gate
- `scripts/` — canonical generation/validation and production-card tooling
- `public/` — static web/PWA/download assets

Shared presentation lives in `app/globals.css`, `app/card-inspector.css`, and `app/playtest.css`. The 2a identity is composed in `app/field-redesign.css`; `app/fight-night.css` owns the Fight Night lobby, notebook, and bout presentation. Keep new styles attached to their components and use the shared theme tokens.

## Deployment

`.github/workflows/deploy-pages.yml` runs the same `npm run verify` gate for pull requests and `main`, then deploys successful `main` builds to GitHub Pages.
