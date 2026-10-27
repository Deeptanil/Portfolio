# Graph Report - Portfolio  (2026-10-27)

## Corpus Check
- 57 files · ~72,980 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 246 nodes · 341 edges · 23 communities (12 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c02cfc78`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- hero/index.tsx
- compilerOptions
- dependencies
- devDependencies
- work/page.tsx
- useIsMobile
- assetPreloader.ts
- include
- send-weekly-summary.js
- app/layout.tsx
- work/layout.tsx
- about/layout.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- README.md
- AGENTS.md
- rules/graphify.md
- workflows/graphify.md
- CLAUDE.md
- copilot-instructions.md

## God Nodes (most connected - your core abstractions)
1. `useScrollStore` - 17 edges
2. `compilerOptions` - 16 edges
3. `useIsMobile()` - 15 edges
4. `useThemeStore` - 15 edges
5. `usePrefersReducedMotion()` - 10 edges
6. `include` - 7 edges
7. `ScrollWrapper()` - 5 edges
8. `Experience()` - 5 edges
9. `usePortalStore` - 5 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ScrollWrapper()` --calls--> `useScrollStore`  [EXTRACTED]
  app/components/common/ScrollWrapper.tsx → app/stores/scrollStore.ts
- `Experience()` --calls--> `useScrollStore`  [EXTRACTED]
  app/components/experience/index.tsx → app/stores/scrollStore.ts
- `FooterLinkItem()` --calls--> `useIsMobile()`  [EXTRACTED]
  app/components/footer/index.tsx → app/hooks/useIsMobile.ts
- `SkipButton3D()` --calls--> `useScrollStore`  [EXTRACTED]
  app/components/hero/index.tsx → app/stores/scrollStore.ts
- `AboutPage()` --calls--> `usePrefersReducedMotion()`  [EXTRACTED]
  app/about/page.tsx → app/hooks/usePrefersReducedMotion.ts

## Import Cycles
- None detected.

## Communities (23 total, 11 thin omitted)

### Community 0 - "hero/index.tsx"
Cohesion: 0.10
Nodes (24): CanvasLoader(), ProgressLoader(), ScrollHint(), SkipToPortfolioButton(), ThemeSwitcher(), WebGLWarmup(), WebGLWarmupProps, SkipButton3D() (+16 more)

### Community 1 - "compilerOptions"
Cohesion: 0.08
Nodes (25): ./app/constants, ./app/stores, ./app/types, dom, dom.iterable, esnext, compilerOptions, allowJs (+17 more)

### Community 2 - "dependencies"
Cohesion: 0.08
Nodes (25): @gsap/react, next, dependencies, gsap, @gsap/react, next, posthog-js, react (+17 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+19 more)

### Community 4 - "work/page.tsx"
Cohesion: 0.12
Nodes (20): ABOUT_SECTIONS, AboutPage(), CREDITS, EmailButton(), preventOrphans(), runAutoScrollToBottom(), ScrollWrapper(), VideoBackground() (+12 more)

### Community 5 - "useIsMobile"
Cohesion: 0.12
Nodes (18): GridTile(), GridTileProps, Experience(), Projects(), Work(), Footer(), FooterLinkItem(), ToastState (+10 more)

### Community 7 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "send-weekly-summary.js"
Cohesion: 0.53
Nodes (5): calcTrend(), main(), runHogQL(), sendDiscordWebhook(), TARGET_DOMAINS

### Community 10 - "app/layout.tsx"
Cohesion: 0.15
Nodes (10): SoundToggle(), SUBWOOFER_LULLABY_NOTES, cormorant, jakarta, metadata, syne, viewport, PostHogProvider() (+2 more)

### Community 17 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **94 isolated node(s):** `metadata`, `CREDITS`, `ABOUT_SECTIONS`, `SUBWOOFER_LULLABY_NOTES`, `WebGLWarmupProps` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useScrollStore` connect `hero/index.tsx` to `work/page.tsx`, `useIsMobile`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useIsMobile()` (e.g. with `getServerSnapshot()` and `getSnapshot()`) actually correct?**
  _`useIsMobile()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `CREDITS`, `ABOUT_SECTIONS` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hero/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._