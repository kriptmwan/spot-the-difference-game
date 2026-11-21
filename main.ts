/* Lantern Lane — entrypoint: hand the game in.
   Copies game/ and screenshots/ into the output directory and writes
   /output/dossier.json with buildDossier from vendor/makefun-game.ts,
   using the bounty's own caps. Runs twice with identical bytes:
   the copy is a plain recursive copy and the dossier is deterministic. */

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const rootDir = new URL('.', import.meta.url).pathname;

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const dir of ['game', 'screenshots']) {
  cpSync(join(rootDir, dir), join(outDir, dir), { recursive: true });
}

writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log('wrote ' + outDir + '/dossier.json');
