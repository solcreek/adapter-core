/**
 * Re-export shim for the in-memory Next.js ISR cache handler. The
 * implementation moved to
 * [`@solcreek/adapter-next-core`](https://www.npmjs.com/package/@solcreek/adapter-next-core)
 * — this file keeps the
 *
 *   cacheHandler: require.resolve("@solcreek/adapter-core/cache-handler")
 *
 * wiring in user `next.config.js` files working without changes.
 *
 * @deprecated Prefer `@solcreek/adapter-next-core/cache-handler`
 * directly. This shim stays for one release cycle, then goes away
 * when adapter-core is archived.
 */

export { default } from "@solcreek/adapter-next-core/cache-handler";
