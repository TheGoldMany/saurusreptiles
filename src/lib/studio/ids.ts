let counter = 0;

/**
 * Short, collision-free id for tiers and units.
 *
 * Deliberately not `crypto.randomUUID()`: ids are generated during render on
 * both the server and the client, and a monotonic counter keeps them stable
 * and readable in the blueprint callouts.
 */
export function nanoUnitId(): string {
  counter += 1;
  return `u${counter.toString(36)}`;
}
