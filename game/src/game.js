/* Lantern Lane — game state: levels, timer, scoring, combos, hints,
   and the demo states (?shot=) that stage a mid-game screenshot. */

import { LEVELS, formatTime } from './differences.js';
import { paintPanels, pointInDifference } from './render.js';
import { SoundBank } from './audio.js';

export const PHASE = {
  MENU: 'menu',
  PLAYING: 'playing',
  LEVEL_CLEAR: 'level-clear',
  TIME_UP: 'time-up',
  ALL_CLEAR: 'all-clear',
};

export class SpotGame {
  constructor(leftCtx, rightCtx, ui) {
    this.leftCtx = leftCtx;
    this.rightCtx = rightCtx;
    this.ui = ui;
    this.sounds = new SoundBank();
    this.phase = PHASE.MENU;
    this.levelIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.found = new Set();
    this.foundAt = {};
    this.hintsLeft = 3;
    this.hint = null;
    this.flashes = [];
    this.combo = 0;
    this.bestCombo = 0;
    this.timeLeft = 0;
    this.lastTick = 0;
    this.wrongCount = 0;
    this.raf = 0;
    this.lastFrame = 0;
    this.shot = new URLSearchParams(window.location.search).get('shot') || '';
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  start() {
    this.score = 0;
    this.totalFound = 0;
    this.bestCombo = 0;
    this.startLevel(0);
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.foundAt = {};
    this.hintsLeft = this.level.hints;
    this.hint = null;
    this.flashes = [];
    this.combo = 0;
    this.wrongCount = 0;
    this.timeLeft = this.level.timeLimit;
    this.lastTick = this.level.timeLimit;
    this.phase = PHASE.PLAYING;
    this.ui.showMessage(this.level.blurb);
    this.ui.hideOverlay();
    this.ui.update(this);
    this.draw(performance.now());
  }

  backToMenu() {
    this.phase = PHASE.MENU;
    this.levelIndex = 0;
    this.found = new Set();
    this.foundAt = {};
    this.hint = null;
    this.flashes = [];
    this.combo = 0;
    this.timeLeft = this.level.timeLimit;
    this.ui.update(this);
    this.ui.showMenu(this);
    this.draw(performance.now());
  }

  click(panel, x, y) {
    if (this.phase !== PHASE.PLAYING) return;
    this.sounds.ensure();
    const diff = pointInDifference(this.level, x, y);
    if (diff && !this.found.has(diff.id)) {
      this.found.add(diff.id);
      this.foundAt[diff.id] = performance.now();
      this.totalFound += 1;
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      const gained = 100 * Math.min(this.combo, 5) + Math.round(this.timeLeft);
      this.score += gained;
      this.sounds.found(this.combo);
      const left = this.level.differences.length - this.found.size;
      this.ui.showMessage(
        left === 0
          ? 'Last one! ' + diff.label + '.'
          : 'Found it — ' + diff.label + '! ' + left + ' to go.',
      );
      if (this.hint && this.hint.id === diff.id) this.hint = null;
      this.ui.update(this);
      this.draw(performance.now());
      if (this.found.size === this.level.differences.length) this.clearLevel();
    } else if (diff && this.found.has(diff.id)) {
      this.ui.showMessage('Already found that one — keep looking!');
    } else {
      this.wrongCount += 1;
      this.combo = 0;
      this.score = Math.max(0, this.score - 10);
      this.timeLeft = Math.max(0, this.timeLeft - 3);
      this.flashes.push({ ctx: panel, x, y, at: performance.now() });
      this.sounds.wrong();
      this.ui.showMessage('Not there — minus 10 points and 3 seconds. Look closer!');
      this.ui.shake(panel);
      this.ui.update(this);
      this.draw(performance.now());
    }
  }

  useHint() {
    if (this.phase !== PHASE.PLAYING) return;
    if (this.hintsLeft <= 0) {
      this.ui.showMessage('No hints left on this level.');
      return;
    }
    const remaining = this.level.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 25);
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hint = { id: pick.id, until: performance.now() + 3000 };
    this.sounds.hint();
    this.ui.showMessage('Hint: something changed in that glowing circle… (−25 pts)');
    this.ui.update(this);
  }

  toggleSound() {
    this.sounds.muted = !this.sounds.muted;
    if (!this.sounds.muted) this.sounds.click();
    return !this.sounds.muted;
  }

  clearLevel() {
    const timeBonus = Math.round(this.timeLeft) * 5;
    this.score += timeBonus;
    this.phase = PHASE.LEVEL_CLEAR;
    this.sounds.levelClear();
    const last = this.levelIndex === LEVELS.length - 1;
    this.ui.update(this);
    this.ui.showLevelClear(this, timeBonus, last);
  }

  timeUp() {
    this.phase = PHASE.TIME_UP;
    this.sounds.gameOver();
    this.ui.update(this);
    this.ui.showTimeUp(this);
  }

  allClear() {
    this.phase = PHASE.ALL_CLEAR;
    this.sounds.levelClear();
    this.ui.update(this);
    this.ui.showAllClear(this);
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) this.startLevel(this.levelIndex + 1);
    else this.allClear();
  }

  frame(now) {
    if (this.phase === PHASE.PLAYING) {
      const dt = this.lastFrame ? (now - this.lastFrame) / 1000 : 0;
      this.timeLeft -= dt;
      const whole = Math.ceil(this.timeLeft);
      if (whole !== this.lastTick) {
        this.lastTick = whole;
        if (whole <= 10 && whole > 0) this.sounds.tick();
        this.ui.update(this);
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.ui.update(this);
        this.timeUp();
        return;
      }
      if (this.hint && now > this.hint.until) this.hint = null;
      this.flashes = this.flashes.filter((f) => now - f.at < 700);
      this.draw(now);
    }
    this.lastFrame = now;
  }

  draw(now) {
    const foundIds = new Set(this.found);
    const diffs = this.level.differences.map((d) => ({
      ...d,
      foundAt: this.foundAt[d.id] || 0,
    }));
    const levelView = { ...this.level, differences: diffs };
    paintPanels(this.leftCtx, this.rightCtx, levelView, foundIds, this.hint, this.flashes, now);
  }

  run() {
    const loop = (now) => {
      this.frame(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  /* Stage a fixed mid-game state for screenshots (?shot=mid etc.).
     These are real game states — the same code path as playing. */
  applyShot() {
    if (this.shot === 'start') {
      this.backToMenu();
      return;
    }
    if (this.shot === 'mid') {
      this.startLevel(0);
      this.stageFound([0, 2, 4], 107);
      return;
    }
    if (this.shot === 'late') {
      this.startLevel(1);
      this.stageFound([0, 1, 3, 4, 5], 64);
      return;
    }
    if (this.shot === 'harbor') {
      this.startLevel(2);
      this.stageFound([1, 4, 6], 88);
      return;
    }
    if (this.shot === 'win') {
      this.startLevel(0);
      this.stageFound([0, 1, 2, 3, 4], 132);
      this.clearLevel();
      return;
    }
    this.backToMenu();
  }

  stageFound(indexes, secondsLeft) {
    const now = performance.now();
    for (const i of indexes) {
      const d = this.level.differences[i];
      this.found.add(d.id);
      this.foundAt[d.id] = now - 900;
      this.totalFound += 1;
    }
    this.combo = indexes.length;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.score = 100 * indexes.length + 250;
    this.timeLeft = secondsLeft;
    this.lastTick = Math.ceil(secondsLeft);
    this.ui.update(this);
    this.draw(now);
  }

  formatTimeLeft() {
    return formatTime(this.timeLeft);
  }
}
