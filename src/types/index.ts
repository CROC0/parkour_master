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
