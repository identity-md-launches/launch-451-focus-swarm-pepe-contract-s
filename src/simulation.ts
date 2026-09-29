/** Educational model only. Toy hash, fabricated inputs, no Ethereum interaction. */
export type Phase = 'choose' | 'committed' | 'target' | 'ready' | 'revealed';
export interface Simulation { phase: Phase; token: number; futureHash: number | null; result: number | null; }
export const initialState = (): Simulation => ({ phase: 'choose', token: 1, futureHash: null, result: null });
export function toySeed(hash: number, token: number): number {
  let n = (hash ^ Math.imul(token, 2654435761)) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 2246822507) >>> 0;
  return (n ^ (n >>> 13)) >>> 0;
}
export function selectToken(state: Simulation, token: number): Simulation {
  return state.phase === 'choose' && [1, 2, 3].includes(token) ? { ...state, token } : state;
}
export function advance(state: Simulation, entropy: () => number): Simulation {
  switch (state.phase) {
    case 'choose': return { ...state, phase: 'committed' };
    case 'committed': return { ...state, phase: 'target', futureHash: entropy() >>> 0 };
    case 'target': return { ...state, phase: 'ready' };
    case 'ready': return { ...state, phase: 'revealed', result: toySeed(state.futureHash!, state.token) };
    case 'revealed': return state;
  }
}
