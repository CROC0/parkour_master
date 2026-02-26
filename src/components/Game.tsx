'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Player, Platform, Particle, Enemy, Question, GameState } from '@/types';
import { generateLevel, getLevelLength, CANVAS_HEIGHT, GROUND_Y, TOTAL_LEVELS } from '@/lib/levelGenerator';
import { getRandomQuestion } from '@/lib/questions';

// ─── Constants ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH = 800;
const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const MOVE_SPEED = 4.5;
const PLAYER_W = 28;
const PLAYER_H = 44;
const DEATH_Y = CANVAS_HEIGHT + 80;

const LS_KEY = 'parkour_master_profile';

// ─── Skin config ──────────────────────────────────────────────────────────────
interface PlayerSkin {
  name: string;
  shirtColor: string;
  pantsColor: string;
}

const DEFAULT_SKIN: PlayerSkin = { name: '', shirtColor: '#FF6B35', pantsColor: '#2C3E50' };

const SHIRT_COLORS = [
  '#FF6B35', '#E74C3C', '#3498DB', '#2ECC71',
  '#9B59B6', '#FF69B4', '#F1C40F', '#1ABC9C',
  '#ECF0F1', '#E67E22',
];

const PANTS_COLORS = [
  '#2C3E50', '#1a1a1a', '#1E5B2A', '#8B4513', '#7F8C8D',
];

// ─── Leaderboard ──────────────────────────────────────────────────────────────
interface LeaderboardEntry { id: number; name: string; time_ms: number; year_level: number; }

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const SB_HDRS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!SB_URL) return [];
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/leaderboard?select=id,name,time_ms,year_level&order=time_ms.asc&limit=10`,
      { headers: SB_HDRS }
    );
    return res.ok ? res.json() : [];
  } catch { return []; }
}

async function submitToLeaderboard(name: string, timeMs: number, yearLevel: number): Promise<number | null> {
  if (!SB_URL) return null;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/leaderboard`, {
      method: 'POST',
      headers: { ...SB_HDRS, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ name: name.slice(0, 20), time_ms: timeMs, year_level: yearLevel }),
    });
    if (!res.ok) return null;
    const [row] = await res.json() as LeaderboardEntry[];
    return row?.id ?? null;
  } catch { return null; }
}

function formatTime(ms: number): string {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}.${Math.floor((s % 1) * 10)}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makePlayer(x: number, y: number): Player {
  return { x, y, width: PLAYER_W, height: PLAYER_H, vx: 0, vy: 0, isGrounded: false, facing: 'right', animFrame: 0, animTimer: 0 };
}

function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function spawnParticles(particles: Particle[], x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
      life: 30 + Math.random() * 20, maxLife: 50, color, size: 3 + Math.random() * 4,
    });
  }
}

// ─── Drawing ──────────────────────────────────────────────────────────────────
function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, camX: number, shirtColor: string, pantsColor: string) {
  const sx = p.x - camX;
  const sy = p.y;
  ctx.save();
  if (p.facing === 'left') {
    ctx.translate(sx + p.width / 2, sy + p.height / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(p.width / 2), -(p.height / 2));
  } else {
    ctx.translate(sx, sy);
  }

  // Body / shirt
  ctx.fillStyle = shirtColor;
  ctx.fillRect(4, 14, 20, 22);

  // Head
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(5, 2, 18, 16);

  // Eyes
  ctx.fillStyle = '#333';
  ctx.fillRect(10, 7, 4, 4);
  ctx.fillRect(16, 7, 4, 4);

  // Mouth smile
  ctx.fillStyle = '#333';
  ctx.fillRect(11, 14, 8, 2);

  // Legs / pants (animated)
  const legOffset = p.isGrounded ? Math.sin(p.animFrame * 0.3) * 5 : 0;
  ctx.fillStyle = pantsColor;
  ctx.fillRect(5, 36, 9, 8 + (p.isGrounded ? legOffset : 0));
  ctx.fillRect(16, 36, 9, 8 - (p.isGrounded ? legOffset : 0));

  // Arms (shirt colour)
  ctx.fillStyle = shirtColor;
  const armOffset = p.isGrounded ? Math.sin(p.animFrame * 0.3 + Math.PI) * 5 : -4;
  ctx.fillRect(0, 15 + armOffset, 5, 12);
  ctx.fillRect(23, 15 - armOffset, 5, 12);

  ctx.restore();
}

