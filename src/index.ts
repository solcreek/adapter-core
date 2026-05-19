// Package entry. Aggregates the portable adapter utilities so consumers
// import them from a single specifier:
//
//   import { findRepoRoot, detectPackagesNeedingTranspile } from "@solcreek/adapter-core";
//
// The CacheHandler ships as a subpath export (./cache-handler) — Next.js
// requires a path-resolvable module for `next.config.cacheHandler`, so
// hiding it behind a re-export from the package root would force every
// consumer to know the dist filename.

export { findRepoRoot } from "./repo-root.js";
export {
  collectEntryFiles,
  detectPackagesNeedingTranspile,
  looksLikeJsxInJs,
} from "./transpile-detect.js";
export {
  applyBaseModifyConfig,
  type BaseModifyConfigOptions,
} from "./base-config.js";
export { type DeployManifestBase } from "./manifest-base.js";
