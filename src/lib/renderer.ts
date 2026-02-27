import { Player, Platform, Particle, Enemy } from "@/types";
import { CANVAS_WIDTH } from "./constants";
import { CANVAS_HEIGHT } from "./levelGenerator";
import { formatTime } from "./leaderboard";

// ─── Player ───────────────────────────────────────────────────────────────────

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  p: Player,
  camX: number,
  shirtColor: string,
  pantsColor: string,
) {
  const sx = p.x - camX;
  const sy = p.y;
  ctx.save();
  if (p.facing === "left") {
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
  ctx.fillStyle = "#FFD166";
  ctx.fillRect(5, 2, 18, 16);

  // Eyes
  ctx.fillStyle = "#333";
  ctx.fillRect(10, 7, 4, 4);
  ctx.fillRect(16, 7, 4, 4);

  // Mouth smile
  ctx.fillStyle = "#333";
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

// ─── Platform ─────────────────────────────────────────────────────────────────

export function drawPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  camX: number,
  time: number,
) {
  const sx = plat.x - camX;
  if (sx + plat.width < -10 || sx > CANVAS_WIDTH + 10) return;

  if (plat.type === "solid") {
    ctx.fillStyle = "#2ECC71";
    ctx.fillRect(sx, plat.y, plat.width, 8);
    ctx.fillStyle = "#8B6914";
    ctx.fillRect(sx, plat.y + 8, plat.width, plat.height - 8);
    ctx.fillStyle = "#27AE60";
    for (let i = 8; i < plat.width - 8; i += 16) {
      ctx.fillRect(sx + i, plat.y + 2, 4, 4);
    }
  } else if (plat.type === "spike") {
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
    ctx.fillStyle = "#C0392B";
    ctx.fillRect(sx, plat.y + plat.height - 3, plat.width, 3);
  } else if (plat.type === "checkpoint") {
    ctx.fillStyle = "#7F8C8D";
    ctx.fillRect(sx + 12, plat.y, 4, plat.height);
    const flagWave = Math.sin(time * 0.08) * 3;
    ctx.fillStyle = "#F39C12";
    ctx.beginPath();
    ctx.moveTo(sx + 16, plat.y + 2);
    ctx.lineTo(sx + 16 + 14 + flagWave, plat.y + 8);
    ctx.lineTo(sx + 16, plat.y + 16);
    ctx.closePath();
    ctx.fill();
  } else if (plat.type === "finish") {
    // The bounding box spans full canvas height so the flag can't be jumped over.
    // All visuals are anchored at the bottom of the box (ground level).
    const groundY = plat.y + plat.height; // = GROUND_Y
    const poleTop = groundY - 72;

    // Glowing aura
    const glow = Math.sin(time * 0.06) * 0.4 + 0.6;
    ctx.save();
    ctx.globalAlpha = glow * 0.35;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(sx + 20, poleTop + 30, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Pole
    ctx.fillStyle = "#BDC3C7";
    ctx.fillRect(sx + 18, poleTop, 4, 72);

    // Checkered flag (4×3 grid), anchored at top of pole
    const fw = 22;
    const fh = 18;
    const fx = sx + 22;
    const fy = poleTop + 2;
    const colors = ["#FFF", "#222"];
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
    ctx.fillStyle = "#FFD700";
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
    ctx.font = "bold 9px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 3;
    ctx.fillText("FINISH", sx + 20, groundY + 12);
    ctx.restore();
  }
}

// ─── Background ───────────────────────────────────────────────────────────────

const STARS = (() => {
  const out: { x: number; y: number; size: number }[] = [];
  let s = 42;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let i = 0; i < 60; i++)
    out.push({ x: rng() * CANVAS_WIDTH, y: rng() * CANVAS_HEIGHT * 0.7, size: 0.5 + rng() * 1.5 });
  return out;
})();

interface BgTheme {
  skyTop: string;
  skyBot: string;
  cloudColor: string;
  mountainColor: string;
  stars: boolean;
  moon: boolean;
}

const BG_THEMES: BgTheme[] = [
  { skyTop: "#C0628A", skyBot: "#FFB07C", cloudColor: "rgba(255,210,200,0.80)", mountainColor: "rgba(120,60,80,0.50)", stars: false, moon: false }, //  1 Tutorial  – sunrise
  { skyTop: "#5BA8D4", skyBot: "#C8E8F8", cloudColor: "rgba(255,255,255,0.85)", mountainColor: "rgba(80,120,180,0.40)", stars: false, moon: false }, //  2 Easy      – early morning
  { skyTop: "#3E8FCC", skyBot: "#A8D8F0", cloudColor: "rgba(255,255,240,0.82)", mountainColor: "rgba(55,95,175,0.42)", stars: false, moon: false }, //  3 Easy+     – morning
  { skyTop: "#1A6BAF", skyBot: "#87CEEB", cloudColor: "rgba(255,255,255,0.75)", mountainColor: "rgba(40,80,160,0.45)", stars: false, moon: false }, //  4 Medium    – midday
  { skyTop: "#4A8FCC", skyBot: "#B0D8EE", cloudColor: "rgba(255,252,220,0.78)", mountainColor: "rgba(60,100,190,0.45)", stars: false, moon: false }, //  5 Medium+   – afternoon
  { skyTop: "#E08030", skyBot: "#F5C030", cloudColor: "rgba(255,185,105,0.75)", mountainColor: "rgba(140,52,16,0.55)", stars: false, moon: false }, //  6 Tricky    – golden hour
  { skyTop: "#7E1630", skyBot: "#D44A18", cloudColor: "rgba(210,108,68,0.65)", mountainColor: "rgba(50,8,18,0.65)", stars: false, moon: false }, //  7 Hard      – sunset
  { skyTop: "#3A0A50", skyBot: "#8B2040", cloudColor: "rgba(160,80,140,0.55)", mountainColor: "rgba(35,5,45,0.72)", stars: false, moon: false }, //  8 Hard+     – dusk
  { skyTop: "#160840", skyBot: "#4E1880", cloudColor: "rgba(130,65,200,0.40)", mountainColor: "rgba(22,6,42,0.78)", stars: true,  moon: false }, //  9 Very Hard – twilight
  { skyTop: "#020208", skyBot: "#08082A", cloudColor: "rgba(22,22,65,0.35)",   mountainColor: "rgba(5,5,18,0.95)",   stars: true,  moon: true  }, // 10 Expert    – deep night
];

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  camX: number,
  time: number,
  levelIndex: number,
) {
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
      { px: 0.15, py: 220, r: 30, body: "#FF8C5A", glow: "rgba(255,140,90," }, //  1 sunrise – low left, orange-pink
      { px: 0.82, py: 65,  r: 26, body: "#FFE060", glow: "rgba(255,220,60," }, //  2 early morning – upper right, warm yellow
      { px: 0.8,  py: 50,  r: 24, body: "#FFE840", glow: "rgba(255,240,80," }, //  3 morning – upper right, bright yellow
      { px: 0.5,  py: 36,  r: 22, body: "#FFF0A0", glow: "rgba(255,245,150,"}, //  4 midday – top centre, white-yellow
      { px: 0.78, py: 58,  r: 24, body: "#FFC020", glow: "rgba(255,190,30," }, //  5 afternoon – upper right, golden
      { px: 0.12, py: 115, r: 32, body: "#FF8010", glow: "rgba(255,120,10," }, //  6 golden hour – right side, orange
      { px: 0.08, py: 225, r: 38, body: "#CC2200", glow: "rgba(180,20,0,"   }, //  7 sunset – low right, deep red
      { px: 0.88, py: 345, r: 45, body: "#6B0000", glow: "rgba(100,0,0,"    }, //  8 dusk – below mountains, barely visible
    ];
    const sun = suns[Math.min(levelIndex, 3)];
    const sunX = CANVAS_WIDTH * sun.px;
    const sunGrad = ctx.createRadialGradient(sunX, sun.py, 0, sunX, sun.py, sun.r * 2.5);
    sunGrad.addColorStop(0, sun.glow + "0.35)");
    sunGrad.addColorStop(1, sun.glow + "0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sun.py, sun.r * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = sun.body;
    ctx.beginPath();
    ctx.arc(sunX, sun.py, sun.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stars (levels 8–9)
  if (bg.stars) {
    for (const star of STARS) {
      const alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.04 + star.x * 0.3));
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Moon (level 9)
  if (bg.moon) {
    const moonX = CANVAS_WIDTH * 0.78;
    const moonY = 52;
    const moonR = 22;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 2.5);
    moonGlow.addColorStop(0, "rgba(255,255,200,0.22)");
    moonGlow.addColorStop(1, "rgba(255,255,200,0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFAE0";
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(190,180,140,0.45)";
    ctx.beginPath();
    ctx.arc(moonX - 7, moonY + 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 9, moonY - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 2, moonY + 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Clouds
  ctx.fillStyle = bg.cloudColor;
  const cloudOffsets = [
    { bx: 100,  y: 60, w: 100 },
    { bx: 400,  y: 40, w: 130 },
    { bx: 700,  y: 75, w: 90  },
    { bx: 1100, y: 50, w: 120 },
    { bx: 1500, y: 35, w: 110 },
    { bx: 1900, y: 65, w: 95  },
    { bx: 2300, y: 45, w: 105 },
  ];
  for (const c of cloudOffsets) {
    const cx =
      ((((c.bx - camX * 0.3) % (CANVAS_WIDTH + 200)) + CANVAS_WIDTH + 200) %
        (CANVAS_WIDTH + 200)) -
      100;
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
    const mx = (((mo - camX * 0.5) % 1500) + 1500) % 1500;
    ctx.beginPath();
    ctx.moveTo(mx, CANVAS_HEIGHT - 60);
    ctx.lineTo(mx + 150, CANVAS_HEIGHT - 180);
    ctx.lineTo(mx + 300, CANVAS_HEIGHT - 60);
    ctx.closePath();
    ctx.fill();
  }
}

// ─── Particles ────────────────────────────────────────────────────────────────

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  camX: number,
) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - camX - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// ─── Enemies ──────────────────────────────────────────────────────────────────

export function drawEnemies(
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
  camX: number,
  time: number,
) {
  for (const e of enemies) {
    const sx = e.x - camX;
    if (sx + e.width < -10 || sx > CANVAS_WIDTH + 10) continue;

    ctx.save();

    if (e.kind === "walker") {
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
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(e.width / 2, sy + e.height + 3, e.width * 0.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = "#6B0000";
      ctx.fillRect(3, sy + e.height - 10 + legAnim, 8, 10);
      ctx.fillRect(13, sy + e.height - 10 - legAnim, 8, 10);

      // Body
      ctx.fillStyle = "#C0392B";
      ctx.fillRect(1, sy + 10, e.width - 2, e.height - 18);

      // Head
      ctx.fillStyle = "#E74C3C";
      ctx.fillRect(2, sy, e.width - 4, 14);

      // Horns
      ctx.fillStyle = "#922B21";
      ctx.fillRect(4, sy - 6, 4, 7);
      ctx.fillRect(16, sy - 6, 4, 7);

      // Eyes (glowing white with dark pupils)
      ctx.fillStyle = "#FFF";
      ctx.fillRect(5, sy + 3, 6, 6);
      ctx.fillRect(13, sy + 3, 6, 6);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(7, sy + 5, 3, 3);
      ctx.fillRect(15, sy + 5, 3, 3);

      // Angry eyebrows
      ctx.fillStyle = "#922B21";
      ctx.fillRect(5, sy + 2, 6, 2);
      ctx.fillRect(13, sy + 2, 6, 2);
    } else {
      // Flyer
      const sy = e.y;
      const cx = sx + e.width / 2;
      const cy = sy + e.height / 2;
      const wingFlap = Math.sin(e.animTimer * 0.35) * 8;
      const facingLeft = e.vx < 0;

      // Shadow (faint, below the flyer)
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.beginPath();
      ctx.ellipse(cx, sy + e.height + 35, e.width * 0.4, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wings
      ctx.fillStyle = "rgba(155,89,182,0.75)";
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
      ctx.fillStyle = "#8E44AD";
      ctx.beginPath();
      ctx.ellipse(cx, cy, e.width / 2, e.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeOffX = facingLeft ? -3 : 3;
      ctx.fillStyle = "#E74C3C";
      ctx.fillRect(cx - 6 + eyeOffX, cy - 4, 4, 4);
      ctx.fillRect(cx + 2 + eyeOffX, cy - 4, 4, 4);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(cx - 5 + eyeOffX, cy - 3, 2, 2);
      ctx.fillRect(cx + 3 + eyeOffX, cy - 3, 2, 2);

      // Glow effect
      const glowAlpha = (Math.sin(time * 0.07 + e.phase) + 1) * 0.15;
      ctx.globalAlpha = glowAlpha;
      ctx.fillStyle = "#D98FF2";
      ctx.beginPath();
      ctx.ellipse(cx, cy, e.width * 0.8, e.height * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }
}

// ─── HUD ──────────────────────────────────────────────────────────────────────

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  level: number,
  levelProgress: number,
  levelLength: number,
  lives: number,
  playerName: string,
  timerMs: number,
) {
  // Progress bar
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(10, 10, 300, 18);
  const pct = Math.min(levelProgress / levelLength, 1);
  ctx.fillStyle = "#F39C12";
  ctx.fillRect(10, 10, 300 * pct, 18);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 300, 18);

  // Finish flag icon
  ctx.fillStyle = "#27AE60";
  ctx.fillRect(314, 10, 6, 18);
  ctx.fillStyle = "#F39C12";
  ctx.beginPath();
  ctx.moveTo(320, 11);
  ctx.lineTo(333, 17);
  ctx.lineTo(320, 23);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = "#000";
  ctx.shadowBlur = 4;
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 50);
  ctx.fillText(`Level ${level + 1}`, 10, 68);

  // Player name tag
  if (playerName) {
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(CANVAS_WIDTH / 2 - 60, 8, 120, 22);
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerName, CANVAS_WIDTH / 2, 24);
  }

  // Hearts
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
  for (let i = 0; i < lives; i++) {
    ctx.fillStyle = "#E74C3C";
    ctx.font = "20px Arial";
    ctx.fillText("♥", CANVAS_WIDTH - 30 - i * 28, 32);
  }

  // Timer
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 3;
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "right";
  ctx.fillText(formatTime(timerMs), CANVAS_WIDTH - 10, 56);
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
}
