/* Lantern Lane — input: pointer clicks on either panel and keyboard
   shortcuts. Click coordinates are mapped from the displayed canvas
   back into the 600x440 panel space the differences live in. */

import { PANEL_W, PANEL_H } from './scenes.js';

export function canvasPoint(canvas, event) {
  const box = canvas.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width) * PANEL_W;
  const y = ((event.clientY - box.top) / box.height) * PANEL_H;
  return { x, y };
}

export function bindPointer(canvas, side, game) {
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const { x, y } = canvasPoint(canvas, event);
    game.click(side, x, y);
  });
}

export function bindKeyboard(game) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') {
      game.useHint();
    } else if (key === 'm') {
      const on = game.toggleSound();
      game.ui.setSoundLabel(on);
    } else if (key === 'r') {
      game.startLevel(game.levelIndex);
    } else if (key === 'escape') {
      game.backToMenu();
    } else if (key === 'n' || key === 'enter') {
      if (game.phase === 'level-clear') game.nextLevel();
      else if (game.phase === 'menu' || game.phase === 'all-clear') game.start();
      else if (game.phase === 'time-up') game.startLevel(game.levelIndex);
    } else if (key === '1' || key === '2' || key === '3') {
      const idx = Number(key) - 1;
      if (game.phase === 'menu') game.startLevel(idx);
    }
  });
}
