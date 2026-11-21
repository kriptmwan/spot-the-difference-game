/* Lantern Lane — scene painters.
   Three original scenes drawn procedurally on a 600x440 canvas.
   Each painter takes (ctx, variant): variant flags flip one difference
   each, so the same painter draws the original panel (variant = {})
   and the changed panel (variant = the level's applied flags). */

export const PANEL_W = 600;
export const PANEL_H = 440;

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function cloud(ctx, x, y, s, fill = '#ffffff') {
  circle(ctx, x, y, 18 * s, fill);
  circle(ctx, x + 20 * s, y - 8 * s, 22 * s, fill);
  circle(ctx, x + 44 * s, y, 18 * s, fill);
  circle(ctx, x + 22 * s, y + 6 * s, 20 * s, fill);
}

export function flower(ctx, x, y, petal, center = '#ffd166') {
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 7, y + Math.sin(a) * 7, 6, petal);
  }
  circle(ctx, x, y, 5, center);
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
}

/* ---------------- Level 1: Sunny Park ---------------- */

export function paintPark(ctx, v) {
  // Sky and sun.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(1, '#cfeefc');
  rect(ctx, 0, 0, 600, 300, sky);
  if (!v.sunRays) {
    ctx.strokeStyle = '#ffcf3f';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(480 + Math.cos(a) * 34, 70 + Math.sin(a) * 34);
      ctx.lineTo(480 + Math.cos(a) * 48, 70 + Math.sin(a) * 48);
      ctx.stroke();
    }
  }
  circle(ctx, 480, 70, 30, '#ffd93b');
  circle(ctx, 472, 64, 4, '#7a4a12');
  circle(ctx, 488, 64, 4, '#7a4a12');
  ctx.strokeStyle = '#7a4a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(480, 74, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Clouds.
  cloud(ctx, 80, 60, 1);
  cloud(ctx, 300, 42, 0.8);
  if (v.cloudExtra) cloud(ctx, 520, 130, 0.7, '#f2f8ff');

  // Kite with tail.
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(250, 110);
  ctx.lineTo(210, 240);
  ctx.stroke();
  ctx.fillStyle = '#ef476f';
  ctx.beginPath();
  ctx.moveTo(250, 70);
  ctx.lineTo(285, 100);
  ctx.lineTo(250, 130);
  ctx.lineTo(215, 100);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(250, 130);
  ctx.lineTo(246, 168);
  ctx.stroke();
  if (!v.kiteTail) {
    circle(ctx, 246, 150, 5, '#ffd166');
    circle(ctx, 246, 168, 5, '#06d6a0');
  }

  // Hills, path and grass.
  ellipse(ctx, 300, 470, 420, 130, '#7ec850');
  ellipse(ctx, 60, 440, 260, 90, '#6db844');
  ctx.fillStyle = '#e8d29a';
  ctx.beginPath();
  ctx.moveTo(270, 440);
  ctx.bezierCurveTo(300, 360, 330, 330, 360, 300);
  ctx.lineTo(390, 300);
  ctx.bezierCurveTo(360, 340, 330, 380, 300, 440);
  ctx.closePath();
  ctx.fill();

  // Big tree on the left.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(112, 210, 22, 110);
  circle(ctx, 122, 185, 58, '#2f9e44');
  circle(ctx, 82, 210, 40, '#37b24d');
  circle(ctx, 164, 210, 42, '#37b24d');
  circle(ctx, 122, 150, 38, '#40c057');
  if (!v.apple) {
    circle(ctx, 148, 196, 8, '#e63946');
    circle(ctx, 96, 176, 8, '#e63946');
    circle(ctx, 128, 150, 8, '#e63946');
  } else {
    circle(ctx, 96, 176, 8, '#e63946');
    circle(ctx, 128, 150, 8, '#e63946');
  }

  // Pond with ducks, bottom left.
  ellipse(ctx, 150, 372, 110, 34, '#4dabf7');
  ellipse(ctx, 150, 366, 96, 26, '#74c0fc');
  ellipse(ctx, 118, 366, 20, 12, '#ffffff');
  circle(ctx, 128, 356, 8, '#ffffff');
  circle(ctx, 130, 354, 2, '#222');
  ctx.fillStyle = '#ffa94d';
  ctx.beginPath();
  ctx.moveTo(136, 356);
  ctx.lineTo(144, 359);
  ctx.lineTo(136, 362);
  ctx.closePath();
  ctx.fill();
  if (!v.duck2) {
    ellipse(ctx, 188, 382, 18, 11, '#fff3bf');
    circle(ctx, 198, 373, 7, '#fff3bf');
    circle(ctx, 200, 371, 2, '#222');
    ctx.fillStyle = '#ffa94d';
    ctx.beginPath();
    ctx.moveTo(205, 373);
    ctx.lineTo(212, 376);
    ctx.lineTo(205, 379);
    ctx.closePath();
    ctx.fill();
  }

  // Bench on the right.
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(400, 296, 130, 10);
  ctx.fillRect(400, 312, 130, 10);
  ctx.fillStyle = '#5c3a17';
  ctx.fillRect(408, 322, 10, 34);
  ctx.fillRect(512, 322, 10, 34);
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(400, 276, 10, 24);
  ctx.fillRect(520, 276, 10, 24);

  // Dog sitting by the bench.
  ellipse(ctx, 372, 338, 16, 14, '#c68a4b');
  circle(ctx, 384, 320, 11, '#c68a4b');
  ellipse(ctx, 392, 312, 6, 9, '#a06a32');
  circle(ctx, 388, 318, 2, '#222');
  ctx.strokeStyle = '#a06a32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(358, 344);
  ctx.quadraticCurveTo(344, 338, 348, 322);
  ctx.stroke();

  // Picnic basket and flowers.
  roundRect(ctx, 300, 372, 44, 26, 6, '#b08954');
  ctx.strokeStyle = '#7a5a2e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 384);
  ctx.lineTo(344, 384);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(322, 372, 14, Math.PI, 0);
  ctx.stroke();
  flower(ctx, 520, 396, v.flowerColor ? '#4dabf7' : '#e64980');
  flower(ctx, 556, 404, '#e64980');
  flower(ctx, 480, 408, '#ffd166');
  flower(ctx, 60, 404, '#e64980');
  flower(ctx, 30, 416, '#ffd166');

  // Butterfly.
  ctx.fillStyle = '#9775fa';
  ellipse(ctx, 232, 236, 8, 11, '#9775fa');
  ellipse(ctx, 248, 236, 8, 11, '#9775fa');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(240, 228);
  ctx.lineTo(240, 248);
  ctx.stroke();
}

