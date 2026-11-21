/* Lantern Lane — bootstrap: wire the canvases, HUD, buttons and
   overlays to the game, then show the menu (or a staged ?shot= state). */

import { LEVELS } from './differences.js';
import { SpotGame, PHASE } from './game.js';
import { bindPointer, bindKeyboard } from './input.js';

const $ = (id) => document.getElementById(id);

const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');

const ui = {
  update(game) {
    $('hud-level').textContent = game.levelIndex + 1 + ' / ' + LEVELS.length;
    $('hud-found').textContent = game.foundCount + ' / ' + game.level.differences.length;
    $('hud-time').textContent = game.formatTimeLeft();
    $('hud-score').textContent = String(game.score);
    $('hud-hints').textContent = String(game.hintsLeft);
    $('hint-count').textContent = game.hintsLeft > 0 ? '(' + game.hintsLeft + ' left)' : '(none left)';
    const timeBox = $('hud-time').parentElement;
    timeBox.classList.toggle('danger', game.phase === PHASE.PLAYING && game.timeLeft <= 10);
    const fill = $('timer-fill');
    fill.style.width = Math.max(0, (game.timeLeft / game.level.timeLimit) * 100) + '%';
    fill.classList.toggle('low', game.timeLeft <= 10);
    const combo = $('combo');
    combo.textContent = game.combo >= 2 ? 'COMBO x' + Math.min(game.combo, 5) : '';
    combo.classList.toggle('hot', game.combo >= 4);
    $('btn-hint').disabled = game.phase !== PHASE.PLAYING || game.hintsLeft <= 0;
    $('btn-restart').disabled = game.phase !== PHASE.PLAYING;
  },

  showMessage(text) {
    $('message').textContent = text;
  },

  shake(side) {
    const wrap = side === 'right' ? $('panel-right-wrap') : $('panel-left-wrap');
    wrap.classList.remove('shake');
    void wrap.offsetWidth;
    wrap.classList.add('shake');
  },

  setSoundLabel(on) {
    $('btn-sound').innerHTML = 'Sound: ' + (on ? 'On' : 'Off') + ' <kbd>M</kbd>';
  },

  hideOverlay() {
    $('overlay').classList.add('hidden');
  },

  showOverlay(title, text, statsHtml, buttons, hint) {
    $('overlay-title').textContent = title;
    $('overlay-text').textContent = text;
    $('overlay-stats').innerHTML = statsHtml;
    const box = $('overlay-buttons');
    box.innerHTML = '';
    for (const b of buttons) {
      const el = document.createElement('button');
      el.type = 'button';
      el.textContent = b.label;
      if (b.secondary) el.classList.add('secondary');
      el.addEventListener('click', b.onClick);
      box.appendChild(el);
    }
    $('overlay-hint').textContent = hint || '';
    $('overlay').classList.remove('hidden');
  },

  showMenu(game) {
    const lines = LEVELS.map(
      (level, i) =>
        `<b>Level ${i + 1} — ${level.name}</b>: ${level.differences.length} differences, ${level.timeLimit / 60} min`,
    ).join('<br>');
    this.showOverlay(
      'Lantern Lane',
      'Two pictures, side by side — almost the same. Click every difference you can spot, on either picture. Wrong clicks cost points and time; hints cost 25 points.',
      lines,
      [
        { label: 'Start the hunt', onClick: () => game.start() },
        { label: 'Level 2 — Kitchen', secondary: true, onClick: () => game.startLevel(1) },
        { label: 'Level 3 — Harbor', secondary: true, onClick: () => game.startLevel(2) },
      ],
      'Keys: H hint · M sound · R restart · 1/2/3 jump to a level · Esc menu',
    );
    this.showMessage('Pick a level and start hunting!');
  },

  showLevelClear(game, timeBonus, last) {
    this.showOverlay(
      last ? 'Harbor cleared!' : 'Level clear!',
      last
        ? 'You found every difference in the harbor. That was the last scene — take the bow!'
        : `Every difference in ${game.level.name} found. The next scene is harder — sharper eyes, please.`,
      `Score <b>${game.score}</b> (time bonus +${timeBonus})<br>` +
        `Differences found <b>${game.totalFound}</b> · Best combo <b>x${Math.min(game.bestCombo, 5)}</b>`,
      last
        ? [{ label: 'See your final score', onClick: () => game.allClear() }]
        : [
            { label: 'Next level', onClick: () => game.nextLevel() },
            { label: 'Replay this level', secondary: true, onClick: () => game.startLevel(game.levelIndex) },
          ],
      'Press N for the next level.',
    );
    this.showMessage('Level clear! +' + timeBonus + ' time bonus.');
  },

  showTimeUp(game) {
    const remaining = game.level.differences.length - game.foundCount;
    this.showOverlay(
      "Time's up!",
      `The lanterns dimmed with ${remaining} difference${remaining === 1 ? '' : 's'} still hiding in ${game.level.name}.`,
      `Score <b>${game.score}</b> · Found <b>${game.foundCount} / ${game.level.differences.length}</b>`,
      [
        { label: 'Try again', onClick: () => game.startLevel(game.levelIndex) },
        { label: 'Back to levels', secondary: true, onClick: () => game.backToMenu() },
      ],
      'Tip: scan one small patch at a time, left picture then right.',
    );
    this.showMessage("Time's up — " + remaining + ' still hiding.');
  },

  showAllClear(game) {
    this.showOverlay(
      'You found them all!',
      'Every difference in all three scenes — park, kitchen and harbor. Lantern Lane salutes your eyes.',
      `Final score <b>${game.score}</b><br>` +
        `Differences found <b>${game.totalFound}</b> · Best combo <b>x${Math.min(game.bestCombo, 5)}</b> · Wrong clicks <b>${game.wrongCount}</b>`,
      [
        { label: 'Play again', onClick: () => game.start() },
        { label: 'Back to levels', secondary: true, onClick: () => game.backToMenu() },
      ],
      'Thanks for playing Lantern Lane.',
    );
    this.showMessage('All three scenes cleared — final score ' + game.score + '!');
  },
};

const game = new SpotGame(leftCanvas.getContext('2d'), rightCanvas.getContext('2d'), ui);

bindPointer(leftCanvas, 'left', game);
bindPointer(rightCanvas, 'right', game);
bindKeyboard(game);

$('btn-hint').addEventListener('click', () => game.useHint());
$('btn-sound').addEventListener('click', () => {
  const on = game.toggleSound();
  ui.setSoundLabel(on);
});
$('btn-restart').addEventListener('click', () => game.startLevel(game.levelIndex));
$('btn-menu').addEventListener('click', () => game.backToMenu());

game.run();
game.applyShot();
