// ─── Note frequencies (Hz) ────────────────────────────────────────────────────
const N: Record<string, number> = {
  Eb3: 155.56, F3: 174.61, G3: 196.00, Ab3: 207.65, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
  G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46,
  G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50,
};

const _ = 0; // rest

// ─── Music themes (one per level, 0-indexed) ──────────────────────────────────
// melody = 16 eighth-note steps (2 bars), bass = 8 quarter-note steps (2 bars)
interface Theme { bpm: number; melody: number[]; bass: number[]; }

const THEMES: Theme[] = [
  // 0 Tutorial — C major, cheerful 130 BPM
  { bpm: 130,
    melody: [N.E5,_,N.G5,N.E5, N.C5,_,N.D5,N.E5, N.F5,_,N.A5,N.G5, N.E5,N.D5,N.C5,_],
    bass:   [N.C4,_,N.G3,_,    N.F3,_,N.G3,_] },

  // 1 Easy Morning — G major, upbeat 138 BPM
  { bpm: 138,
    melody: [N.G5,_,N.A5,N.G5, N.E5,_,N.D5,_, N.B4,N.D5,N.G5,_, N.A5,_,N.G5,_],
    bass:   [N.G3,_,N.D4,_,    N.G3,_,N.B3,_] },

  // 2 Easy+ — A pentatonic, energetic 145 BPM
  { bpm: 145,
    melody: [N.A5,_,N.E5,N.G5, N.A5,_,N.G5,N.E5, N.D5,_,N.E5,N.G5, N.A5,_,_,_],
    bass:   [N.A3,_,N.E4,_,    N.A3,_,N.C4,_] },

  // 3 Medium — D major, bright 150 BPM
  { bpm: 150,
    melody: [N.D5,_,N.E5,N.G5, N.A5,_,N.G5,N.E5, N.D5,N.E5,N.A5,_, N.G5,_,N.D5,_],
    bass:   [N.D4,_,N.A3,_,    N.G3,_,N.A3,_] },

  // 4 Medium+ — F major, warm afternoon 140 BPM
  { bpm: 140,
    melody: [N.F5,_,N.A5,N.G5, N.F5,N.E5,N.C5,_, N.D5,_,N.F5,N.A5, N.G5,_,N.F5,_],
    bass:   [N.F3,_,N.C4,_,    N.Bb3,_,N.C4,_] },

  // 5 Getting Tricky — C major, golden hour 132 BPM
  { bpm: 132,
    melody: [N.E5,N.G5,N.A5,_, N.G5,N.E5,N.C5,_, N.D5,N.F5,N.G5,_, N.E5,_,N.D5,N.C5],
    bass:   [N.C4,_,N.E4,_,    N.F3,_,N.G3,_] },

  // 6 Hard — A minor, moody sunset 124 BPM
  { bpm: 124,
    melody: [N.A4,N.C5,N.E5,_, N.D5,N.F5,N.E5,_, N.C5,N.E5,N.A5,_, N.G5,_,N.E5,_],
    bass:   [N.A3,_,N.E4,_,    N.A3,_,N.G3,_] },

  // 7 Hard+ — D minor, tense dusk 118 BPM
  { bpm: 118,
    melody: [N.D5,_,N.F5,N.A5, N.G5,_,N.F5,N.D5, N.Eb5,_,N.G5,_, N.F5,N.Eb5,N.D5,_],
    bass:   [N.D4,_,N.A3,_,    N.D4,_,N.C4,_] },

  // 8 Very Hard — E minor, twilight 114 BPM
  { bpm: 114,
    melody: [N.E5,_,N.G5,N.B5, N.A5,_,N.G5,_, N.E5,N.D5,N.E5,_, N.G5,_,N.E5,_],
    bass:   [N.E4,_,N.B3,_,    N.E4,_,N.D4,_] },

  // 9 Expert — C minor, deep night 160 BPM
  { bpm: 160,
    melody: [N.C5,_,N.Eb5,N.G5, N.Bb4,_,N.Ab4,_, N.G4,_,N.Bb4,N.Eb5, N.G5,_,N.C5,_],
    bass:   [N.C4,_,N.G3,_,     N.Bb3,_,N.Ab3,_] },
];