function drawPlatform(ctx: CanvasRenderingContext2D, plat: Platform, camX: number, time: number) {
  const sx = plat.x - camX;
  if (sx + plat.width < -10 || sx > CANVAS_WIDTH + 10) return;

  if (plat.type === 'solid') {
    ctx.fillStyle = '#2ECC71';
    ctx.fillRect(sx, plat.y, plat.width, 8);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(sx, plat.y + 8, plat.width, plat.height - 8);
    ctx.fillStyle = '#27AE60';
    for (let i = 8; i < plat.width - 8; i += 16) {
      ctx.fillRect(sx + i, plat.y + 2, 4, 4);
    }
  } else if (plat.type === 'spike') {
    const glow = Math.sin(time * 0.05) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(231,76,60,${glow})`;
    const sCount = Math.floor(plat.width / 20);
    for (let i = 0; i < sCount; i++) {
      const tx = sx + i * 20;
      ctx.beginPath();
      ctx.moveTo(tx, plat.y + plat.height);
      ctx.lineTo(tx + 10, plat.y);
      ctx.lineTo(tx + 20, plat.y + plat.height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(sx, plat.y + plat.height - 3, plat.width, 3);
  } else if (plat.type === 'checkpoint') {
    ctx.fillStyle = '#7F8C8D';
    ctx.fillRect(sx + 12, plat.y, 4, plat.height);
    const flagWave = Math.sin(time * 0.08) * 3;
    ctx.fillStyle = '#F39C12';
    ctx.beginPath();
    ctx.moveTo(sx + 16, plat.y + 2);
    ctx.lineTo(sx + 16 + 14 + flagWave, plat.y + 8);
    ctx.lineTo(sx + 16, plat.y + 16);
    ctx.closePath();
    ctx.fill();
  } else if (plat.type === 'finish') {
    // The bounding box spans full canvas height so the flag can't be jumped over.
    // All visuals are anchored at the bottom of the box (ground level).
    const groundY = plat.y + plat.height; // = GROUND_Y
    const poleTop = groundY - 72;

    // Glowing aura
    const glow = Math.sin(time * 0.06) * 0.4 + 0.6;
    ctx.save();
    ctx.globalAlpha = glow * 0.35;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(sx + 20, poleTop + 30, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Pole
    ctx.fillStyle = '#BDC3C7';
    ctx.fillRect(sx + 18, poleTop, 4, 72);

    // Checkered flag (4×3 grid), anchored at top of pole
    const fw = 22;
    const fh = 18;
    const fx = sx + 22;
    const fy = poleTop + 2;
    const colors = ['#FFF', '#222'];
    const cols = 4;
    const rows = 3;
    const cw = fw / cols;
    const ch = fh / rows;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wave = Math.sin(time * 0.1 + col * 0.7) * Math.sin(time * 0.1) * 4 * (col / cols);
        ctx.fillStyle = colors[(row + col) % 2];
        ctx.fillRect(fx + col * cw, fy + row * ch + wave, cw + 0.5, ch + 0.5);
      }
    }

    // Pulsing gold star above the pole
    const starPulse = 1 + Math.sin(time * 0.1) * 0.15;
    ctx.save();
    ctx.translate(sx + 20, poleTop - 10);
    ctx.scale(starPulse, starPulse);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      if (i === 0) ctx.moveTo(Math.cos(outerAngle) * 8, Math.sin(outerAngle) * 8);
      else ctx.lineTo(Math.cos(outerAngle) * 8, Math.sin(outerAngle) * 8);
      ctx.lineTo(Math.cos(innerAngle) * 4, Math.sin(innerAngle) * 4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // "FINISH" label below pole
    ctx.save();
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 3;
    ctx.fillText('FINISH', sx + 20, groundY + 12);
    ctx.restore();
  }
}

// ─── Background themes ────────────────────────────────────────────────────────
const STARS = (() => {
  const out: { x: number; y: number; size: number }[] = [];
  let s = 42;
  const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  for (let i = 0; i < 60; i++) out.push({ x: rng() * CANVAS_WIDTH, y: rng() * CANVAS_HEIGHT * 0.7, size: 0.5 + rng() * 1.5 });
  return out;
})();

interface BgTheme { skyTop: string; skyBot: string; cloudColor: string; mountainColor: string; stars: boolean; moon: boolean; }
const BG_THEMES: BgTheme[] = [
  { skyTop: '#C0628A', skyBot: '#FFB07C', cloudColor: 'rgba(255,210,200,0.80)', mountainColor: 'rgba(120,60,80,0.50)',  stars: false, moon: false }, //  1 Tutorial  – sunrise
  { skyTop: '#5BA8D4', skyBot: '#C8E8F8', cloudColor: 'rgba(255,255,255,0.85)', mountainColor: 'rgba(80,120,180,0.40)', stars: false, moon: false }, //  2 Easy      – early morning
  { skyTop: '#3E8FCC', skyBot: '#A8D8F0', cloudColor: 'rgba(255,255,240,0.82)', mountainColor: 'rgba(55,95,175,0.42)',  stars: false, moon: false }, //  3 Easy+     – morning
  { skyTop: '#1A6BAF', skyBot: '#87CEEB', cloudColor: 'rgba(255,255,255,0.75)', mountainColor: 'rgba(40,80,160,0.45)',  stars: false, moon: false }, //  4 Medium    – midday
  { skyTop: '#4A8FCC', skyBot: '#B0D8EE', cloudColor: 'rgba(255,252,220,0.78)', mountainColor: 'rgba(60,100,190,0.45)', stars: false, moon: false }, //  5 Medium+   – afternoon
  { skyTop: '#E08030', skyBot: '#F5C030', cloudColor: 'rgba(255,185,105,0.75)', mountainColor: 'rgba(140,52,16,0.55)',  stars: false, moon: false }, //  6 Tricky    – golden hour
  { skyTop: '#7E1630', skyBot: '#D44A18', cloudColor: 'rgba(210,108,68,0.65)',  mountainColor: 'rgba(50,8,18,0.65)',    stars: false, moon: false }, //  7 Hard      – sunset
  { skyTop: '#3A0A50', skyBot: '#8B2040', cloudColor: 'rgba(160,80,140,0.55)',  mountainColor: 'rgba(35,5,45,0.72)',    stars: false, moon: false }, //  8 Hard+     – dusk
  { skyTop: '#160840', skyBot: '#4E1880', cloudColor: 'rgba(130,65,200,0.40)',  mountainColor: 'rgba(22,6,42,0.78)',    stars: true,  moon: false }, //  9 Very Hard – twilight
  { skyTop: '#020208', skyBot: '#08082A', cloudColor: 'rgba(22,22,65,0.35)',    mountainColor: 'rgba(5,5,18,0.95)',     stars: true,  moon: true  }, // 10 Expert    – deep night
];

function drawBackground(ctx: CanvasRenderingContext2D, camX: number, time: number, levelIndex: number) {
  const bg = BG_THEMES[Math.min(levelIndex, BG_THEMES.length - 1)];

  // Sky
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, bg.skyTop);
  grad.addColorStop(1, bg.skyBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Sun (levels 0–7, rises then sets, getting redder each level)
  if (levelIndex <= 7) {
    const suns = [
      { px: 0.15, py: 220, r: 30, body: '#FF8C5A', glow: 'rgba(255,140,90,'  }, //  1 sunrise – low left, orange-pink
      { px: 0.82, py: 65,  r: 26, body: '#FFE060', glow: 'rgba(255,220,60,'  }, //  2 early morning – upper right, warm yellow
      { px: 0.80, py: 50,  r: 24, body: '#FFE840', glow: 'rgba(255,240,80,'  }, //  3 morning – upper right, bright yellow
      { px: 0.50, py: 36,  r: 22, body: '#FFF0A0', glow: 'rgba(255,245,150,' }, //  4 midday – top centre, white-yellow
      { px: 0.78, py: 58,  r: 24, body: '#FFC020', glow: 'rgba(255,190,30,'  }, //  5 afternoon – upper right, golden
      { px: 0.12, py: 115, r: 32, body: '#FF8010', glow: 'rgba(255,120,10,'  }, //  6 golden hour – right side, orange
      { px: 0.08, py: 225, r: 38, body: '#CC2200', glow: 'rgba(180,20,0,'    }, //  7 sunset – low right, deep red
      { px: 0.88, py: 345, r: 45, body: '#6B0000', glow: 'rgba(100,0,0,'     }, //  8 dusk – below mountains, barely visible
    ];
    const sun = suns[Math.min(levelIndex, 3)];
    const sunX = CANVAS_WIDTH * sun.px;
    const sunGrad = ctx.createRadialGradient(sunX, sun.py, 0, sunX, sun.py, sun.r * 2.5);
    sunGrad.addColorStop(0, sun.glow + '0.35)');
    sunGrad.addColorStop(1, sun.glow + '0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath(); ctx.arc(sunX, sun.py, sun.r * 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = sun.body;
    ctx.beginPath(); ctx.arc(sunX, sun.py, sun.r, 0, Math.PI * 2); ctx.fill();
  }

  // Stars (levels 4–5)
  if (bg.stars) {
    for (const star of STARS) {
      const alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.04 + star.x * 0.3));
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Moon (level 5)
  if (bg.moon) {
    const moonX = CANVAS_WIDTH * 0.78;
    const moonY = 52;
    const moonR = 22;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 2.5);
    moonGlow.addColorStop(0, 'rgba(255,255,200,0.22)');
    moonGlow.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFAE0';
    ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(190,180,140,0.45)';
    ctx.beginPath(); ctx.arc(moonX - 7, moonY + 4,  5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 9, moonY - 5,  4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 2, moonY + 10, 3, 0, Math.PI * 2); ctx.fill();
  }

  // Clouds
  ctx.fillStyle = bg.cloudColor;
  const cloudOffsets = [
    { bx: 100, y: 60, w: 100 }, { bx: 400, y: 40, w: 130 }, { bx: 700, y: 75, w: 90 },
    { bx: 1100, y: 50, w: 120 }, { bx: 1500, y: 35, w: 110 }, { bx: 1900, y: 65, w: 95 }, { bx: 2300, y: 45, w: 105 },
  ];
  for (const c of cloudOffsets) {
    const cx = ((c.bx - camX * 0.3) % (CANVAS_WIDTH + 200) + CANVAS_WIDTH + 200) % (CANVAS_WIDTH + 200) - 100;
    ctx.beginPath();
    ctx.arc(cx, c.y, c.w * 0.4, 0, Math.PI * 2);
    ctx.arc(cx + c.w * 0.3, c.y - 10, c.w * 0.3, 0, Math.PI * 2);
    ctx.arc(cx + c.w * 0.6, c.y, c.w * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mountains
  ctx.fillStyle = bg.mountainColor;
  const mOffsets = [0, 300, 600, 900, 1200];
  for (const mo of mOffsets) {
    const mx = ((mo - camX * 0.5) % 1500 + 1500) % 1500;
    ctx.beginPath();
    ctx.moveTo(mx, CANVAS_HEIGHT - 60);
    ctx.lineTo(mx + 150, CANVAS_HEIGHT - 180);
    ctx.lineTo(mx + 300, CANVAS_HEIGHT - 60);
    ctx.closePath();
    ctx.fill();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], camX: number) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - camX - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number, level: number, levelProgress: number, levelLength: number,
  lives: number, playerName: string, timerMs: number
) {
  // Progress bar
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(10, 10, 300, 18);
  const pct = Math.min(levelProgress / levelLength, 1);
  ctx.fillStyle = '#F39C12';
  ctx.fillRect(10, 10, 300 * pct, 18);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 300, 18);

  // Finish flag icon
  ctx.fillStyle = '#27AE60';
  ctx.fillRect(314, 10, 6, 18);
  ctx.fillStyle = '#F39C12';
  ctx.beginPath();
  ctx.moveTo(320, 11); ctx.lineTo(333, 17); ctx.lineTo(320, 23);
  ctx.closePath(); ctx.fill();

  ctx.shadowColor = '#000';
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, 50);
  ctx.fillText(`Level ${level + 1}`, 10, 68);

  // Player name tag
  if (playerName) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(CANVAS_WIDTH / 2 - 60, 8, 120, 22);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(playerName, CANVAS_WIDTH / 2, 24);
  }

  // Hearts
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
  for (let i = 0; i < lives; i++) {
    ctx.fillStyle = '#E74C3C';
    ctx.font = '20px Arial';
    ctx.fillText('♥', CANVAS_WIDTH - 30 - i * 28, 32);
  }

  // Timer
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 3;
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(formatTime(timerMs), CANVAS_WIDTH - 10, 56);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}

// ─── Enemy drawing ────────────────────────────────────────────────────────────
function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[], camX: number, time: number) {
  for (const e of enemies) {
    const sx = e.x - camX;
    if (sx + e.width < -10 || sx > CANVAS_WIDTH + 10) continue;

    ctx.save();

    if (e.kind === 'walker') {
      const facingLeft = e.vx < 0;
      if (facingLeft) {
        ctx.translate(sx + e.width / 2, 0);
        ctx.scale(-1, 1);
        ctx.translate(-e.width / 2, 0);
      } else {
        ctx.translate(sx, 0);
      }

      const sy = e.y;
      const legAnim = Math.sin(e.animTimer * 0.25) * 5;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(e.width / 2, sy + e.height + 3, e.width * 0.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = '#6B0000';
      ctx.fillRect(3,  sy + e.height - 10 + legAnim,  8, 10);
      ctx.fillRect(13, sy + e.height - 10 - legAnim, 8, 10);

      // Body
      ctx.fillStyle = '#C0392B';
      ctx.fillRect(1, sy + 10, e.width - 2, e.height - 18);

      // Head
      ctx.fillStyle = '#E74C3C';
      ctx.fillRect(2, sy, e.width - 4, 14);

      // Horns
      ctx.fillStyle = '#922B21';
      ctx.fillRect(4, sy - 6, 4, 7);
      ctx.fillRect(16, sy - 6, 4, 7);

      // Eyes (glowing white with dark pupils)
      ctx.fillStyle = '#FFF';
      ctx.fillRect(5,  sy + 3, 6, 6);
      ctx.fillRect(13, sy + 3, 6, 6);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(7,  sy + 5, 3, 3);
      ctx.fillRect(15, sy + 5, 3, 3);

      // Angry eyebrows
      ctx.fillStyle = '#922B21';
      ctx.fillRect(5,  sy + 2, 6, 2);
      ctx.fillRect(13, sy + 2, 6, 2);

    } else {
      // Flyer
      const sy = e.y;
      const cx = sx + e.width / 2;
      const cy = sy + e.height / 2;
      const wingFlap = Math.sin(e.animTimer * 0.35) * 8;
      const facingLeft = e.vx < 0;

      // Shadow (faint, below the flyer)
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, sy + e.height + 35, e.width * 0.4, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wings
      ctx.fillStyle = 'rgba(155,89,182,0.75)';
      // Left wing
      ctx.save();
      ctx.translate(cx - 4, cy);
      ctx.rotate(-0.3 + (facingLeft ? -wingFlap * 0.06 : wingFlap * 0.06));
      ctx.beginPath();
      ctx.ellipse(-10, 0, 12, 5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Right wing
      ctx.save();
      ctx.translate(cx + 4, cy);
      ctx.rotate(0.3 + (facingLeft ? wingFlap * 0.06 : -wingFlap * 0.06));
      ctx.beginPath();
      ctx.ellipse(10, 0, 12, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Body
      ctx.fillStyle = '#8E44AD';
      ctx.beginPath();
      ctx.ellipse(cx, cy, e.width / 2, e.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeOffX = facingLeft ? -3 : 3;
      ctx.fillStyle = '#E74C3C';
      ctx.fillRect(cx - 6 + eyeOffX, cy - 4, 4, 4);
      ctx.fillRect(cx + 2 + eyeOffX, cy - 4, 4, 4);
      ctx.fillStyle = '#FFF';
      ctx.fillRect(cx - 5 + eyeOffX, cy - 3, 2, 2);
      ctx.fillRect(cx + 3 + eyeOffX, cy - 3, 2, 2);

      // Glow effect
      const glowAlpha = (Math.sin(time * 0.07 + e.phase) + 1) * 0.15;
      ctx.globalAlpha = glowAlpha;
      ctx.fillStyle = '#D98FF2';
      ctx.beginPath();
      ctx.ellipse(cx, cy, e.width * 0.8, e.height * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }
}

// ─── Mini character preview (used on start screen) ────────────────────────────
function PlayerPreview({ skin }: { skin: PlayerSkin }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(2, 2);
    const fakePlayer = makePlayer(2, 2);
    fakePlayer.isGrounded = true;
    fakePlayer.animFrame = 10;
    drawPlayer(ctx, fakePlayer, 0, skin.shirtColor, skin.pantsColor);
    ctx.restore();
  }, [skin]);

  return <canvas ref={ref} width={64} height={96} style={{ imageRendering: 'pixelated' }} />;
}

// ─── Main Game Component ──────────────────────────────────────────────────────
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skinRef = useRef<PlayerSkin>(DEFAULT_SKIN);

  const gameStateRef = useRef<{
    player: Player;
    platforms: Platform[];
    enemies: Enemy[];
    particles: Particle[];
    cameraX: number;
    checkpointX: number;
    checkpointY: number;
    score: number;
    lives: number;
    levelIndex: number;
    levelLength: number;
    keys: Set<string>;
    time: number;
    timerMs: number;
    lastFrameTime: number;
    touching: { left: boolean; right: boolean; jump: boolean };
  } | null>(null);

  const rafRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>('yearSelect');
  const [yearLevel, setYearLevel] = useState<number>(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [levelIndex, setLevelIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError] = useState('');
  const [myEntryId, setMyEntryId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitName, setSubmitName] = useState('');

  // Skin state
  const [skin, setSkinState] = useState<PlayerSkin>(DEFAULT_SKIN);

  const setSkin = useCallback((next: PlayerSkin) => {
    setSkinState(next);
    skinRef.current = next;
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  // Load saved profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed: PlayerSkin = JSON.parse(saved);
        setSkinState(parsed);
        skinRef.current = parsed;
      }
    } catch { /* ignore */ }
  }, []);

  // ─── Initialise level ──────────────────────────────────────────────────────
  const initLevel = useCallback((lvl: number, carryTimerMs = 0) => {
    const { platforms, enemies } = generateLevel(lvl);
    const levelLength = getLevelLength(lvl);
    const startPlat = platforms[0];
    const player = makePlayer(80, startPlat.y - PLAYER_H);
    gameStateRef.current = {
      player,
      platforms,
      enemies,
      particles: [],
      cameraX: 0,
      checkpointX: 80,
      checkpointY: startPlat.y - PLAYER_H,
      score: 0,
      lives: 3,
      levelIndex: lvl,
      levelLength,
      keys: new Set(),
      time: 0,
      timerMs: carryTimerMs,
      lastFrameTime: 0,
      touching: { left: false, right: false, jump: false },
    };
  }, []);

  // ─── Physics update ────────────────────────────────────────────────────────
  const updateGame = useCallback(() => {
    const g = gameStateRef.current;
    if (!g) return;

    g.time++;
    const now = performance.now();
    if (g.lastFrameTime > 0) g.timerMs += now - g.lastFrameTime;
    g.lastFrameTime = now;
    const p = g.player;

    const moveLeft  = g.keys.has('ArrowLeft')  || g.keys.has('a') || g.keys.has('A') || g.touching.left;
    const moveRight = g.keys.has('ArrowRight') || g.keys.has('d') || g.keys.has('D') || g.touching.right;
    const jump      = g.keys.has('ArrowUp')    || g.keys.has('w') || g.keys.has('W') || g.keys.has(' ') || g.touching.jump;

    if (moveLeft)       { p.vx = -MOVE_SPEED; p.facing = 'left'; }
    else if (moveRight) { p.vx =  MOVE_SPEED; p.facing = 'right'; }
    else                { p.vx *= 0.7; }

    if (jump && p.isGrounded) {
      p.vy = JUMP_FORCE;
      p.isGrounded = false;
      spawnParticles(g.particles, p.x + p.width / 2, p.y + p.height, '#A8E6CF', 6);
    }

    p.vy = Math.min(p.vy + GRAVITY, 18);
    p.x += p.vx;
    if (p.x < 0) { p.x = 0; p.vx = 0; }

    p.isGrounded = false;

    // X + Y collision
    for (const plat of g.platforms) {
      if (plat.type === 'spike' || plat.type === 'checkpoint' || plat.type === 'finish') continue;
      if (!rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) continue;

      const overlapLeft   = p.x + p.width - plat.x;
      const overlapRight  = plat.x + plat.width - p.x;
      const overlapTop    = p.y + p.height - plat.y;
      const overlapBottom = plat.y + plat.height - p.y;
      const minH = Math.min(overlapLeft, overlapRight);
      const minV = Math.min(overlapTop, overlapBottom);

      if (minV < minH) {
        if (overlapTop < overlapBottom) { p.y = plat.y - p.height; p.vy = 0; p.isGrounded = true; }
        else { p.y = plat.y + plat.height; p.vy = Math.abs(p.vy) * 0.3; }
      } else {
        if (overlapLeft < overlapRight) p.x = plat.x - p.width;
        else p.x = plat.x + plat.width;
        p.vx = 0;
      }
    }

    p.y += p.vy;

    for (const plat of g.platforms) {
      if (plat.type === 'spike' || plat.type === 'checkpoint' || plat.type === 'finish') continue;
      if (!rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) continue;

      const overlapTop    = p.y + p.height - plat.y;
      const overlapBottom = plat.y + plat.height - p.y;

      if (overlapTop < overlapBottom && p.vy > 0) { p.y = plat.y - p.height; p.vy = 0; p.isGrounded = true; }
      else if (overlapBottom < overlapTop && p.vy < 0) { p.y = plat.y + plat.height; p.vy = Math.abs(p.vy) * 0.3; }
    }

    // Spike collision
    for (const plat of g.platforms) {
      if (plat.type !== 'spike') continue;
      if (rectsOverlap(p.x + 4, p.y + 4, p.width - 8, p.height - 4, plat.x, plat.y, plat.width, plat.height)) {
        spawnParticles(g.particles, p.x + p.width / 2, p.y + p.height / 2, '#E74C3C', 20);
        setGameState('dead');
        return;
      }
    }

    // Enemy patrol update
    for (const e of g.enemies) {
      e.x += e.vx;
      e.animTimer++;

      if (e.x <= e.patrolLeft) {
        e.x = e.patrolLeft;
        e.vx = Math.abs(e.vx);
      }
      if (e.x + e.width >= e.patrolRight) {
        e.x = e.patrolRight - e.width;
        e.vx = -Math.abs(e.vx);
      }

      // Flyers hover vertically
      if (e.kind === 'flyer') {
        e.y = e.patrolBaseY + Math.sin(g.time * 0.05 + e.phase) * 10;
      }
    }

    // Enemy-player collision
    for (const e of g.enemies) {
      if (rectsOverlap(p.x + 4, p.y + 4, p.width - 8, p.height - 8, e.x, e.y, e.width, e.height)) {
        spawnParticles(g.particles, p.x + p.width / 2, p.y + p.height / 2, '#E74C3C', 20);
        setGameState('dead');
        return;
      }
    }

    // Checkpoint
    for (const plat of g.platforms) {
      if (plat.type !== 'checkpoint') continue;
      if (rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) {
        if (plat.x > g.checkpointX) {
          g.checkpointX = p.x;
          g.checkpointY = p.y;
          g.score += 50;
          setScore(g.score);
          spawnParticles(g.particles, plat.x + 15, plat.y, '#F39C12', 15);
          plat.type = 'solid';
          plat.height = 1; plat.width = 1; plat.y = -100;
        }
      }
    }

    // Finish flag collision — player must touch it to complete the level
    for (const plat of g.platforms) {
      if (plat.type !== 'finish') continue;
      if (rectsOverlap(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) {
        g.score += 200;
        setScore(g.score);
        spawnParticles(g.particles, plat.x + 20, plat.y + plat.height / 2, '#FFD700', 30);
        if (g.levelIndex + 1 >= TOTAL_LEVELS) {
          setFinalTimeMs(g.timerMs);
          setGameState('gameComplete');
        } else {
          setGameState('levelComplete');
        }
        return;
      }
    }

    // Fall death
    if (p.y > DEATH_Y) {
      spawnParticles(g.particles, p.x + p.width / 2, CANVAS_HEIGHT - 20, '#3498DB', 20);
      setGameState('dead');
      return;
    }

    if (p.isGrounded && Math.abs(p.vx) > 0.5) p.animTimer++;
    else if (!p.isGrounded) p.animTimer = 0;
    p.animFrame = p.animTimer;

    const targetCam = p.x - CANVAS_WIDTH * 0.35;
    g.cameraX += (targetCam - g.cameraX) * 0.1;
    if (g.cameraX < 0) g.cameraX = 0;

    g.particles = g.particles.filter(pt => {
      pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life--;
      return pt.life > 0;
    });
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const g = gameStateRef.current;
    if (!canvas || !g) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = skinRef.current;
    drawBackground(ctx, g.cameraX, g.time, g.levelIndex);
    for (const plat of g.platforms) drawPlatform(ctx, plat, g.cameraX, g.time);
    drawParticles(ctx, g.particles, g.cameraX);
    drawEnemies(ctx, g.enemies, g.cameraX, g.time);
    drawPlayer(ctx, g.player, g.cameraX, s.shirtColor, s.pantsColor);
    drawHUD(ctx, g.score, g.levelIndex, g.player.x, g.levelLength, g.lives, s.name, g.timerMs);
  }, []);

  // ─── Game loop ─────────────────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    updateGame();
    render();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, render]);

  // ─── Start game ────────────────────────────────────────────────────────────
  const startGame = useCallback((year: number, lvl: number = 0) => {
    setLevelIndex(lvl);
    setLives(3);
    setScore(0);
    setFinalTimeMs(0);
    setMyEntryId(null);
    initLevel(lvl, 0);
    setGameState('playing');
  }, [initLevel]);

  // ─── Handle death ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === 'dead') {
      cancelAnimationFrame(rafRef.current);
      setQuestion(getRandomQuestion(yearLevel));
      setSelectedAnswer(null);
      setAnswerResult(null);
    }
  }, [gameState, yearLevel]);

  // ─── Level complete ────────────────────────────────────────────────────────
  const nextLevel = useCallback(() => {
    const nextLvl = levelIndex + 1;
    const carryMs = gameStateRef.current?.timerMs ?? 0;
    setLevelIndex(nextLvl);
    initLevel(nextLvl, carryMs);
    setGameState('playing');
  }, [levelIndex, initLevel]);

  // ─── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const g = gameStateRef.current;
      if (!g) return;
      if (down) g.keys.add(e.key); else g.keys.delete(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, [gameState]);

  // ─── RAF start / stop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === 'playing') {
      rafRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(rafRef.current);
      render();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, gameLoop, render]);

  // ─── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((idx: number) => {
    if (answerResult !== null || !question) return;
    setSelectedAnswer(idx);
    const correct = idx === question.answerIndex;
    setAnswerResult(correct ? 'correct' : 'wrong');

    const g = gameStateRef.current;
    if (g) {
      if (correct) g.score += 100;
      else { g.lives = Math.max(0, g.lives - 1); setLives(g.lives); }

      if (!correct && g.lives <= 0) {
        setTimeout(() => setGameState('yearSelect'), 2000);
        return;
      }

      g.player = makePlayer(g.checkpointX, g.checkpointY - 10);
      g.player.facing = 'right';
      g.keys.clear();
      g.touching = { left: false, right: false, jump: false };
      if (correct) setScore(g.score);
    }

    setTimeout(() => setGameState('playing'), correct ? 1200 : 2000);
  }, [question, answerResult]);

  // ─── Leaderboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'gameComplete') return;
    setSubmitName(skin.name || '');
    setMyEntryId(null);
    setLbError('');
    setLbLoading(true);
    fetchLeaderboard()
      .then(setLeaderboard)
      .catch(() => setLbError('Could not load scores'))
      .finally(() => setLbLoading(false));
  }, [gameState, skin.name]);

  const handleSubmitScore = useCallback(async () => {
    if (!submitName.trim() || submitting || myEntryId !== null) return;
    setSubmitting(true);
    const id = await submitToLeaderboard(submitName.trim(), finalTimeMs, yearLevel);
    setMyEntryId(id ?? -1);
    const fresh = await fetchLeaderboard();
    setLeaderboard(fresh);
    setSubmitting(false);
  }, [submitName, submitting, myEntryId, finalTimeMs, yearLevel]);

  // ─── Touch controls ────────────────────────────────────────────────────────
  const setTouch = (key: 'left' | 'right' | 'jump', val: boolean) => {
    const g = gameStateRef.current;
    if (g) g.touching[key] = val;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────────────────

  if (gameState === 'yearSelect') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '640px', width: '100%' }}>
          <div style={{ fontSize: '52px', marginBottom: '4px' }}>🏃</div>
          <h1 style={{ fontSize: '2.4rem', margin: '0 0 4px', color: '#F39C12', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Parkour Master</h1>
          <p style={{ fontSize: '1rem', margin: '0 0 24px', color: '#BDC3C7' }}>Run, jump, and learn! Answer questions to keep playing.</p>

          {/* ── Player setup card ── */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Preview */}
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(135,206,235,0.3)', borderRadius: '10px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <PlayerPreview skin={skin} />
              </div>
              <span style={{ color: '#BDC3C7', fontSize: '0.8rem' }}>Preview</span>
            </div>

            {/* Controls */}
            <div style={{ flex: '1 1 200px', textAlign: 'left' }}>
              {/* Name */}
              <label style={{ color: '#ECF0F1', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Your Name
              </label>
              <input
                type="text"
                maxLength={16}
                placeholder="Enter your name..."
                value={skin.name}
                onChange={e => setSkin({ ...skin, name: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '0.95rem', marginBottom: '14px', outline: 'none',
                }}
              />

              {/* Shirt colours */}
              <label style={{ color: '#ECF0F1', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Shirt Colour
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {SHIRT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setSkin({ ...skin, shirtColor: c })}
                    title={c}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: c,
                      border: skin.shirtColor === c ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer', boxShadow: skin.shirtColor === c ? '0 0 0 2px #F39C12' : 'none',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>

              {/* Pants colours */}
              <label style={{ color: '#ECF0F1', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Pants Colour
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {PANTS_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setSkin({ ...skin, pantsColor: c })}
                    title={c}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: c,
                      border: skin.pantsColor === c ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer', boxShadow: skin.pantsColor === c ? '0 0 0 2px #F39C12' : 'none',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Year select ── */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h2 style={{ margin: '0 0 16px', color: '#ECF0F1', fontSize: '1.2rem' }}>What year are you in at school?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(y => (
                <button
                  key={y}
                  onClick={() => { setYearLevel(y); startGame(y); }}
                  style={{
                    padding: '13px 8px', borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = '#F39C12'; b.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.1)'; b.style.transform = 'scale(1)'; }}
                >
                  Year {y}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ color: '#7F8C8D', fontSize: '0.8rem', margin: 0 }}>Based on the Australian School Curriculum</p>
            <a href="/leaderboard" style={{ color: '#F39C12', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🏆 Leaderboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameComplete') {
    const medals = ['🥇', '🥈', '🥉'];
    return (
      <div style={{ minHeight: '100dvh', background: 'linear-gradient(135deg, #0f3460, #533483)', overflowY: 'auto', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', color: 'white', padding: '32px 20px', maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '8px' }}>🏆</div>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 6px', color: '#F39C12' }}>
            {skin.name ? `Amazing, ${skin.name}!` : 'You Win!'}
          </h1>
          <p style={{ fontSize: '1rem', margin: '0 0 16px', color: '#BDC3C7' }}>You completed all 10 levels!</p>

          {/* Time + Score */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 24px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: '#BDC3C7', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Time</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F39C12', fontVariantNumeric: 'tabular-nums' }}>{formatTime(finalTimeMs)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 24px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: '#BDC3C7', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ECC71' }}>{score}</div>
            </div>
          </div>

          {/* Submit */}
          {SB_URL && (myEntryId === null ? (
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ margin: '0 0 10px', fontWeight: 'bold', fontSize: '0.95rem' }}>Add your time to the leaderboard</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text" maxLength={16} placeholder="Your name"
                  value={submitName} onChange={e => setSubmitName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitScore()}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.95rem', outline: 'none' }}
                />
                <button
                  onClick={handleSubmitScore}
                  disabled={submitting || !submitName.trim()}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: submitting || !submitName.trim() ? '#555' : '#F39C12', color: 'white', fontWeight: 'bold', cursor: submitting || !submitName.trim() ? 'default' : 'pointer', fontSize: '0.9rem' }}
                >{submitting ? '...' : 'Submit'}</button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(46,204,113,0.15)', borderRadius: '14px', padding: '12px 16px', marginBottom: '20px', border: '1px solid rgba(46,204,113,0.4)' }}>
              <p style={{ margin: 0, color: '#2ECC71', fontWeight: 'bold' }}>Time submitted!</p>
            </div>
          ))}

          {/* Leaderboard */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#BDC3C7', letterSpacing: '2px', textTransform: 'uppercase' }}>Global Leaderboard</h2>
            {!SB_URL ? (
              <p style={{ color: '#7F8C8D', fontSize: '0.85rem', margin: 0 }}>Set up Supabase to enable the global leaderboard.</p>
            ) : lbLoading ? (
              <p style={{ color: '#BDC3C7', margin: 0 }}>Loading...</p>
            ) : lbError ? (
              <p style={{ color: '#E74C3C', margin: 0, fontSize: '0.85rem' }}>{lbError}</p>
            ) : leaderboard.length === 0 ? (
              <p style={{ color: '#BDC3C7', margin: 0, fontSize: '0.85rem' }}>No scores yet — be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {leaderboard.map((entry, i) => {
                  const isMe = entry.id === myEntryId;
                  return (
                    <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isMe ? 'rgba(243,156,18,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isMe ? 'rgba(243,156,18,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '8px 12px' }}>
                      <span style={{ width: '28px', textAlign: 'center', fontSize: i < 3 ? '1.1rem' : '0.85rem', color: i < 3 ? 'inherit' : '#7F8C8D' }}>
                        {i < 3 ? medals[i] : `#${i + 1}`}
                      </span>
                      <span style={{ flex: 1, textAlign: 'left', fontWeight: isMe ? 'bold' : 'normal', color: isMe ? '#F39C12' : '#ECF0F1', fontSize: '0.95rem' }}>{entry.name}</span>
                      <span style={{ color: '#7F8C8D', fontSize: '0.75rem' }}>Yr {entry.year_level}</span>
                      <span style={{ fontWeight: 'bold', color: i === 0 ? '#F39C12' : '#ECF0F1', fontVariantNumeric: 'tabular-nums', fontSize: '0.95rem' }}>{formatTime(entry.time_ms)}</span>
                      {isMe && <span style={{ fontSize: '0.7rem', color: '#F39C12' }}>you</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setGameState('yearSelect')} style={{ padding: '14px 40px', borderRadius: '12px', border: 'none', background: '#F39C12', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Play Again
            </button>
            <a href="/leaderboard" style={{ padding: '14px 28px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', fontSize: '1rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              🏆 Full Leaderboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'levelComplete') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #134e5e, #71b280)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
          <div style={{ fontSize: '70px', marginBottom: '16px' }}>⭐</div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 12px' }}>Level Complete!</h1>
          <p style={{ fontSize: '1.1rem', margin: '0 0 8px' }}>
            {skin.name ? `Brilliant work, ${skin.name}!` : 'Brilliant work!'} Score: {score}
          </p>
          <p style={{ fontSize: '0.95rem', margin: '0 0 28px', color: '#A8E6CF' }}>Level {levelIndex + 2} coming up...</p>
          <button onClick={nextLevel} style={{ padding: '16px 40px', borderRadius: '12px', border: 'none', background: '#27AE60', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Next Level →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: `${CANVAS_WIDTH}px`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'block', width: '100%', height: 'auto' }} />

        {/* Question overlay */}
        {gameState === 'dead' && question && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px, 4vw, 28px)', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', maxHeight: '90%', overflowY: 'auto' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                {answerResult === 'correct' ? '🎉' : answerResult === 'wrong' ? '😅' : '💀'}
              </div>
              <p style={{ color: '#7F8C8D', fontSize: '0.8rem', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {question.subject}
              </p>
              <h2 style={{ fontSize: '1.15rem', margin: '0 0 20px', color: '#2C3E50', lineHeight: 1.4 }}>
                {question.question}
              </h2>

              {answerResult === null ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      style={{ padding: '12px 8px', borderRadius: '10px', border: '2px solid #E0E0E0', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: '#2C3E50', transition: 'all 0.15s' }}
                      onMouseEnter={e => { const b = e.target as HTMLButtonElement; b.style.background = '#3498DB'; b.style.color = 'white'; b.style.borderColor = '#3498DB'; }}
                      onMouseLeave={e => { const b = e.target as HTMLButtonElement; b.style.background = 'white'; b.style.color = '#2C3E50'; b.style.borderColor = '#E0E0E0'; }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {question.options.map((opt, i) => {
                      const isCorrect = i === question.answerIndex;
                      const isSelected = i === selectedAnswer;
                      return (
                        <div key={i} style={{
                          padding: '12px 8px', borderRadius: '10px',
                          background: isCorrect ? '#27AE60' : isSelected ? '#E74C3C' : '#F5F5F5',
                          color: isCorrect || isSelected ? 'white' : '#999',
                          fontSize: '0.9rem', fontWeight: '600',
                          border: `2px solid ${isCorrect ? '#27AE60' : isSelected ? '#E74C3C' : '#E0E0E0'}`,
                        }}>{opt}</div>
                      );
                    })}
                  </div>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: answerResult === 'correct' ? '#27AE60' : '#E74C3C' }}>
                    {answerResult === 'correct' ? '✓ Correct! Keep going!' : `✗ The answer was: ${question.options[question.answerIndex]}`}
                  </p>
                  {lives <= 0 && <p style={{ margin: '8px 0 0', color: '#E74C3C', fontSize: '0.85rem' }}>No lives left! Returning to menu...</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Touch controls — below canvas so they never cover the game */}
      <div style={{ width: '100%', maxWidth: `${CANVAS_WIDTH}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onTouchStart={e => { e.preventDefault(); setTouch('left', true); }} onTouchEnd={() => setTouch('left', false)}
            onMouseDown={() => setTouch('left', true)} onMouseUp={() => setTouch('left', false)} onMouseLeave={() => setTouch('left', false)}
            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
          >←</button>
          <button
            onTouchStart={e => { e.preventDefault(); setTouch('right', true); }} onTouchEnd={() => setTouch('right', false)}
            onMouseDown={() => setTouch('right', true)} onMouseUp={() => setTouch('right', false)} onMouseLeave={() => setTouch('right', false)}
            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
          >→</button>
        </div>
        <button
          onTouchStart={e => { e.preventDefault(); setTouch('jump', true); }} onTouchEnd={() => setTouch('jump', false)}
          onMouseDown={() => setTouch('jump', true)} onMouseUp={() => setTouch('jump', false)} onMouseLeave={() => setTouch('jump', false)}
          style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(243,156,18,0.8)', border: '2px solid #F39C12', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
        >JUMP</button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setShowControls(!showControls)} style={{ background: 'none', border: 'none', color: '#7F8C8D', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>
          {showControls ? 'Hide' : 'Show'} keyboard controls
        </button>
        {showControls && <p style={{ color: '#BDC3C7', fontSize: '0.8rem', margin: '6px 0 0' }}>Arrow keys or WASD to move | Space or W/↑ to jump</p>}
      </div>
    </div>
  );
}
