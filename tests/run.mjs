import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const scratch = mkdtempSync(join(tmpdir(), 'swarm-pepe-tests-'));

try {
  for (const [source, output] of [
    ['src/simulation.ts', 'simulation.mjs'],
    ['tests/simulation.test.ts', 'simulation.test.mjs'],
  ]) {
    const { outputText } = ts.transpileModule(readFileSync(join(root, source), 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    });
    writeFileSync(join(scratch, output), outputText.replace('../src/simulation.ts', './simulation.mjs'));
  }
  const result = spawnSync(process.execPath, ['--test', join(scratch, 'simulation.test.mjs')], {
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
