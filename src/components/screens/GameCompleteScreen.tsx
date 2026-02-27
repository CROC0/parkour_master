"use client";

import { PlayerSkin, LeaderboardEntry } from "@/types";
import { SB_URL, formatTime } from "@/lib/leaderboard";

interface Props {
  skin: PlayerSkin;
  score: number;
  finalTimeMs: number;
  leaderboard: LeaderboardEntry[];
  lbLoading: boolean;
  lbError: string;
  myEntryId: number | null;
  submitting: boolean;
  submitName: string;
  onSubmitNameChange: (name: string) => void;
  onSubmitScore: () => void;
  onPlayAgain: () => void;
}

export default function GameCompleteScreen({
  skin,
  score,
  finalTimeMs,
  leaderboard,
  lbLoading,
  lbError,
  myEntryId,
  submitting,
  submitName,
  onSubmitNameChange,
  onSubmitScore,
  onPlayAgain,
}: Props) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0f3460, #533483)",
        overflowY: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", color: "white", padding: "32px 20px", maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ fontSize: "64px", marginBottom: "8px" }}>🏆</div>
        <h1 style={{ fontSize: "2.2rem", margin: "0 0 6px", color: "#F39C12" }}>
          {skin.name ? `Amazing, ${skin.name}!` : "You Win!"}
        </h1>
        <p style={{ fontSize: "1rem", margin: "0 0 16px", color: "#BDC3C7" }}>
          You completed all 10 levels!
        </p>

        {/* Time + Score */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 24px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "0.7rem", color: "#BDC3C7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Time</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#F39C12", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(finalTimeMs)}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 24px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "0.7rem", color: "#BDC3C7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Score</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2ECC71" }}>{score}</div>
          </div>
        </div>

        {/* Submit */}
        {SB_URL &&
          (myEntryId === null ? (
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.15)" }}>
              <p style={{ margin: "0 0 10px", fontWeight: "bold", fontSize: "0.95rem" }}>
                Add your time to the leaderboard
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Your name"
                  value={submitName}
                  onChange={(e) => onSubmitNameChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSubmitScore()}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={onSubmitScore}
                  disabled={submitting || !submitName.trim()}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: submitting || !submitName.trim() ? "#555" : "#F39C12",
                    color: "white",
                    fontWeight: "bold",
                    cursor: submitting || !submitName.trim() ? "default" : "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {submitting ? "..." : "Submit"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(46,204,113,0.15)", borderRadius: "14px", padding: "12px 16px", marginBottom: "20px", border: "1px solid rgba(46,204,113,0.4)" }}>
              <p style={{ margin: 0, color: "#2ECC71", fontWeight: "bold" }}>Time submitted!</p>
            </div>
          ))}

        {/* Leaderboard */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.15)" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "0.85rem", color: "#BDC3C7", letterSpacing: "2px", textTransform: "uppercase" }}>
            Global Leaderboard
          </h2>
          {!SB_URL ? (
            <p style={{ color: "#7F8C8D", fontSize: "0.85rem", margin: 0 }}>
              Set up Supabase to enable the global leaderboard.
            </p>
          ) : lbLoading ? (
            <p style={{ color: "#BDC3C7", margin: 0 }}>Loading...</p>
          ) : lbError ? (
            <p style={{ color: "#E74C3C", margin: 0, fontSize: "0.85rem" }}>{lbError}</p>
          ) : leaderboard.length === 0 ? (
            <p style={{ color: "#BDC3C7", margin: 0, fontSize: "0.85rem" }}>
              No scores yet — be the first!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {leaderboard.map((entry, i) => {
                const isMe = entry.id === myEntryId;
                return (
                  <div
                    key={entry.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: isMe ? "rgba(243,156,18,0.2)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isMe ? "rgba(243,156,18,0.5)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                  >
                    <span style={{ width: "28px", textAlign: "center", fontSize: i < 3 ? "1.1rem" : "0.85rem", color: i < 3 ? "inherit" : "#7F8C8D" }}>
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </span>
                    <span style={{ flex: 1, textAlign: "left", fontWeight: isMe ? "bold" : "normal", color: isMe ? "#F39C12" : "#ECF0F1", fontSize: "0.95rem" }}>
                      {entry.name}
                    </span>
                    <span style={{ color: "#7F8C8D", fontSize: "0.75rem" }}>Yr {entry.year_level}</span>
                    <span style={{ fontWeight: "bold", color: i === 0 ? "#F39C12" : "#ECF0F1", fontVariantNumeric: "tabular-nums", fontSize: "0.95rem" }}>
                      {formatTime(entry.time_ms)}
                    </span>
                    {isMe && <span style={{ fontSize: "0.7rem", color: "#F39C12" }}>you</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onPlayAgain}
            style={{
              padding: "14px 40px",
              borderRadius: "12px",
              border: "none",
              background: "#F39C12",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Play Again
          </button>
          <a
            href="/leaderboard"
            style={{
              padding: "14px 28px",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.3)",
              background: "transparent",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🏆 Full Leaderboard
          </a>
        </div>
      </div>
    </div>
  );
}
