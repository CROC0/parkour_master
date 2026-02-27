"use client";

import { PlayerSkin } from "@/types";
import { SHIRT_COLORS, PANTS_COLORS } from "@/lib/constants";
import PlayerPreview from "@/components/PlayerPreview";

interface Props {
  skin: PlayerSkin;
  onSkinChange: (next: PlayerSkin) => void;
  onSelectYear: (year: number) => void;
}

export default function YearSelectScreen({ skin, onSkinChange, onSelectYear }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", color: "white", maxWidth: "640px", width: "100%" }}>
        <div style={{ fontSize: "52px", marginBottom: "4px" }}>🏃</div>
        <h1 style={{ fontSize: "2.4rem", margin: "0 0 4px", color: "#F39C12", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          Parkour Master
        </h1>
        <p style={{ fontSize: "1rem", margin: "0 0 24px", color: "#BDC3C7" }}>
          Run, jump, and learn! Answer questions to keep playing.
        </p>

        {/* ── Player setup card ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Preview */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ background: "rgba(135,206,235,0.3)", borderRadius: "10px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <PlayerPreview skin={skin} />
            </div>
            <span style={{ color: "#BDC3C7", fontSize: "0.8rem" }}>Preview</span>
          </div>

          {/* Controls */}
          <div style={{ flex: "1 1 200px", textAlign: "left" }}>
            {/* Name */}
            <label style={{ color: "#ECF0F1", fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Your Name
            </label>
            <input
              type="text"
              maxLength={16}
              placeholder="Enter your name..."
              value={skin.name}
              onChange={(e) => onSkinChange({ ...skin, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                fontSize: "0.95rem",
                marginBottom: "14px",
                outline: "none",
              }}
            />

            {/* Shirt colours */}
            <label style={{ color: "#ECF0F1", fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Shirt Colour
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
              {SHIRT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onSkinChange({ ...skin, shirtColor: c })}
                  title={c}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c,
                    border: skin.shirtColor === c ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    boxShadow: skin.shirtColor === c ? "0 0 0 2px #F39C12" : "none",
                    transition: "all 0.15s",
                  }}
                />
              ))}
            </div>

            {/* Pants colours */}
            <label style={{ color: "#ECF0F1", fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              Pants Colour
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {PANTS_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onSkinChange({ ...skin, pantsColor: c })}
                  title={c}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c,
                    border: skin.pantsColor === c ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    boxShadow: skin.pantsColor === c ? "0 0 0 2px #F39C12" : "none",
                    transition: "all 0.15s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Year select ── */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.15)" }}>
          <h2 style={{ margin: "0 0 16px", color: "#ECF0F1", fontSize: "1.2rem" }}>
            What year are you in at school?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((y) => (
              <button
                key={y}
                onClick={() => onSelectYear(y)}
                style={{
                  padding: "13px 8px",
                  borderRadius: "10px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const b = e.target as HTMLButtonElement;
                  b.style.background = "#F39C12";
                  b.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const b = e.target as HTMLButtonElement;
                  b.style.background = "rgba(255,255,255,0.1)";
                  b.style.transform = "scale(1)";
                }}
              >
                Year {y}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <p style={{ color: "#7F8C8D", fontSize: "0.8rem", margin: 0 }}>
            Based on the Australian School Curriculum
          </p>
          <a
            href="/leaderboard"
            style={{ color: "#F39C12", fontSize: "0.8rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
          >
            🏆 Leaderboard
          </a>
        </div>
      </div>
    </div>
  );
}
