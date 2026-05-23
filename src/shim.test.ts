// Smoke tests for the v0.3.x shim shape. The actual implementations
// live in @solcreek/adapter-next-core and @solcreek/creekd-manifest;
// these tests only assert that the re-exports compile and resolve at
// runtime so existing consumers' `import { ... } from "@solcreek/adapter-core"`
// keeps working without changes.
//
// Behavioural coverage for the underlying surface lives in the
// successor packages' own test suites.

import { describe, expect, it } from "vitest";

import {
  // Stays-here surface
  findRepoRoot,
  type DeployManifestBase,
  // Re-exported from @solcreek/adapter-next-core
  applyBaseModifyConfig,
  collectEntryFiles,
  detectPackagesNeedingTranspile,
  looksLikeJsxInJs,
  // Re-exported from @solcreek/creekd-manifest
  isCreekdDeployManifest,
  isCreekdRuntime,
  type CreekdDeployManifest,
  type CreekdRuntime,
} from "./index.js";

describe("v0.3.x re-export shim", () => {
  it("stays-here surface remains callable", () => {
    expect(typeof findRepoRoot).toBe("function");
    // Type assertion on DeployManifestBase happens at compile time;
    // a runtime no-op is fine.
    const m: DeployManifestBase = { version: 1, target: "creekd" } as DeployManifestBase;
    expect(m.version).toBe(1);
  });

  it("@solcreek/adapter-next-core re-exports are reachable", () => {
    expect(typeof applyBaseModifyConfig).toBe("function");
    expect(typeof collectEntryFiles).toBe("function");
    expect(typeof detectPackagesNeedingTranspile).toBe("function");
    expect(typeof looksLikeJsxInJs).toBe("function");
  });

  it("@solcreek/creekd-manifest re-exports work end-to-end", () => {
    expect(typeof isCreekdDeployManifest).toBe("function");
    expect(typeof isCreekdRuntime).toBe("function");

    // Round-trip a minimal manifest through the predicate to prove
    // the actual implementation is wired up, not just a stub.
    const good: CreekdDeployManifest = {
      version: 1,
      target: "creekd",
      runtime: "node" as CreekdRuntime,
      entrypoint: "build/index.js",
      port: 3000,
    };
    expect(isCreekdDeployManifest(good)).toBe(true);
    expect(isCreekdDeployManifest({ version: 999, target: "x" })).toBe(false);

    expect(isCreekdRuntime("bun")).toBe(true);
    expect(isCreekdRuntime("python")).toBe(false);
  });
});
