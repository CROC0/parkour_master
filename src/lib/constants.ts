import { PlayerSkin } from "@/types";

export const CANVAS_WIDTH = 800;
export const GRAVITY = 0.6;
export const JUMP_FORCE = -13;
export const MOVE_SPEED = 6;
export const PLAYER_W = 28;
export const PLAYER_H = 44;
// CANVAS_HEIGHT (450) + 80 — hardcoded to avoid circular import with levelGenerator
export const DEATH_Y = 530;

export const LS_KEY = "parkour_master_profile";

export const SHIRT_COLORS = ["#FF6B35", "#E74C3C", "#3498DB", "#2ECC71", "#9B59B6", "#FF69B4", "#F1C40F", "#1ABC9C", "#ECF0F1", "#E67E22"];

export const PANTS_COLORS = ["#2C3E50", "#1a1a1a", "#1E5B2A", "#8B4513", "#7F8C8D"];

export const DEFAULT_SKIN: PlayerSkin = {
  name: "",
  shirtColor: "#FF6B35",
  pantsColor: "#2C3E50",
};
