import { frog, skinNames } from './art';
import { initialState, selectToken, advance, toySeed } from './simulation';
import type { Phase } from './simulation';

const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
document.querySelectorAll<HTMLElement>('[data-frog]').forEach(el => { el.innerHTML = frog(Number(el.dataset.frog)); });
let state = initialState();
const knownHash = 0x51a7c0de;
const traitName = (seed: number) => `${skinNames[seed % 4]} · ${['Classic', 'Shades', 'Hat'][seed % 3]}`;
const copy: Record<Phase, [string, string, string]> = {
  choose: ['First, commit to an example.', 'Your choice is locked before the future hash exists.', 'Lock example'],
  committed: ['Committed in block 100.', 'The example token is fixed. Now let the next block happen.', 'Advance to block 101'],
  target: ['Block 101 has happened.', 'Its hash now exists. Move one more block so the contract can read it.', 'Advance to block 102'],
  ready: ['Block 102: ready for reveal.', 'The target block is now in the past. Use its fixed hash to reveal.', 'Reveal example'],
  revealed: ['Revealed. This result is fixed.', 'Another reveal keeps the same result. Try it, or reset for a new experiment.', 'Reveal again'],
};
function render(announce = false) {
  const knownSeed = toySeed(knownHash, state.token);
  get('known-art').innerHTML = frog(knownSeed);
  get('known-trait').textContent = traitName(knownSeed);
  const revealed = state.phase === 'revealed';
  get('future-art').innerHTML = frog(state.result ?? 0, !revealed);
  get('future-art').classList.toggle('mystery', !revealed);
  get('future-trait').textContent = revealed ? traitName(state.result!) : 'A mystery Pepe';
  get('future-label').textContent = revealed ? 'Result fixed' : state.futureHash !== null ? 'Target hash fixed' : 'No preview yet';
  get('future-description').textContent = revealed ? 'A seed becomes pixels. Revealing again cannot change them.' : state.futureHash !== null ? 'The outcome can now be computed; your earlier choice is already locked.' : 'The missing input is a block that hasn’t happened.';
  get('future-hash').textContent = state.futureHash === null ? 'Not created yet' : `0x${state.futureHash.toString(16).padStart(8, '0')}`;
  get<HTMLFieldSetElement>('token-options').disabled = state.phase !== 'choose';
  document.querySelectorAll<HTMLInputElement>('input[name="token"]').forEach(input => { input.checked = Number(input.value) === state.token; });
  get('input-hint').textContent = state.phase === 'choose' ? 'Switch tokens. The known-hash preview changes; the future result stays unknown.' : `Example #00${state.token} is locked. The original minter is fixed too; this model keeps that input constant.`;
  const active = state.phase === 'choose' ? -1 : state.phase === 'committed' ? 0 : state.phase === 'target' ? 1 : 2;
  [100, 101, 102].forEach((block, i) => {
    const el = get(`block-${block}`);
    el.classList.toggle('is-current', i === active);
    el.classList.toggle('is-past', i < active);
    if (i === active) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
  });
  const [title, description, label] = copy[state.phase];
  get('stage-title').textContent = title;
  get('stage-description').textContent = description;
  get('advance').innerHTML = `${label} <span aria-hidden="true">→</span>`;
  get('takeaway').hidden = !revealed;
  get('lab').dataset.phase = state.phase;
  if (announce) get('sim-status').textContent = `${title} ${description}${revealed ? ` Result: ${traitName(state.result!)}.` : ''}`;
}
document.querySelectorAll<HTMLInputElement>('input[name="token"]').forEach(input => input.addEventListener('change', () => {
  state = selectToken(state, Number(input.value));
  render();
  get('sim-status').textContent = `Example ${state.token}. Known-hash preview: ${traitName(toySeed(knownHash, state.token))}. Future result unknown.`;
}));
get('advance').addEventListener('click', () => {
  const wasRevealed = state.phase === 'revealed';
  state = advance(state, () => crypto.getRandomValues(new Uint32Array(1))[0]);
  render(true);
  if (wasRevealed) get('sim-status').textContent = `Unchanged: ${traitName(state.result!)}. The seed is already fixed.`;
});
get('reset').addEventListener('click', () => {
  state = initialState();
  render();
  get('sim-status').textContent = 'Experiment reset. Pick an example token or lock the default.';
});
get('lab').hidden = false;
render();
