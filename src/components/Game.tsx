"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Player, Platform, Particle, Enemy, Question, GameState, GameEngineState } from "@/types";
import { generateLevel, getLevelLength, CANVAS_HEIGHT, TOTAL_LEVELS } from "@/lib/levelGenerator";
import { getRandomQuestion } from "@/lib/questions";
import { audioManager } from "@/lib/audio";
import {
  CANVAS_WIDTH,
  PLAYER_H,
  LS_KEY,
  DEFAULT_SKIN,
} from "@/lib/constants";
import {
  fetchLeaderboard,
  submitToLeaderboard,
} from "@/lib/leaderboard";
import {
  drawBackground,
  drawPlatform,
  drawParticles,
  drawEnemies,
  drawPlayer,
  drawHUD,
} from "@/lib/renderer";
import { makePlayer, updateGame as updateGameEngine } from "@/lib/gameEngine";
import YearSelectScreen from "@/components/screens/YearSelectScreen";
import QuestionModal from "@/components/screens/QuestionModal";
import LevelCompleteScreen from "@/components/screens/LevelCompleteScreen";
import GameCompleteScreen from "@/components/screens/GameCompleteScreen";
import { PlayerSkin, LeaderboardEntry } from "@/types";

// ─── Main Game Component ──────────────────────────────────────────────────────
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skinRef = useRef<PlayerSkin>(DEFAULT_SKIN);

  const gameStateRef = useRef<GameEngineState | null>(null);

  const rafRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>("yearSelect");
  const [yearLevel, setYearLevel] = useState<number>(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [levelIndex, setLevelIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError] = useState("");
  const [myEntryId, setMyEntryId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitName, setSubmitName] = useState("");

  // Skin state
  const [skin, setSkinState] = useState<PlayerSkin>(DEFAULT_SKIN);

  const setSkin = useCallback((next: PlayerSkin) => {
    setSkinState(next);
    skinRef.current = next;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  // Load saved profile and mute preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed: PlayerSkin = JSON.parse(saved);
        setSkinState(parsed);
        skinRef.current = parsed;
      }
    } catch {
      /* ignore */
    }
    const savedMuted = localStorage.getItem("pm_muted") === "true";
    setMuted(savedMuted);
    audioManager.setMuted(savedMuted);
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
    audioManager.startMusic(lvl);
  }, []);

  // ─── Physics update ────────────────────────────────────────────────────────
  const updateGame = useCallback(() => {
    const g = gameStateRef.current;
    if (!g) return;
    updateGameEngine(g, {
      onDeath: () => setGameState("dead"),
      onCheckpoint: (s) => setScore(s),
      onLevelComplete: (s) => {
        setScore(s);
        setGameState("levelComplete");
      },
      onGameComplete: (s, t) => {
        setScore(s);
        setFinalTimeMs(t);
        setGameState("gameComplete");
      },
    });
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const g = gameStateRef.current;
    if (!canvas || !g) return;
    const ctx = canvas.getContext("2d");
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
  const startGame = useCallback(
    (year: number, lvl: number = 0) => {
      setLevelIndex(lvl);
      setLives(3);
      setScore(0);
      setFinalTimeMs(0);
      setMyEntryId(null);
      initLevel(lvl, 0);
      setGameState("playing");
    },
    [initLevel],
  );

  // ─── Handle death ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === "dead") {
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
    setGameState("playing");
  }, [levelIndex, initLevel]);

  // ─── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "playing") return;
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const g = gameStateRef.current;
      if (!g) return;
      if (down) g.keys.add(e.key);
      else g.keys.delete(e.key);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [gameState]);

  // ─── RAF start / stop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === "playing") {
      audioManager.startMusic(gameStateRef.current?.levelIndex ?? 0);
      rafRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(rafRef.current);
      audioManager.stopMusic();
      render();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, gameLoop, render]);

  // ─── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (idx: number) => {
      if (answerResult !== null || !question) return;
      setSelectedAnswer(idx);
      const correct = idx === question.answerIndex;
      setAnswerResult(correct ? "correct" : "wrong");
      if (correct) audioManager.correct();
      else audioManager.wrong();

      const g = gameStateRef.current;
      if (g) {
        if (correct) g.score += 100;
        else {
          g.lives = Math.max(0, g.lives - 1);
          setLives(g.lives);
        }

        if (!correct && g.lives <= 0) {
          setTimeout(() => setGameState("yearSelect"), 2000);
          return;
        }

        g.player = makePlayer(g.checkpointX, g.checkpointY - 10);
        g.player.facing = "right";
        g.keys.clear();
        g.touching = { left: false, right: false, jump: false };
        if (correct) setScore(g.score);
      }

      setTimeout(() => setGameState("playing"), correct ? 1200 : 2000);
    },
    [question, answerResult],
  );

  // ─── Leaderboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "gameComplete") return;
    setSubmitName(skin.name || "");
    setMyEntryId(null);
    setLbError("");
    setLbLoading(true);
    fetchLeaderboard()
      .then(setLeaderboard)
      .catch(() => setLbError("Could not load scores"))
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
  const setTouch = (key: "left" | "right" | "jump", val: boolean) => {
    const g = gameStateRef.current;
    if (g) g.touching[key] = val;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────────────────

  if (gameState === "yearSelect") {
    return (
      <YearSelectScreen
        skin={skin}
        onSkinChange={setSkin}
        onSelectYear={(year) => {
          setYearLevel(year);
          startGame(year);
        }}
      />
    );
  }

  if (gameState === "gameComplete") {
    return (
      <GameCompleteScreen
        skin={skin}
        score={score}
        finalTimeMs={finalTimeMs}
        leaderboard={leaderboard}
        lbLoading={lbLoading}
        lbError={lbError}
        myEntryId={myEntryId}
        submitting={submitting}
        submitName={submitName}
        onSubmitNameChange={setSubmitName}
        onSubmitScore={handleSubmitScore}
        onPlayAgain={() => setGameState("yearSelect")}
      />
    );
  }

  if (gameState === "levelComplete") {
    return (
      <LevelCompleteScreen
        playerName={skin.name}
        score={score}
        nextLevelNumber={levelIndex + 2}
        onNextLevel={nextLevel}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
        paddingBottom: "90px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: `${CANVAS_WIDTH}px`,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ display: "block", width: "100%", height: "auto" }}
        />

        {/* Question overlay */}
        {gameState === "dead" && question && (
          <QuestionModal
            question={question}
            selectedAnswer={selectedAnswer}
            answerResult={answerResult}
            lives={lives}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {/* Touch controls — below canvas so they never cover the game */}
      <div
        style={{
          width: "100%",
          maxWidth: `${CANVAS_WIDTH}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onTouchStart={(e) => { e.preventDefault(); setTouch("left", true); }}
            onTouchEnd={() => setTouch("left", false)}
            onMouseDown={() => setTouch("left", true)}
            onMouseUp={() => setTouch("left", false)}
            onMouseLeave={() => setTouch("left", false)}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
            }}
          >
            ←
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); setTouch("right", true); }}
            onTouchEnd={() => setTouch("right", false)}
            onMouseDown={() => setTouch("right", true)}
            onMouseUp={() => setTouch("right", false)}
            onMouseLeave={() => setTouch("right", false)}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
            }}
          >
            →
          </button>
        </div>
        <button
          onTouchStart={(e) => { e.preventDefault(); setTouch("jump", true); }}
          onTouchEnd={() => setTouch("jump", false)}
          onMouseDown={() => setTouch("jump", true)}
          onMouseUp={() => setTouch("jump", false)}
          onMouseLeave={() => setTouch("jump", false)}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(243,156,18,0.8)",
            border: "2px solid #F39C12",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          JUMP
        </button>
      </div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setShowControls(!showControls)}
            style={{ background: "none", border: "none", color: "#7F8C8D", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}
          >
            {showControls ? "Hide" : "Show"} keyboard controls
          </button>
          <button
            onClick={() => {
              const next = !muted;
              setMuted(next);
              audioManager.setMuted(next);
              audioManager.resume();
              try {
                localStorage.setItem("pm_muted", String(next));
              } catch {
                /* ignore */
              }
            }}
            style={{ background: "none", border: "none", color: "#7F8C8D", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
        {showControls && (
          <p style={{ color: "#BDC3C7", fontSize: "0.8rem", margin: 0 }}>
            Arrow keys or WASD to move | Space or W/↑ to jump
          </p>
        )}
      </div>

    </div>
  );
}
