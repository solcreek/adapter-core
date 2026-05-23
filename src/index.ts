/**
 * `@solcreek/adapter-core` is a thin re-export shim as of v0.3.0.
 *
 * The Next.js-specific helpers (applyBaseModifyConfig, the in-memory
 * cacheHandler, JSX-in-JS transpile detection) live in
 * [`@solcreek/adapter-next-core`](https://www.npmjs.com/package/@solcreek/adapter-next-core).
 *
 * The creekd manifest contract (`CreekdDeployManifest`,
 * `isCreekdDeployManifest`, etc.) lives in
 * [`@solcreek/creekd-manifest`](https://www.npmjs.com/package/@solcreek/creekd-manifest).
 *
 * Truly framework-neutral utilities (`findRepoRoot`,
 * `DeployManifestBase`) stay here.
 *
 * Existing import paths keep working through this shim so no
 * consumer needs to change a line. New code should import directly
 * from the successor packages — this package will be archived once
 * usage drops.
 *
 * @deprecated Prefer `@solcreek/adapter-next-core` or
 * `@solcreek/creekd-manifest` directly. See the README for the
 * full migration map.
 */

// Framework-neutral surface — stays in this package.
export { findRepoRoot } from "./repo-root.js";
export { type DeployManifestBase } from "./manifest-base.js";

// Next.js-specific helpers — moved to @solcreek/adapter-next-core.
export {
  applyBaseModifyConfig,
  type BaseModifyConfigOptions,
  collectEntryFiles,
  detectPackagesNeedingTranspile,
  looksLikeJsxInJs,
} from "@solcreek/adapter-next-core";

// Creekd manifest contract — moved to @solcreek/creekd-manifest.
export {
  isCreekdDeployManifest,
  isCreekdRuntime,
  type CreekdDeployManifest,
  type CreekdRuntime,
} from "@solcreek/creekd-manifest";
