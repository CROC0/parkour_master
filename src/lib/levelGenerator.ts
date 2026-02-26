import { Platform, Enemy } from "@/types";

export const CANVAS_HEIGHT = 450;
export const GROUND_Y = CANVAS_HEIGHT - 60;

const WALKER_W = 24;
const WALKER_H = 30;
const FLYER_W = 26;
const FLYER_H = 18;

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
  flyerChance: number; // 0 = all walkers, 1 = all flyers
  flyerSpeed: number;
}

const levelConfigs: LevelConfig[] = [
  //  1 – Tutorial: no spikes, no enemies, huge platforms
  { length: 2500, maxGap: 50, maxRise: 28, minPlatW: 180, maxPlatW: 300, spikeChance: 0.0, checkpointEvery: 400, enemyChance: 0, walkerSpeed: 0, flyerChance: 0, flyerSpeed: 0 },
  //  2 – Easy
  { length: 3000, maxGap: 60, maxRise: 35, minPlatW: 160, maxPlatW: 270, spikeChance: 0.03, checkpointEvery: 450, enemyChance: 0, walkerSpeed: 0, flyerChance: 0, flyerSpeed: 0 },
  //  3 – Easy+
  { length: 3500, maxGap: 70, maxRise: 45, minPlatW: 145, maxPlatW: 250, spikeChance: 0.06, checkpointEvery: 500, enemyChance: 0, walkerSpeed: 0, flyerChance: 0, flyerSpeed: 0 },
  //  4 – Medium
  { length: 4000, maxGap: 82, maxRise: 55, minPlatW: 130, maxPlatW: 230, spikeChance: 0.09, checkpointEvery: 560, enemyChance: 0, walkerSpeed: 0, flyerChance: 0, flyerSpeed: 0 },
  //  5 – Medium+
  { length: 4200, maxGap: 92, maxRise: 64, minPlatW: 115, maxPlatW: 210, spikeChance: 0.12, checkpointEvery: 610, enemyChance: 0, walkerSpeed: 0, flyerChance: 0, flyerSpeed: 0 },
  //  6 – Getting Tricky
  { length: 4600, maxGap: 102, maxRise: 72, minPlatW: 100, maxPlatW: 190, spikeChance: 0.15, checkpointEvery: 660, enemyChance: 0, walkerSpeed: 0, flyerChance: 0, flyerSpeed: 0 },
  //  7 – Hard (slow walkers introduced)
  { length: 5000, maxGap: 112, maxRise: 78, minPlatW: 90, maxPlatW: 175, spikeChance: 0.17, checkpointEvery: 710, enemyChance: 0.15, walkerSpeed: 0.9, flyerChance: 0, flyerSpeed: 0 },
  //  8 – Hard+ (flyers introduced)
  { length: 5200, maxGap: 120, maxRise: 84, minPlatW: 82, maxPlatW: 160, spikeChance: 0.2, checkpointEvery: 750, enemyChance: 0.22, walkerSpeed: 1.1, flyerChance: 0.15, flyerSpeed: 1.4 },
  //  9 – Very Hard
  { length: 5600, maxGap: 127, maxRise: 89, minPlatW: 76, maxPlatW: 148, spikeChance: 0.23, checkpointEvery: 790, enemyChance: 0.28, walkerSpeed: 1.3, flyerChance: 0.3, flyerSpeed: 1.8 },
  // 10 – Expert
  { length: 6000, maxGap: 135, maxRise: 95, minPlatW: 70, maxPlatW: 138, spikeChance: 0.26, checkpointEvery: 830, enemyChance: 0.35, walkerSpeed: 1.6, flyerChance: 0.4, flyerSpeed: 2.2 },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateLevel(levelIndex: number): { platforms: Platform[]; enemies: Enemy[] } {
  const cfg = levelConfigs[Math.min(levelIndex, levelConfigs.length - 1)];
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Wide starting ground
  platforms.push({ x: 0, y: GROUND_Y, width: 500, height: 60, type: "solid" });

  let curRight = 500;
  let curTop = GROUND_Y;
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
    platforms.push({ x: platX, y: newTop, width: platW, height: 20, type: "solid" });

    // Checkpoint — decide first so spikes/enemies can be skipped on this platform
    const hasCheckpoint = curRight > checkpointNext && platW >= 50;
    if (hasCheckpoint) {
      platforms.push({ x: platX + platW / 2 - 15, y: newTop - 40, width: 30, height: 40, type: "checkpoint" });
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
        platforms.push({ x: spikeX + s * 20, y: newTop - 20, width: 20, height: 20, type: "spike" });
      }
    }

    // Enemies — skip if spike already on platform, checkpoint platform, platform too narrow, or too close to start
    const FLYER_MARGIN = 50;
    const WALKER_MARGIN = 30;
    const flyerPatrolLeft = platX + FLYER_MARGIN;
    const flyerPatrolRight = platX + platW - FLYER_MARGIN;
    const wPatrolLeft = platX + WALKER_MARGIN;
    const wPatrolRight = platX + platW - WALKER_W - 4;
    const canSpawnFlyer = flyerPatrolRight - flyerPatrolLeft >= FLYER_W + 10;
    const canSpawnWalker = wPatrolRight > wPatrolLeft;

    if (cfg.enemyChance > 0 && !hadSpike && !hasCheckpoint && platX > 400 && platX < cfg.length - 200 && Math.random() < cfg.enemyChance) {
      const wantFlyer = Math.random() < cfg.flyerChance;

      if (wantFlyer && canSpawnFlyer) {
        const ew = FLYER_W;
        const eh = FLYER_H;
        const startX = platX + platW / 2 - ew / 2;
        const baseY = newTop - eh - 50;
        enemies.push({
          x: startX,
          y: baseY,
          width: ew,
          height: eh,
          vx: cfg.flyerSpeed,
          kind: "flyer",
          patrolLeft: flyerPatrolLeft,
          patrolRight: flyerPatrolRight,
          patrolBaseY: baseY,
          phase: Math.random() * Math.PI * 2,
          animTimer: 0,
        });
      } else if (canSpawnWalker) {
        const ew = WALKER_W;
        const eh = WALKER_H;
        const startX = platX + platW / 2 - ew / 2;
        const startY = newTop - eh;
        enemies.push({
          x: startX,
          y: startY,
          width: ew,
          height: eh,
          vx: cfg.walkerSpeed,
          kind: "walker",
          patrolLeft: wPatrolLeft,
          patrolRight: wPatrolRight,
          patrolBaseY: startY,
          phase: 0,
          animTimer: 0,
        });
      }
      // else: platform too narrow for safe placement — skip enemy
    }

    curRight = platX + platW;
    curTop = newTop;
  }

  // Final landing platform + finish flag
  const finX = cfg.length + 80;
  platforms.push({ x: finX, y: GROUND_Y, width: 300, height: 60, type: "solid" });
  platforms.push({ x: finX + 120, y: 0, width: 40, height: GROUND_Y, type: "finish" });

  return { platforms, enemies };
}

export function getLevelLength(levelIndex: number): number {
  return levelConfigs[Math.min(levelIndex, levelConfigs.length - 1)].length;
}

export const TOTAL_LEVELS = levelConfigs.length;
