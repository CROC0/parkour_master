import { Player, Particle, GameEngineState, GameCallbacks } from "@/types";
import { CANVAS_WIDTH, GRAVITY, JUMP_FORCE, MOVE_SPEED, PLAYER_W, PLAYER_H, DEATH_Y } from "./constants";
import { CANVAS_HEIGHT, TOTAL_LEVELS } from "./levelGenerator";
import { audioManager } from "./audio";

export function makePlayer(x: number, y: number): Player {
  return {
    x,
    y,
    width: PLAYER_W,
    height: PLAYER_H,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: "right",
    animFrame: 0,
    animTimer: 0,
  };
}

export function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function spawnParticles(
  particles: Particle[],
  x: number,
  y: number,
  color: string,
  count: number,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 3 + Math.random() * 4,
    });
  }
}

export function updateGame(g: GameEngineState, callbacks: GameCallbacks): void {
  const now = performance.now();
  // dt: elapsed time normalised to a 60 fps frame (1.0 = one 60 fps frame).
  // Capped at 3 frames so a stalled tab doesn't teleport the player.
  const deltaMs = g.lastFrameTime > 0 ? now - g.lastFrameTime : 1000 / 60;
  const dt = Math.min(deltaMs / (1000 / 60), 3);
  g.lastFrameTime = now;
  g.timerMs += deltaMs;
  g.time += dt;
  const p = g.player;

  const moveLeft =
    g.keys.has("ArrowLeft") || g.keys.has("a") || g.keys.has("A") || g.touching.left;
  const moveRight =
    g.keys.has("ArrowRight") || g.keys.has("d") || g.keys.has("D") || g.touching.right;
  const jump =
    g.keys.has("ArrowUp") ||
    g.keys.has("w") ||
    g.keys.has("W") ||
    g.keys.has(" ") ||
    g.touching.jump;

  if (moveLeft) {
    p.vx = -MOVE_SPEED;
    p.facing = "left";
  } else if (moveRight) {
    p.vx = MOVE_SPEED;
    p.facing = "right";
  } else {
    p.vx *= Math.pow(0.7, dt);
  }

  if (jump && p.isGrounded) {
    p.vy = JUMP_FORCE;
    p.isGrounded = false;
    audioManager.jump();
    spawnParticles(g.particles, p.x + p.width / 2, p.y + p.height, "#A8E6CF", 6);
  }

  p.vy = Math.min(p.vy + GRAVITY * dt, 18);
  p.x += p.vx * dt;
  if (p.x < 0) {
    p.x = 0;
    p.vx = 0;
  }

  const wasGrounded = p.isGrounded;
  p.isGrounded = false;

  // X + Y collision
  for (const plat of g.platforms) {
    if (plat.type === "spike" || plat.type === "checkpoint" || plat.type === "finish") continue;
    if (!rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height))
      continue;

    const overlapLeft = p.x + p.width - plat.x;
    const overlapRight = plat.x + plat.width - p.x;
    const overlapTop = p.y + p.height - plat.y;
    const overlapBottom = plat.y + plat.height - p.y;
    const minH = Math.min(overlapLeft, overlapRight);
    const minV = Math.min(overlapTop, overlapBottom);

    if (minV < minH) {
      if (overlapTop < overlapBottom) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.isGrounded = true;
      } else {
        p.y = plat.y + plat.height;
        p.vy = Math.abs(p.vy) * 0.3;
      }
    } else {
      if (overlapLeft < overlapRight) p.x = plat.x - p.width;
      else p.x = plat.x + plat.width;
      p.vx = 0;
    }
  }

  p.y += p.vy * dt;

  for (const plat of g.platforms) {
    if (plat.type === "spike" || plat.type === "checkpoint" || plat.type === "finish") continue;
    if (!rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height))
      continue;

    const overlapTop = p.y + p.height - plat.y;
    const overlapBottom = plat.y + plat.height - p.y;

    if (overlapTop < overlapBottom && p.vy > 0) {
      p.y = plat.y - p.height;
      p.vy = 0;
      p.isGrounded = true;
    } else if (overlapBottom < overlapTop && p.vy < 0) {
      p.y = plat.y + plat.height;
      p.vy = Math.abs(p.vy) * 0.3;
    }
  }

  if (!wasGrounded && p.isGrounded) audioManager.land();

  // Spike collision
  for (const plat of g.platforms) {
    if (plat.type !== "spike") continue;
    if (
      rectsOverlap(
        p.x + 4,
        p.y + 4,
        p.width - 8,
        p.height - 4,
        plat.x,
        plat.y,
        plat.width,
        plat.height,
      )
    ) {
      spawnParticles(g.particles, p.x + p.width / 2, p.y + p.height / 2, "#E74C3C", 20);
      audioManager.death();
      callbacks.onDeath();
      return;
    }
  }

  // Enemy patrol update
  for (const e of g.enemies) {
    e.x += e.vx * dt;
    e.animTimer += dt;

    if (e.x <= e.patrolLeft) {
      e.x = e.patrolLeft;
      e.vx = Math.abs(e.vx);
    }
    if (e.x + e.width >= e.patrolRight) {
      e.x = e.patrolRight - e.width;
      e.vx = -Math.abs(e.vx);
    }

    // Flyers hover vertically
    if (e.kind === "flyer") {
      e.y = e.patrolBaseY + Math.sin(g.time * 0.05 + e.phase) * 10;
    }
  }

  // Enemy-player collision
  for (const e of g.enemies) {
    if (
      rectsOverlap(p.x + 4, p.y + 4, p.width - 8, p.height - 8, e.x, e.y, e.width, e.height)
    ) {
      spawnParticles(g.particles, p.x + p.width / 2, p.y + p.height / 2, "#E74C3C", 20);
      audioManager.death();
      callbacks.onDeath();
      return;
    }
  }

  // Checkpoint
  for (const plat of g.platforms) {
    if (plat.type !== "checkpoint") continue;
    if (rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) {
      if (plat.x > g.checkpointX) {
        g.checkpointX = p.x;
        g.checkpointY = p.y;
        g.score += 50;
        callbacks.onCheckpoint(g.score);
        spawnParticles(g.particles, plat.x + 15, plat.y, "#F39C12", 15);
        audioManager.checkpoint();
        plat.type = "solid";
        plat.height = 1;
        plat.width = 1;
        plat.y = -100;
      }
    }
  }

  // Finish flag collision — player must touch it to complete the level
  for (const plat of g.platforms) {
    if (plat.type !== "finish") continue;
    if (rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) {
      g.score += 200;
      spawnParticles(g.particles, plat.x + 20, plat.y + plat.height / 2, "#FFD700", 30);
      if (g.levelIndex + 1 >= TOTAL_LEVELS) {
        audioManager.gameComplete();
        callbacks.onGameComplete(g.score, g.timerMs);
      } else {
        audioManager.levelComplete();
        callbacks.onLevelComplete(g.score);
      }
      return;
    }
  }

  // Fall death
  if (p.y > DEATH_Y) {
    spawnParticles(g.particles, p.x + p.width / 2, CANVAS_HEIGHT - 20, "#3498DB", 20);
    audioManager.death();
    callbacks.onDeath();
    return;
  }

  if (p.isGrounded && Math.abs(p.vx) > 0.5) p.animTimer += dt;
  else if (!p.isGrounded) p.animTimer = 0;
  p.animFrame = p.animTimer;

  const targetCam = p.x - CANVAS_WIDTH * 0.35;
  g.cameraX += (targetCam - g.cameraX) * (1 - Math.pow(0.9, dt));
  if (g.cameraX < 0) g.cameraX = 0;

  g.particles = g.particles.filter((pt) => {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vy += 0.15 * dt;
    pt.life -= dt;
    return pt.life > 0;
  });
}
