"use client";

import { Question } from "@/types";

interface Props {
  question: Question;
  selectedAnswer: number | null;
  answerResult: "correct" | "wrong" | null;
  lives: number;
  onAnswer: (idx: number) => void;
}

export default function QuestionModal({
  question,
  selectedAnswer,
  answerResult,
  lives,
  onAnswer,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "clamp(16px, 4vw, 28px)",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          maxHeight: "90%",
          overflowY: "auto",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>
          {answerResult === "correct" ? "🎉" : answerResult === "wrong" ? "😅" : "💀"}
        </div>
        <p style={{ color: "#7F8C8D", fontSize: "0.8rem", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1px" }}>
          {question.subject}
        </p>
        <h2 style={{ fontSize: "1.15rem", margin: "0 0 20px", color: "#2C3E50", lineHeight: 1.4 }}>
          {question.question}
        </h2>

        {answerResult === null ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                style={{
                  padding: "12px 8px",
                  borderRadius: "10px",
                  border: "2px solid #E0E0E0",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#2C3E50",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  const b = e.target as HTMLButtonElement;
                  b.style.background = "#3498DB";
                  b.style.color = "white";
                  b.style.borderColor = "#3498DB";
                }}
                onMouseLeave={(e) => {
                  const b = e.target as HTMLButtonElement;
                  b.style.background = "white";
                  b.style.color = "#2C3E50";
                  b.style.borderColor = "#E0E0E0";
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {question.options.map((opt, i) => {
                const isCorrect = i === question.answerIndex;
                const isSelected = i === selectedAnswer;
                return (
                  <div
                    key={i}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "10px",
                      background: isCorrect ? "#27AE60" : isSelected ? "#E74C3C" : "#F5F5F5",
                      color: isCorrect || isSelected ? "white" : "#999",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      border: `2px solid ${isCorrect ? "#27AE60" : isSelected ? "#E74C3C" : "#E0E0E0"}`,
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: answerResult === "correct" ? "#27AE60" : "#E74C3C" }}>
              {answerResult === "correct"
                ? "✓ Correct! Keep going!"
                : `✗ The answer was: ${question.options[question.answerIndex]}`}
            </p>
            {lives <= 0 && (
              <p style={{ margin: "8px 0 0", color: "#E74C3C", fontSize: "0.85rem" }}>
                No lives left! Returning to menu...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
