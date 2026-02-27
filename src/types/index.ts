export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  animFrame: number;
  animTimer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'solid' | 'spike' | 'checkpoint' | 'finish';
}

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  kind: 'walker' | 'flyer';
  patrolLeft: number;
  patrolRight: number;
  patrolBaseY: number; // base y for flyer hover oscillation
  phase: number;       // per-enemy phase offset so flyers don't all bob in sync
  animTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Question {
  question: string;
  options: string[];
  answerIndex: number;
  subject: string;
  explanation?: string;
}

export type GameState = 'yearSelect' | 'playing' | 'dead' | 'levelComplete' | 'gameComplete';

export interface PlayerSkin {
  name: string;
  shirtColor: string;
  pantsColor: string;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  time_ms: number;
  year_level: number;
}

export interface GameEngineState {
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
}

export interface GameCallbacks {
  onDeath: () => void;
  onCheckpoint: (newScore: number) => void;
  onLevelComplete: (newScore: number) => void;
  onGameComplete: (newScore: number, timerMs: number) => void;
}
