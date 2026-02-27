"use client";

import { useEffect, useRef } from "react";
import { PlayerSkin } from "@/types";
import { makePlayer } from "@/lib/gameEngine";
import { drawPlayer } from "@/lib/renderer";

export default function PlayerPreview({ skin }: { skin: PlayerSkin }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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

  return (
    <canvas
      ref={ref}
      width={64}
      height={96}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
