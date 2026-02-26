import { Platform, Enemy } from '@/types';

export const CANVAS_HEIGHT = 450;
export const GROUND_Y = CANVAS_HEIGHT - 60;

const WALKER_W = 24;
const WALKER_H = 30;
const FLYER_W  = 26;
const FLYER_H  = 18;

interface LevelConfig {
  length: number;
  maxGap: number;
  maxRise: number;
  minPlatW: number;
  maxPlatW: number;
  spikeChance: number;
  checkpointEvery: number;
  enemyChance: number;
  walkerSpeed: number;
  flyerChance: number;  // 0 = all walkers, 1 = all flyers
  flyerSpeed: number;
}

const levelConfigs: LevelConfig[] = [
  // 1 – Easy
  { length: 3000, maxGap: 60,  maxRise: 40,  minPlatW: 150, maxPlatW: 260, spikeChance: 0.04, checkpointEvery: 500,  enemyChance: 0,    walkerSpeed: 0,   flyerChance: 0,    flyerSpeed: 0   },
  // 2 – Medium
  { length: 3800, maxGap: 80,  maxRise: 55,  minPlatW: 120, maxPlatW: 220, spikeChance: 0.10, checkpointEvery: 600,  enemyChance: 0,    walkerSpeed: 0,   flyerChance: 0,    flyerSpeed: 0   },
  // 3 – Getting Tricky
  { length: 4500, maxGap: 100, maxRise: 70,  minPlatW: 100, maxPlatW: 190, spikeChance: 0.15, checkpointEvery: 700,  enemyChance: 0,    walkerSpeed: 0,   flyerChance: 0,    flyerSpeed: 0   },
  // 4 – Hard (walkers introduced)
  { length: 5000, maxGap: 115, maxRise: 80,  minPlatW: 90,  maxPlatW: 170, spikeChance: 0.18, checkpointEvery: 750,  enemyChance: 0.20, walkerSpeed: 1.0, flyerChance: 0,    flyerSpeed: 0   },
  // 5 – Very Hard (walkers + flyers appear)
  { length: 5500, maxGap: 125, maxRise: 88,  minPlatW: 80,  maxPlatW: 155, spikeChance: 0.22, checkpointEvery: 800,  enemyChance: 0.28, walkerSpeed: 1.3, flyerChance: 0.20, flyerSpeed: 1.6 },
  // 6 – Expert
  { length: 6000, maxGap: 135, maxRise: 95,  minPlatW: 72,  maxPlatW: 140, spikeChance: 0.26, checkpointEvery: 850,  enemyChance: 0.35, walkerSpeed: 1.6, flyerChance: 0.40, flyerSpeed: 2.2 },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateLevel(levelIndex: number): { platforms: Platform[]; enemies: Enemy[] } {
  const cfg = levelConfigs[Math.min(levelIndex, levelConfigs.length - 1)];
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Wide starting ground
  platforms.push({ x: 0, y: GROUND_Y, width: 500, height: 60, type: 'solid' });

  let curRight = 500;
  let curTop   = GROUND_Y;
  let checkpointNext = cfg.checkpointEvery;
  let prevGapWasLarge = false;

  while (curRight < cfg.length) {
    // Gap
    const gapMax = prevGapWasLarge ? cfg.maxGap * 0.55 : cfg.maxGap;
    const gap = rand(30, gapMax);
    prevGapWasLarge = gap > cfg.maxGap * 0.65;

    // Height change
    const riseLimit = cfg.maxRise * (1 - gap / (cfg.maxGap * 1.5));
    const rise = rand(-90, riseLimit);
    const newTop = Math.max(GROUND_Y - 230, Math.min(GROUND_Y, curTop + rise));

    // Platform
    const platW = rand(cfg.minPlatW, cfg.maxPlatW);
    const platX = curRight + gap;
    platforms.push({ x: platX, y: newTop, width: platW, height: 20, type: 'solid' });

    // Checkpoint — decide first so spikes/enemies can be skipped on this platform
    const hasCheckpoint = curRight > checkpointNext && platW >= 50;
    if (hasCheckpoint) {
      platforms.push({ x: platX + platW / 2 - 15, y: newTop - 40, width: 30, height: 40, type: 'checkpoint' });
      checkpointNext += cfg.checkpointEvery;
    }

    // Spikes — skip on checkpoint platforms so the respawn point is safe
    let hadSpike = false;
    if (!hasCheckpoint && Math.random() < cfg.spikeChance && platW > 80) {
      hadSpike = true;
      const maxSpikes = Math.floor((platW - 60) / 20);
      const spikeCount = 1 + Math.floor(Math.random() * Math.min(2, maxSpikes));
      const spikeX = platX + 20 + rand(0, platW - 40 - spikeCount * 20);
      for (let s = 0; s < spikeCount; s++) {
        platforms.push({ x: spikeX + s * 20, y: newTop - 20, width: 20, height: 20, type: 'spike' });
      }
    }

    // Enemies — skip if spike already on platform, checkpoint platform, platform too narrow, or too close to start
    const minPatrol = WALKER_W + 8;
    if (
      cfg.enemyChance > 0 &&
      !hadSpike &&
      !hasCheckpoint &&
      platW >= minPatrol + 8 &&
      platX > 400 &&
      platX < cfg.length - 200 &&
      Math.random() < cfg.enemyChance
    ) {
      // Flyers need a 50px safe zone on each edge so the player can always land and wait
      const FLYER_MARGIN = 50;
      const flyerPatrolLeft  = platX + FLYER_MARGIN;
      const flyerPatrolRight = platX + platW - FLYER_MARGIN;
      const isFlyer = Math.random() < cfg.flyerChance && flyerPatrolRight - flyerPatrolLeft >= FLYER_W + 10;

      if (isFlyer) {
        const ew = FLYER_W;
        const eh = FLYER_H;
        const startX = platX + platW / 2 - ew / 2;
        const baseY  = newTop - eh - 50;
        enemies.push({
          x: startX, y: baseY,
          width: ew, height: eh,
          vx: cfg.flyerSpeed,
          kind: 'flyer',
          patrolLeft:  flyerPatrolLeft,
          patrolRight: flyerPatrolRight,
          patrolBaseY: baseY,
          phase: Math.random() * Math.PI * 2,
          animTimer: 0,
        });
      } else {
        const ew = WALKER_W;
        const eh = WALKER_H;
        const startX = platX + platW / 2 - ew / 2;
        const startY = newTop - eh;
        enemies.push({
          x: startX, y: startY,
          width: ew, height: eh,
          vx: cfg.walkerSpeed,
          kind: 'walker',
          patrolLeft:  platX + 4,
          patrolRight: platX + platW - ew - 4,
          patrolBaseY: startY,
          phase: 0,
          animTimer: 0,
        });
      }
    }

    curRight = platX + platW;
    curTop   = newTop;
  }

  // Final landing platform + finish flag
  const finX = cfg.length + 80;
  platforms.push({ x: finX, y: GROUND_Y, width: 300, height: 60, type: 'solid' });
  platforms.push({ x: finX + 120, y: 0, width: 40, height: GROUND_Y, type: 'finish' });

  return { platforms, enemies };
}

export function getLevelLength(levelIndex: number): number {
  return levelConfigs[Math.min(levelIndex, levelConfigs.length - 1)].length;
}

export const TOTAL_LEVELS = levelConfigs.length;
