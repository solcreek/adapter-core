# @solcreek/adapter-core

[![checks](https://github.com/solcreek/adapter-core/actions/workflows/checks.yml/badge.svg)](https://github.com/solcreek/adapter-core/actions/workflows/checks.yml)
[![npm](https://img.shields.io/npm/v/@solcreek/adapter-core)](https://www.npmjs.com/package/@solcreek/adapter-core)

Portable Next.js adapter utilities shared by the SolCreek deployment adapters:

- [`@solcreek/adapter-creek`](https://github.com/solcreek/adapter-creek) — Next.js → Cloudflare Workers
- [`@solcreek/adapter-creekd`](https://github.com/solcreek/adapter-creekd) — Next.js → creekd self-host (Bun / Node / Deno)

This package is intentionally small. It contains only code that is target-agnostic (does not assume CF / workerd or Linux / process supervisor): repo-root detection, transpile-package detection for Turbopack JSX-in-JS workarounds, the in-memory ISR cache handler, and the shared base manifest schema.

If you're picking a deployment target, install one of the adapter packages above instead. This one is a transitive dependency of both.

## What's in here

| Export | Purpose |
|---|---|
| `findRepoRoot(startDir)` | Walks up looking for `pnpm-workspace.yaml`, `turbo.json`, or a workspace-rooted `package.json` |
| `detectPackagesNeedingTranspile(projectDir)` | Returns direct deps that ship JSX inside `.js` files (Turbopack regression workaround) |
| `applyBaseModifyConfig(config, ctx, opts)` | Common `NextAdapter.modifyConfig` mutations both adapters apply |
| `CacheHandler` (subpath: `./cache-handler`) | In-memory ISR cache implementing Next.js's `cacheHandler` interface |
| `DeployManifestBase` | TypeScript type for the Next.js manifest fields both adapters emit |
| `CreekdDeployManifest` | Framework-neutral process manifest contract for creekd targets |
| `CreekdRuntime` | Supported creekd process runtimes: `bun`, `node`, or `deno` |
| `isCreekdDeployManifest(value)` | Runtime validator for creekd process manifests |
| `isCreekdRuntime(value)` | Runtime validator for creekd runtime names |

Each export is covered by unit tests; see `src/**/*.test.ts`.

## creekd manifest contract

`CreekdDeployManifest` describes a process that creekd can spawn. It is intentionally framework-neutral: creekd should rely on `target`, `runtime`, `entrypoint`, `port`, `env`, `health_check_path`, and `serveDirs`; adapter/framework fields such as `framework`, `buildId`, `nextVersion`, `adapter`, `hasMiddleware`, and `hasPrerender` are metadata.

Minimal example:

```json
{
  "version": 1,
  "target": "creekd",
  "runtime": "bun",
  "entrypoint": "server.js",
  "port": 18900,
  "env": ["NODE_ENV=production"],
  "health_check_path": "/healthz",
  "serveDirs": ["public"]
}
```

## License

Apache 2.0. See `LICENSE`.
