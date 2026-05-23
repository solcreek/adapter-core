# @solcreek/adapter-core

[![npm](https://img.shields.io/npm/v/@solcreek/adapter-core)](https://www.npmjs.com/package/@solcreek/adapter-core)

> [!WARNING]
> **`@solcreek/adapter-core` is being wound down.** Starting with `v0.3.0` this package is a thin re-export shim — every Next-specific helper and the creekd manifest types live in dedicated successor packages now. Existing imports keep working through the shim, but new code should import directly from the successor packages.
>
> The package will be archived after one release cycle of zero direct imports across the SolCreek adapter family.

## Migration map

| Old import | New import |
|---|---|
| `import { applyBaseModifyConfig, type BaseModifyConfigOptions } from "@solcreek/adapter-core"` | `import { ... } from "@solcreek/adapter-next-core"` |
| `import { collectEntryFiles, detectPackagesNeedingTranspile, looksLikeJsxInJs } from "@solcreek/adapter-core"` | `import { ... } from "@solcreek/adapter-next-core"` |
| `import CacheHandler from "@solcreek/adapter-core/cache-handler"` | `import CacheHandler from "@solcreek/adapter-next-core/cache-handler"` |
| `cacheHandler: require.resolve("@solcreek/adapter-core/cache-handler")` (in `next.config.js`) | `cacheHandler: require.resolve("@solcreek/adapter-next-core/cache-handler")` |
| `import { type CreekdDeployManifest, isCreekdDeployManifest, type CreekdRuntime, isCreekdRuntime } from "@solcreek/adapter-core"` | `import { ... } from "@solcreek/creekd-manifest"` |
| `import { findRepoRoot, type DeployManifestBase } from "@solcreek/adapter-core"` | **unchanged** — stays here |

[`@solcreek/adapter-next-core`](https://www.npmjs.com/package/@solcreek/adapter-next-core) owns the Next.js-specific surface (config mutations, transpile detection, in-memory cacheHandler).

[`@solcreek/creekd-manifest`](https://www.npmjs.com/package/@solcreek/creekd-manifest) owns the creekd manifest contract — the Go-side canonical lives at [`solcreek/creekd/api/manifest`](https://github.com/solcreek/creekd/tree/main/api/manifest), with CI enforcing cross-language parity.

## What still lives here (and will after the wind-down)

| Export | Purpose |
|---|---|
| `findRepoRoot(startDir)` | Walks up looking for `pnpm-workspace.yaml`, `turbo.json`, or a workspace-rooted `package.json`. Genuinely framework-neutral. |
| `DeployManifestBase` | TypeScript type for fields every deploy manifest carries (version, target, optional env etc.). Used by both Next adapters' own manifest types. |

If `adapter-core` is archived, these two move to whichever successor package needs them most — but neither imports anything Next.js-specific, so they have no urgency to migrate.

## Why split?

The original framing — "Portable Next.js adapter utilities" — described two unrelated concerns that ended up bundled together:

1. **Helpers two Next adapters share** (`applyBaseModifyConfig`, `transpilePackages` detection, in-memory cacheHandler). These belong with Next consumers and have no business in a non-Next adapter's dep tree.
2. **The creekd manifest contract** (`CreekdDeployManifest` and friends). This is framework-neutral — every adapter that targets `creekd` writes one, regardless of whether it's Next.js, SvelteKit, Astro, or hand-rolled. Pulling it out of an "adapter-core" named for Next utilities lets `@solcreek/svelte-adapter` and future Vue/Solid adapters depend on it cleanly.

Splitting `adapter-core` into two named-for-what-they-do packages (`adapter-next-core` and `creekd-manifest`) makes the dependency graph reflect those concerns honestly. `adapter-core` shrinking to a shim is the end-state of that cleanup.

## License

Apache-2.0
