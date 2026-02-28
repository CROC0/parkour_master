import { LeaderboardEntry } from "@/types";

export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SB_HDRS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!SB_URL) return [];
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/leaderboard?select=id,name,time_ms,year_level&order=time_ms.asc&limit=10`,
      { headers: SB_HDRS },
    );
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export async function submitToLeaderboard(
  name: string,
  timeMs: number,
  yearLevel: number,
): Promise<number | null> {
  if (!SB_URL) return null;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/leaderboard`, {
      method: "POST",
      headers: { ...SB_HDRS, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ name: name.slice(0, 20), time_ms: Math.round(timeMs), year_level: yearLevel }),
    });
    if (!res.ok) return null;
    const [row] = (await res.json()) as LeaderboardEntry[];
    return row?.id ?? null;
  } catch (err) {
    console.error("Leaderboard submission failed:", err);
    return null;
  }
}

export function formatTime(ms: number): string {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}.${Math.floor((s % 1) * 10)}`;
}
