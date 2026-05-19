import * as path from "node:path";
import { existsSync } from "node:fs";
import type { NextAdapter } from "next";

import { findRepoRoot } from "./repo-root.js";
import { detectPackagesNeedingTranspile } from "./transpile-detect.js";

// `NextAdapter.modifyConfig` is parameterised by Next.js's own NextConfig
// type and the build-phase tag. Re-export those argument types from a
// single place so adapter implementations don't have to duplicate the
// `Parameters<...>` dance.
type ModifyConfigFn = NonNullable<NextAdapter["modifyConfig"]>;
type NextConfig = Parameters<ModifyConfigFn>[0];
type ModifyConfigCtx = Parameters<ModifyConfigFn>[1];

/**
 * Options for `applyBaseModifyConfig`. Adapters pass their package name
 * so the auto-transpile log line credits the right tool, and the path
 * to the cache handler they want Next.js to use (typically the one
 * resolved from this package or a target-specific override).
 */
export interface BaseModifyConfigOptions {
  /** Display name in the log line, e.g. "Creek Adapter", "Creekd Adapter". */
  logLabel?: string;
  /** Absolute path to the cache handler module Next.js should load. */
  cacheHandlerPath: string;
}

/**
 * The portion of `NextAdapter.modifyConfig` that's identical across
 * targets: pick the cache handler, auto-transpile JSX-in-JS deps,
 * suppress TS errors (build-time only — type-check separately), set
 * `outputFileTracingRoot` for monorepos.
 *
 * Caller wraps this in their own `modifyConfig` and adds whatever
 * target-specific knobs they need. For CF Workers that's
 * `cacheMaxMemorySize: 0` and `maxPostponedStateSize: "20mb"`; for
 * creekd self-host that's `output: 'standalone'`. The base function
 * stays neutral.
 *
 * Returns a new config object — does not mutate the input.
 */
export function applyBaseModifyConfig(
  config: NextConfig,
  ctx: ModifyConfigCtx,
  opts: BaseModifyConfigOptions,
): NextConfig {
  // Only the production-build phase needs the adapter's massaging.
  // Dev / lint / typecheck phases pass through untouched.
  if (ctx.phase !== "phase-production-build") return config;

  const projectDir = process.cwd();
  const repoRoot = findRepoRoot(projectDir);
  const isMonorepo = repoRoot !== projectDir;
  const label = opts.logLabel ?? "Adapter";

  // If the user installed the adapter, the cache handler module is
  // reachable via node_modules — prefer that path so Next.js's loader
  // resolves it through the user's tree rather than via our package's
  // bundled dist. Falls back to the dev-time path the adapter passed.
  const installedCacheHandlerPath = path.join(
    projectDir,
    "node_modules",
    "@solcreek",
    "adapter-core",
    "dist",
    "cache-handler.js",
  );
  const resolvedCacheHandlerPath = existsSync(installedCacheHandlerPath)
    ? installedCacheHandlerPath
    : opts.cacheHandlerPath;

  // Auto-add any direct dep that ships JSX in `.js` to transpilePackages.
  const detected = detectPackagesNeedingTranspile(projectDir);
  const existing = Array.isArray(config.transpilePackages)
    ? config.transpilePackages
    : [];
  const transpilePackages =
    detected.length > 0 ? [...new Set([...existing, ...detected])] : existing;
  if (detected.length > 0) {
    console.log(
      `  [${label}] auto-transpile: ${JSON.stringify(detected)} (JSX in .js entry)`,
    );
  }

  return {
    ...config,
    cacheHandler: resolvedCacheHandlerPath,
    // Skip TypeScript type checking during build — type-checking should
    // be a separate step in CI / pre-deploy, not a hard gate on bundling.
    typescript: { ...config.typescript, ignoreBuildErrors: true },
    ...(transpilePackages.length > 0 && { transpilePackages }),
    // Monorepo: set tracing root so Next.js traces deps from repo root.
    ...(isMonorepo && { outputFileTracingRoot: repoRoot }),
  };
}
