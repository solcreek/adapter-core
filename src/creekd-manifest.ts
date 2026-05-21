/**
 * Framework-neutral deployment manifest consumed by creekd tooling.
 *
 * This describes a process creekd can spawn, not a framework build. Adapters
 * may add metadata such as framework/buildId/adapter, but creekd should only
 * need the process fields below.
 */

export type CreekdRuntime = "bun" | "node" | "deno";

export interface CreekdDeployManifest {
  /** Manifest schema version. Increment on breaking shape changes. */
  version: 1;
  /** Deployment target. Keeps creekd manifests distinct from other targets. */
  target: "creekd";
  /** Runtime creekd should use for `entrypoint`. */
  runtime: CreekdRuntime;
  /** Entrypoint path relative to the project root. */
  entrypoint: string;
  /** Port the app process should listen on. */
  port: number;
  /** Optional environment variables, encoded as KEY=VALUE strings. */
  env?: string[];
  /** Optional HTTP liveness probe path. */
  health_check_path?: string;
  /** Optional directories the adapter prepared for the runtime to serve/read. */
  serveDirs?: string[];

  // Adapter/framework metadata. creekd should treat these as informational.
  framework?: string;
  buildId?: string;
  nextVersion?: string;
  adapter?: {
    name: string;
    version: string;
  };
  hasMiddleware?: boolean;
  hasPrerender?: boolean;
}

export function isCreekdRuntime(value: unknown): value is CreekdRuntime {
  return value === "bun" || value === "node" || value === "deno";
}

export function isCreekdDeployManifest(value: unknown): value is CreekdDeployManifest {
  if (!value || typeof value !== "object") return false;
  const manifest = value as Record<string, unknown>;
  return manifest.version === 1 &&
    manifest.target === "creekd" &&
    isCreekdRuntime(manifest.runtime) &&
    typeof manifest.entrypoint === "string" &&
    manifest.entrypoint.length > 0 &&
    Number.isInteger(manifest.port) &&
    (manifest.port as number) > 0 &&
    (manifest.port as number) <= 65535;
}
