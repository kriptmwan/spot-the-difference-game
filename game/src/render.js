/* Lantern Lane — panel rendering: paint both pictures, then draw the
   found-difference markers, the hint pulse and the wrong-click flashes
   on top of each panel, mirrored at the same coordinates. */

import { levelVariant } from './differences.js';

export function paintPanels(leftCtx, rightCtx, level, foundIds, hint, flashes, now) {
  level.painter(leftCtx, {});
  level.painter(rightCtx, levelVariant(level));
  for (const diff of level.differences) {
    if (foundIds.has(diff.id)) {
      drawFoundRing(leftCtx, diff, now);
      drawFoundRing(rightCtx, diff, now);
    }
  }
  if (hint) {
    const diff = level.differences.find((d) => d.id === hint.id);
    if (diff && !foundIds.has(diff.id)) {
      drawHintRing(leftCtx, diff, now);
      drawHintRing(rightCtx, diff, now);
    }
  }
  for (const flash of flashes) {
    drawWrongMark(flash.ctx === 'right' ? rightCtx : leftCtx, flash, now);
  }
}

export function drawFoundRing(ctx, diff, now) {
  const age = now - diff.foundAt;
  const pop = age < 180 ? 0.7 + (age / 180) * 0.3 : 1;
  const r = diff.r * pop;
  ctx.save();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ffd166';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#7a4a12';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  // Check mark inside the ring.
  ctx.strokeStyle = '#6ee7a0';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - r * 0.45, diff.y);
  ctx.lineTo(diff.x - r * 0.12, diff.y + r * 0.35);
  ctx.lineTo(diff.x + r * 0.5, diff.y - r * 0.35);
  ctx.stroke();
  ctx.restore();
}

export function drawHintRing(ctx, diff, now) {
  const pulse = 0.5 + 0.5 * Math.sin(now / 180);
  const r = diff.r + 4 + pulse * 6;
  ctx.save();
  ctx.strokeStyle = `rgba(255, 209, 102, ${0.55 + pulse * 0.45})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawWrongMark(ctx, flash, now) {
  const age = now - flash.at;
  if (age > 700) return;
  const alpha = 1 - age / 700;
  const s = 10 + age / 60;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(flash.x - s, flash.y - s);
  ctx.lineTo(flash.x + s, flash.y + s);
  ctx.moveTo(flash.x + s, flash.y - s);
  ctx.lineTo(flash.x - s, flash.y + s);
  ctx.stroke();
  ctx.restore();
}

export function pointInDifference(level, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const diff of level.differences) {
    const dist = Math.hypot(x - diff.x, y - diff.y);
    if (dist <= diff.r + 6 && dist < bestDist) {
      best = diff;
      bestDist = dist;
    }
  }
  return best;
}
