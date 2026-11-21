/* Lantern Lane — difference definitions and level configs.
   Each difference names the spot (x, y, radius on the 600x440 panel),
   a short label for the log, and the variant flag its painter checks.
   The left panel is painted with {} (the original); the right panel
   with the level's flags merged (the changed picture). */

import { paintPark, paintKitchen, paintHarbor } from './scenes.js';

export const LEVELS = [
  {
    name: 'Sunny Park',
    blurb: 'A lazy afternoon in the park. Five small things changed — find them all before the sun sets.',
    painter: paintPark,
    timeLimit: 180,
    hints: 3,
    differences: [
      { id: 'duck2', x: 195, y: 375, r: 24, label: 'a duck vanished from the pond', flags: { duck2: true } },
      { id: 'sunrays', x: 480, y: 70, r: 42, label: 'the sun lost its rays', flags: { sunRays: true } },
      { id: 'tulip', x: 520, y: 396, r: 17, label: 'a tulip changed colour', flags: { flowerColor: true } },
      { id: 'kite', x: 246, y: 158, r: 22, label: 'the kite lost its tail bows', flags: { kiteTail: true } },
      { id: 'apple', x: 148, y: 196, r: 15, label: 'an apple fell off the tree', flags: { apple: true } },
    ],
  },
  {
    name: 'Cozy Kitchen',
    blurb: 'Tea is on and the cat is asleep. Seven quiet changes hide in this kitchen — hunt them down.',
    painter: paintKitchen,
    timeLimit: 150,
    hints: 3,
    differences: [
      { id: 'clock', x: 90, y: 80, r: 36, label: 'the clock hands moved', flags: { clockHands: true } },
      { id: 'jar', x: 266, y: 130, r: 26, label: 'a jar went missing from the shelf', flags: { jarMissing: true } },
      { id: 'fruit', x: 400, y: 306, r: 15, label: 'an apple turned into an orange', flags: { fruitSwap: true } },
      { id: 'star', x: 420, y: 70, r: 13, label: 'a star blinked out of the window', flags: { starMissing: true } },
      { id: 'steam', x: 100, y: 250, r: 22, label: 'the kettle stopped steaming', flags: { steamMissing: true } },
      { id: 'cattail', x: 196, y: 290, r: 20, label: 'the cat tucked its tail away', flags: { catTail: true } },
      { id: 'plant', x: 580, y: 136, r: 13, label: 'the plant lost its flower', flags: { plantFlower: true } },
    ],
  },
  {
    name: 'Harbor at Dusk',
    blurb: 'Lanterns are lit and the boats are in. Ten differences ride the evening tide — the hardest hunt of all.',
    painter: paintHarbor,
    timeLimit: 120,
    hints: 3,
    differences: [
      { id: 'beam', x: 200, y: 113, r: 34, label: 'the lighthouse beam went dark', flags: { beamOff: true } },
      { id: 'gull', x: 220, y: 100, r: 22, label: 'a gull flew away', flags: { gullMissing: true } },
      { id: 'sail', x: 240, y: 300, r: 28, label: 'a sail changed colour', flags: { sailColor: true } },
      { id: 'flag', x: 238, y: 273, r: 17, label: 'a boat lost its flag', flags: { flagMissing: true } },
      { id: 'fish', x: 340, y: 355, r: 22, label: 'the jumping fish is gone', flags: { fishMissing: true } },
      { id: 'buoy', x: 150, y: 394, r: 15, label: 'the buoy lost its stripe', flags: { buoyStripe: true } },
      { id: 'crate', x: 530, y: 380, r: 22, label: 'a crate disappeared from the dock', flags: { crateMissing: true } },
      { id: 'lantern', x: 560, y: 342, r: 17, label: 'a lantern went out', flags: { lanternDark: true } },
      { id: 'rope', x: 120, y: 386, r: 22, label: 'the rope coil is gone', flags: { ropeMissing: true } },
      { id: 'harborstar', x: 250, y: 100, r: 13, label: 'a star faded from the sky', flags: { starMissing: true } },
    ],
  },
];

export function levelVariant(level) {
  const variant = {};
  for (const d of level.differences) Object.assign(variant, d.flags);
  return variant;
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