// ─── Audio Manager ────────────────────────────────────────────────────────────
class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private melodyStep = 0;
  private currentTheme = 0;
  private _muted = false;

  // ── Init ──────────────────────────────────────────────────────────────────
  private ensureCtx(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.ctx) return true;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._muted ? 0 : 0.55;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.32;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.85;
      this.sfxGain.connect(this.masterGain);
      return true;
    } catch { return false; }
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  // ── Low-level tone helper ─────────────────────────────────────────────────
  private tone(
    dest: AudioNode,
    freq: number,
    type: OscillatorType,
    start: number,
    dur: number,
    vol: number,
    freqEnd?: number,
  ) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(dest);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (freqEnd !== undefined) osc.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  }

  // ── Sound effects ─────────────────────────────────────────────────────────
  jump() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    this.tone(this.sfxGain, 220, 'square', this.ctx.currentTime, 0.13, 0.22, 550);
  }

  land() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    this.tone(this.sfxGain, 90, 'sine', this.ctx.currentTime, 0.09, 0.35, 35);
  }

  checkpoint() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    const t = this.ctx.currentTime;
    this.tone(this.sfxGain, N.C5, 'square', t,        0.10, 0.28);
    this.tone(this.sfxGain, N.E5, 'square', t + 0.10, 0.10, 0.28);
    this.tone(this.sfxGain, N.G5, 'square', t + 0.20, 0.18, 0.28);
  }

  death() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    const t = this.ctx.currentTime;
    this.tone(this.sfxGain, 380, 'sawtooth', t,        0.28, 0.45, 80);
    this.tone(this.sfxGain, 200, 'square',   t + 0.06, 0.22, 0.28, 50);
  }

  correct() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    const t = this.ctx.currentTime;
    this.tone(this.sfxGain, N.C5,  'square', t,        0.08, 0.30);
    this.tone(this.sfxGain, N.E5,  'square', t + 0.08, 0.08, 0.30);
    this.tone(this.sfxGain, N.G5,  'square', t + 0.16, 0.08, 0.30);
    this.tone(this.sfxGain, N.C6,  'square', t + 0.24, 0.22, 0.30);
  }

  wrong() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    const t = this.ctx.currentTime;
    this.tone(this.sfxGain, 320, 'sawtooth', t,        0.16, 0.38, 220);
    this.tone(this.sfxGain, 200, 'sawtooth', t + 0.16, 0.20, 0.28, 140);
  }

  levelComplete() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    const t = this.ctx.currentTime;
    [N.C5, N.E5, N.G5, N.C6].forEach((f, i) =>
      this.tone(this.sfxGain!, f, 'square', t + i * 0.11, 0.18, 0.35));
  }

  gameComplete() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain || this._muted) return;
    this.resume();
    const t = this.ctx.currentTime;
    [N.C5, N.E5, N.G5, N.E5, N.G5, N.A5, N.C6].forEach((f, i) =>
      this.tone(this.sfxGain!, f, 'square', t + i * 0.13, 0.22, 0.38));
  }

  // ── Music scheduler ───────────────────────────────────────────────────────
  startMusic(levelIndex: number) {
    if (!this.ensureCtx() || !this.ctx) return;
    this.resume();
    this.stopMusic();
    this.currentTheme = Math.min(levelIndex, THEMES.length - 1);
    this.melodyStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.schedulerTimer = setInterval(() => this._schedule(), 25);
  }

  stopMusic() {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  private _schedule() {
    if (!this.ctx || !this.musicGain) return;
    const theme = THEMES[this.currentTheme];
    const stepDur = 60 / theme.bpm / 2; // eighth-note duration
    const ahead = 0.12;

    while (this.nextNoteTime < this.ctx.currentTime + ahead) {
      const mFreq = theme.melody[this.melodyStep % theme.melody.length];
      if (mFreq > 0 && !this._muted) {
        this.tone(this.musicGain, mFreq, 'square', this.nextNoteTime, stepDur * 0.82, 0.14);
      }

      // Bass every 2 melody steps (quarter note)
      if (this.melodyStep % 2 === 0) {
        const bFreq = theme.bass[(this.melodyStep / 2) % theme.bass.length];
        if (bFreq > 0 && !this._muted) {
          this.tone(this.musicGain, bFreq, 'triangle', this.nextNoteTime, stepDur * 1.75, 0.18);
        }
      }

      this.melodyStep = (this.melodyStep + 1) % theme.melody.length;
      this.nextNoteTime += stepDur;
    }
  }

  // ── Mute ──────────────────────────────────────────────────────────────────
  setMuted(m: boolean) {
    this._muted = m;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx.currentTime, 0.05);
    }
  }

  isMuted() { return this._muted; }
}

export const audioManager = new AudioManager();
