"use client";

interface Props {
  playerName: string;
  score: number;
  nextLevelNumber: number;
  onNextLevel: () => void;
}

export default function LevelCompleteScreen({
  playerName,
  score,
  nextLevelNumber,
  onNextLevel,
}: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #134e5e, #71b280)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
        <div style={{ fontSize: "70px", marginBottom: "16px" }}>⭐</div>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 12px" }}>Level Complete!</h1>
        <p style={{ fontSize: "1.1rem", margin: "0 0 8px" }}>
          {playerName ? `Brilliant work, ${playerName}!` : "Brilliant work!"} Score: {score}
        </p>
        <p style={{ fontSize: "0.95rem", margin: "0 0 28px", color: "#A8E6CF" }}>
          Level {nextLevelNumber} coming up...
        </p>
        <button
          onClick={onNextLevel}
          style={{
            padding: "16px 40px",
            borderRadius: "12px",
            border: "none",
            background: "#27AE60",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Next Level →
        </button>
      </div>
    </div>
  );
}