/* ---------------- Level 2: Cozy Kitchen ---------------- */

export function paintKitchen(ctx, v) {
  // Walls, floor and rug.
  rect(ctx, 0, 0, 600, 300, '#f3d9b8');
  rect(ctx, 0, 300, 600, 140, '#a9805a');
  ctx.fillStyle = '#8a6a48';
  for (let y = 310; y < 440; y += 26) ctx.fillRect(0, y, 600, 3);
  roundRect(ctx, 210, 356, 180, 66, 10, v.rugStripe ? '#9775fa' : '#c2255c');
  roundRect(ctx, 226, 368, 148, 42, 8, '#ffe8cc');
  ctx.strokeStyle = '#c2255c';
  ctx.lineWidth = 3;
  ctx.strokeRect(226, 368, 148, 42);

  // Window with night sky, moon and stars.
  roundRect(ctx, 380, 40, 180, 150, 8, '#1b2a4a');
  ctx.fillStyle = '#2b4a7a';
  ctx.fillRect(386, 46, 168, 138);
  circle(ctx, 520, 80, 20, '#ffe9a8');
  circle(ctx, 512, 74, 16, '#2b4a7a');
  if (!v.starMissing) star(ctx, 420, 70, 7, '#ffffff');
  star(ctx, 452, 120, 6, '#ffffff');
  star(ctx, 500, 140, 6, '#ffffff');
  star(ctx, 470, 96, 5, '#ffd166');
  ctx.strokeStyle = '#f3d9b8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(470, 46);
  ctx.lineTo(470, 184);
  ctx.moveTo(386, 115);
  ctx.lineTo(554, 115);
  ctx.stroke();
  roundRect(ctx, 380, 40, 180, 150, 8, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#7a4a12';
  ctx.lineWidth = 5;
  ctx.strokeRect(380, 40, 180, 150);

  // Wall clock.
  circle(ctx, 90, 80, 38, '#fff8e7');
  ctx.strokeStyle = '#5c3a17';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(90, 80, 38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 80);
  ctx.lineTo(90, 56);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(90, 80);
  if (v.clockHands) ctx.lineTo(108, 92);
  else ctx.lineTo(108, 68);
  ctx.stroke();
  circle(ctx, 90, 80, 4, '#222');

  // Shelves with jars.
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(40, 150, 220, 10);
  ctx.fillRect(40, 230, 220, 10);
  const jarColors = ['#ffa94d', '#69db7c', '#74c0fc'];
  jarColors.forEach((c, i) => {
    const x = 60 + i * 62;
    roundRect(ctx, x, 112, 40, 38, 6, c);
    rect(ctx, x + 6, 104, 28, 10, '#5c3a17');
  });
  if (!v.jarMissing) {
    roundRect(ctx, 246, 112, 40, 38, 6, '#e599f7');
    rect(ctx, 252, 104, 28, 10, '#5c3a17');
  }
  roundRect(ctx, 60, 192, 40, 38, 6, '#ffe066');
  rect(ctx, 66, 184, 28, 10, '#5c3a17');
  roundRect(ctx, 122, 192, 40, 38, 6, '#ff8787');
  rect(ctx, 128, 184, 28, 10, '#5c3a17');
  roundRect(ctx, 184, 192, 40, 38, 6, '#b2f2bb');
  rect(ctx, 190, 184, 28, 10, '#5c3a17');

  // Hanging lamp.
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(330, 0);
  ctx.lineTo(330, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(300, 84);
  ctx.lineTo(360, 84);
  ctx.lineTo(330, 52);
  ctx.closePath();
  ctx.fillStyle = '#e8590c';
  ctx.fill();
  circle(ctx, 330, 92, 10, '#ffd166');

  // Table with fruit bowl and teapot.
  ctx.fillStyle = '#7a4a12';
  ctx.fillRect(300, 330, 260, 14);
  ctx.fillRect(320, 344, 14, 60);
  ctx.fillRect(526, 344, 14, 60);
  ellipse(ctx, 400, 322, 52, 14, '#9775fa');
  circle(ctx, 378, 312, 11, '#e63946');
  circle(ctx, 400, 306, 11, v.fruitSwap ? '#ff922b' : '#e63946');
  circle(ctx, 422, 312, 11, '#ffd43b');
  circle(ctx, 389, 310, 3, '#2f9e44');
  ellipse(ctx, 500, 316, 26, 18, '#4dabf7');
  ctx.fillStyle = '#4dabf7';
  ctx.beginPath();
  ctx.moveTo(522, 306);
  ctx.quadraticCurveTo(540, 306, 532, 322);
  ctx.quadraticCurveTo(524, 330, 520, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#364fc7';
  ctx.fillRect(478, 292, 10, 14);

  // Stove with kettle.
  roundRect(ctx, 40, 300, 150, 96, 8, '#495057');
  circle(ctx, 90, 330, 26, '#343a40');
  circle(ctx, 150, 330, 26, '#343a40');
  ctx.fillStyle = '#868e96';
  ctx.beginPath();
  ctx.moveTo(70, 322);
  ctx.quadraticCurveTo(70, 292, 100, 288);
  ctx.quadraticCurveTo(128, 290, 128, 314);
  ctx.lineTo(128, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#495057';
  ctx.fillRect(96, 280, 12, 10);
  if (!v.steamMissing) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 276);
    ctx.quadraticCurveTo(92, 262, 100, 250);
    ctx.quadraticCurveTo(108, 238, 100, 226);
    ctx.stroke();
  }

  // Cat asleep on the chair.
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(196, 300, 12, 96);
  ctx.fillRect(276, 300, 12, 96);
  ctx.fillRect(196, 300, 92, 12);
  ellipse(ctx, 242, 296, 42, 14, '#ffa94d');
  circle(ctx, 276, 288, 13, '#ffa94d');
  ctx.beginPath();
  ctx.moveTo(268, 278);
  ctx.lineTo(272, 266);
  ctx.lineTo(278, 277);
  ctx.closePath();
  ctx.fillStyle = '#ffa94d';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(280, 277);
  ctx.lineTo(286, 266);
  ctx.lineTo(290, 278);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8890c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(280, 288);
  ctx.lineTo(280, 292);
  ctx.stroke();
  if (!v.catTail) {
    ctx.strokeStyle = '#ffa94d';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(204, 300);
    ctx.quadraticCurveTo(188, 296, 192, 278);
    ctx.stroke();
  }

  // Windowsill plant.
  roundRect(ctx, 566, 168, 28, 22, 4, '#e8590c');
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(580, 168);
  ctx.lineTo(580, 140);
  ctx.moveTo(580, 156);
  ctx.lineTo(566, 146);
  ctx.moveTo(580, 156);
  ctx.lineTo(594, 146);
  ctx.stroke();
  if (!v.plantFlower) circle(ctx, 580, 136, 7, '#e64980');
}

/* ---------------- Level 3: Harbor at Dusk ---------------- */

export function paintHarbor(ctx, v) {
  // Dusk sky, stars and moon.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#1b2a4a');
  sky.addColorStop(0.6, '#7048a8');
  sky.addColorStop(1, '#ff9f43');
  rect(ctx, 0, 0, 600, 260, sky);
  circle(ctx, 530, 56, 24, '#ffe9a8');
  star(ctx, 80, 40, 6, '#ffffff');
  star(ctx, 180, 70, 5, '#ffffff');
  star(ctx, 300, 36, 6, '#ffffff');
  star(ctx, 420, 60, 5, '#ffffff');
  if (!v.starMissing) star(ctx, 250, 100, 6, '#ffd166');

  // Gulls.
  const gull = (x, y, s) => {
    ctx.strokeStyle = '#f8f9fa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y);
    ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
    ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
    ctx.stroke();
  };
  gull(140, 130, 1);
  if (!v.gullMissing) gull(220, 100, 0.9);
  gull(330, 140, 1.1);

  // Lighthouse on the cliff.
  ctx.fillStyle = '#5c3a17';
  ctx.beginPath();
  ctx.moveTo(40, 260);
  ctx.lineTo(110, 260);
  ctx.lineTo(100, 190);
  ctx.lineTo(50, 190);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f8f9fa';
  ctx.beginPath();
  ctx.moveTo(52, 190);
  ctx.lineTo(98, 190);
  ctx.lineTo(94, 120);
  ctx.lineTo(56, 120);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e63946';
  ctx.fillRect(54, 155, 42, 18);
  ctx.fillStyle = '#343a40';
  ctx.fillRect(58, 104, 34, 18);
  circle(ctx, 75, 113, 7, '#ffd166');
  ctx.beginPath();
  ctx.moveTo(52, 104);
  ctx.lineTo(98, 104);
  ctx.lineTo(75, 88);
  ctx.closePath();
  ctx.fillStyle = '#e63946';
  ctx.fill();
  if (!v.beamOff) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.28)';
    ctx.beginPath();
    ctx.moveTo(98, 113);
    ctx.lineTo(300, 84);
    ctx.lineTo(300, 142);
    ctx.lineTo(98, 113);
    ctx.closePath();
    ctx.fill();
  }

  // Sea.
  const sea = ctx.createLinearGradient(0, 260, 0, 440);
  sea.addColorStop(0, '#2b6cb0');
  sea.addColorStop(1, '#123a6b');
  rect(ctx, 0, 260, 600, 180, sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  [300, 340, 385].forEach((y, i) => {
    ctx.beginPath();
    for (let x = 20 + i * 40; x < 590; x += 90) {
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 15, y - 6, x + 30, y);
    }
    ctx.stroke();
  });

  // Boats.
  const boat = (x, y, s, sail, flag) => {
    ctx.fillStyle = '#7a4a12';
    ctx.beginPath();
    ctx.moveTo(x - 42 * s, y);
    ctx.lineTo(x + 42 * s, y);
    ctx.lineTo(x + 30 * s, y + 16 * s);
    ctx.lineTo(x - 30 * s, y + 16 * s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5c3a17';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 52 * s);
    ctx.stroke();
    ctx.fillStyle = sail;
    ctx.beginPath();
    ctx.moveTo(x, y - 50 * s);
    ctx.lineTo(x + 30 * s, y - 6 * s);
    ctx.lineTo(x, y - 6 * s);
    ctx.closePath();
    ctx.fill();
    if (flag) {
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(x, y - 52 * s);
      ctx.lineTo(x + 18 * s, y - 46 * s);
      ctx.lineTo(x, y - 40 * s);
      ctx.closePath();
      ctx.fill();
    }
  };
  boat(230, 320, 1, v.sailColor ? '#06d6a0' : '#f8f9fa', !v.flagMissing);
  boat(430, 352, 0.8, '#ffd166', true);
  boat(520, 300, 0.62, '#e599f7', true);

  // Jumping fish.
  if (!v.fishMissing) {
    ctx.strokeStyle = '#74c0fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(340, 372, 14, Math.PI, 0);
    ctx.stroke();
    ellipse(ctx, 340, 352, 10, 6, '#74c0fc');
    ctx.beginPath();
    ctx.moveTo(349, 352);
    ctx.lineTo(358, 346);
    ctx.lineTo(358, 358);
    ctx.closePath();
    ctx.fillStyle = '#74c0fc';
    ctx.fill();
  }

  // Buoy.
  ellipse(ctx, 150, 400, 16, 8, '#e63946');
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(138, 400);
  ctx.lineTo(162, 400);
  ctx.lineTo(156, 384);
  ctx.lineTo(144, 384);
  ctx.closePath();
  ctx.fill();
  if (!v.buoyStripe) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(140, 392, 20, 5);
  }
  circle(ctx, 150, 380, 3, '#ffd166');

  // Dock with crates, lanterns and rope.
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(0, 396, 600, 44);
  ctx.fillStyle = '#6b4423';
  for (let x = 0; x < 600; x += 46) ctx.fillRect(x, 396, 4, 44);
  ctx.fillStyle = '#b08954';
  ctx.fillRect(470, 356, 40, 40);
  ctx.strokeStyle = '#7a5a2e';
  ctx.lineWidth = 2;
  ctx.strokeRect(470, 356, 40, 40);
  ctx.beginPath();
  ctx.moveTo(470, 376);
  ctx.lineTo(510, 376);
  ctx.moveTo(490, 356);
  ctx.lineTo(490, 396);
  ctx.stroke();
  if (!v.crateMissing) {
    ctx.fillStyle = '#b08954';
    ctx.fillRect(514, 364, 32, 32);
    ctx.strokeRect(514, 364, 32, 32);
  }
  // Lanterns on posts.
  const lantern = (x, lit) => {
    ctx.fillStyle = '#343a40';
    ctx.fillRect(x - 3, 352, 6, 44);
    roundRect(ctx, x - 10, 330, 20, 24, 4, '#343a40');
    if (lit) {
      circle(ctx, x, 342, 7, '#ffd166');
      ctx.fillStyle = 'rgba(255, 209, 102, 0.25)';
      ctx.beginPath();
      ctx.arc(x, 342, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  lantern(60, true);
  lantern(560, !v.lanternDark);
  // Rope coil.
  if (!v.ropeMissing) {
    ctx.strokeStyle = '#d9b380';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(120, 386, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(120, 386, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
}
