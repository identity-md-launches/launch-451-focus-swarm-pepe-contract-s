import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, initialState, selectToken, toySeed } from '../src/simulation.ts';
import type { Simulation } from '../src/simulation.ts';

test('a visitor can compare valid examples before committing; invalid choices are ignored', () => {
  const start = initialState();
  const second = selectToken(start, 2);
  const third = selectToken(second, 3);
  assert.equal(start.token, 1, 'choosing does not mutate the original state');
  assert.equal(second.token, 2);
  assert.equal(third.token, 3);
  for (const invalid of [0, 4, -1, 1.5, Number.NaN]) {
    assert.equal(selectToken(third, invalid), third);
  }
  assert.equal(third.futureHash, null);
  assert.equal(third.result, null);
});

test('the example choice stays locked in every phase after commitment', () => {
  let state = advance(selectToken(initialState(), 3), () => 123);
  for (const expectedPhase of ['committed', 'target', 'ready', 'revealed']) {
    assert.equal(state.phase, expectedPhase);
    const attemptedChange = selectToken(state, 1);
    assert.equal(attemptedChange, state);
    assert.equal(attemptedChange.token, 3);
    state = advance(state, () => 123);
  }
});

test('future entropy is created only after commitment, when the target block arrives', () => {
  let draws = 0;
  const entropy = () => { draws += 1; return 0x8abc1234; };
  let state = selectToken(initialState(), 2);
  assert.equal(draws, 0);
  assert.equal(state.futureHash, null);
  state = advance(state, entropy);
  assert.equal(state.phase, 'committed');
  assert.equal(draws, 0, 'locking the example must not draw the future hash');
  assert.equal(state.futureHash, null);
  state = advance(state, entropy);
  assert.equal(state.phase, 'target');
  assert.equal(draws, 1);
  assert.equal(state.futureHash, 0x8abc1234);
  assert.equal(state.result, null);
  state = advance(state, entropy);
  state = advance(state, entropy);
  assert.equal(draws, 1, 'waiting and revealing use the same fixed hash');
});

test('reveal cannot finish in the commit block or target-block phase', () => {
  let state = initialState();
  for (const phase of ['committed', 'target', 'ready']) {
    state = advance(state, () => 0x12345678);
    assert.equal(state.phase, phase);
    assert.equal(state.result, null, `${phase} must not show a stored reveal`);
  }
  state = advance(state, () => { throw new Error('reveal must not request fresh entropy'); });
  assert.equal(state.phase, 'revealed');
  assert.equal(typeof state.result, 'number');
});

test('waiting longer and repeating reveal cannot reroll a committed result', () => {
  let state = selectToken(initialState(), 2);
  state = advance(state, () => 17);
  state = advance(state, () => 0xabcdef01);
  state = advance(state, () => { throw new Error('waiting must not redraw'); });
  const atReady = structuredClone(state);
  const first = advance(state, () => { throw new Error('revealing must not redraw'); });
  const repeatFromSameInputs = advance(atReady, () => 999);
  assert.equal(first.result, repeatFromSameInputs.result);
  assert.equal(first.futureHash, 0xabcdef01);
  assert.equal(first.token, 2);
  for (let attempts = 0; attempts < 5; attempts += 1) {
    assert.equal(advance(first, () => { throw new Error('repeat must not redraw'); }), first);
  }
});

test('reset creates an independent experiment without changing a revealed token', () => {
  let original: Simulation = selectToken(initialState(), 3);
  for (let step = 0; step < 4; step += 1) original = advance(original, () => 81);
  const saved = structuredClone(original);
  let reset = initialState();
  assert.notEqual(reset, original);
  assert.equal(reset.phase, 'choose');
  assert.equal(reset.token, 1);
  assert.equal(reset.futureHash, null);
  assert.equal(reset.result, null);
  for (let step = 0; step < 4; step += 1) reset = advance(reset, () => 82);
  assert.deepEqual(original, saved);
  assert.equal(reset.futureHash, 82);
  assert.equal(original.futureHash, 81);
});

test('the known-hash comparison is repeatable and distinguishes its three example inputs', () => {
  const known = 0x51a7c0de;
  const results = [1, 2, 3].map(token => toySeed(known, token));
  assert.equal(new Set(results).size, 3);
  assert.deepEqual([1, 2, 3].map(token => toySeed(known, token)), results);
});
