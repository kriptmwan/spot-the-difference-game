/* Lantern Lane — synthesized sounds. No audio files: every effect is
   built from oscillators through the Web Audio API, so the game ships
   zero bytes of sound and works fully offline. */

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, dur, type, vol, when = 0, slideTo = null) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() {
    this.tone(700, 0.06, 'triangle', 0.12);
  }

  found(combo) {
    // A rising two-note pop; higher combos sing higher.
    const base = 520 + Math.min(combo, 5) * 60;
    this.tone(base, 0.12, 'sine', 0.25);
    this.tone(base * 1.5, 0.18, 'sine', 0.22, 0.07);
  }

  wrong() {
    this.tone(160, 0.22, 'sawtooth', 0.14, 0, 110);
  }

  hint() {
    this.tone(880, 0.1, 'sine', 0.16);
    this.tone(1174, 0.14, 'sine', 0.14, 0.09);
    this.tone(1568, 0.2, 'sine', 0.12, 0.18);
  }

  levelClear() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((f, i) => this.tone(f, 0.28, 'triangle', 0.22, i * 0.11));
  }

  gameOver() {
    const notes = [392, 330, 262, 196];
    notes.forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.18, i * 0.14));
  }

  tick() {
    this.tone(1200, 0.05, 'square', 0.05);
  }
}
