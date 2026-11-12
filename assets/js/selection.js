// Names are intentionally never normalized: U+0020 at either boundary is meaningful.
export function eligibleIndices(names) {
  const eligible = names.map((name, index) => ({ name, index })).filter(({ name }) => !name.startsWith(' '));
  const priority = eligible.filter(({ name }) => name.endsWith(' '));
  return (priority.length ? priority : eligible).map(({ index }) => index);
}
export function randomInt(max, cryptoSource = globalThis.crypto) {
  if (!Number.isSafeInteger(max) || max < 1 || max > 0x100000000) throw new RangeError('Invalid random range');
  if (cryptoSource?.getRandomValues) {
    const range = 0x100000000;
    const limit = range - (range % max);
    const value = new Uint32Array(1);
    do { cryptoSource.getRandomValues(value); } while (value[0] >= limit);
    return value[0] % max;
  }
  return Math.floor(Math.random() * max);
}
export function selectWinner(names, random = randomInt) {
  const pool = eligibleIndices(names);
  return pool.length ? pool[random(pool.length)] : null;
}
