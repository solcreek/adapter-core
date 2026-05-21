import { describe, expect, it } from "vitest";
import { isCreekdDeployManifest, isCreekdRuntime } from "./creekd-manifest.js";

describe("creekd manifest contract", () => {
  it("accepts a framework-neutral creekd process manifest", () => {
    expect(isCreekdDeployManifest({
      version: 1,
      target: "creekd",
      runtime: "deno",
      entrypoint: "server.ts",
      port: 18900,
      framework: "astro",
      env: ["NODE_ENV=production"],
      health_check_path: "/healthz",
    })).toBe(true);
  });

  it("rejects manifests for other targets", () => {
    expect(isCreekdDeployManifest({
      version: 1,
      target: "cloudflare",
      runtime: "bun",
      entrypoint: "server.js",
      port: 18900,
    })).toBe(false);
  });

  it("keeps runtime validation aligned with creekd", () => {
    expect(isCreekdRuntime("bun")).toBe(true);
    expect(isCreekdRuntime("node")).toBe(true);
    expect(isCreekdRuntime("deno")).toBe(true);
    expect(isCreekdRuntime("python")).toBe(false);
  });
});
