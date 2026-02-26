'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: number;
  name: string;
  time_ms: number;
  year_level: number;
}

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function formatTime(ms: number): string {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}.${Math.floor((s % 1) * 10)}`;
}

async function fetchAll(yearFilter?: number): Promise<LeaderboardEntry[]> {
  if (!SB_URL) return [];
  let url = `${SB_URL}/rest/v1/leaderboard?select=id,name,time_ms,year_level&order=time_ms.asc&limit=50`;
  if (yearFilter) url += `&year_level=eq.${yearFilter}`;
  const res = await fetch(url, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchAll(yearFilter)
      .then(setEntries)
      .catch(() => setError('Could not load scores. Try again later.'))
      .finally(() => setLoading(false));
  }, [yearFilter]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #020208 0%, #08082A 100%)',
      color: '#ECF0F1',
      fontFamily: 'Arial, sans-serif',
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🏆</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 4px', color: '#F39C12' }}>
            Global Leaderboard
          </h1>
          <p style={{ color: '#BDC3C7', fontSize: '0.85rem', margin: 0 }}>
            Parkour Master — Fastest Times
          </p>
        </div>

        {/* Controls row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '14px', gap: '10px', flexWrap: 'wrap',
        }}>
          <Link href="/" style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#ECF0F1',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}>
            ← Play Game
          </Link>

          <select
            value={yearFilter ?? ''}
            onChange={e => setYearFilter(e.target.value ? Number(e.target.value) : undefined)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#ECF0F1',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <option value="">All Year Levels</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(y => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>

        {/* Table card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}>
          {/* Column headings */}
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 62px 80px',
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.08)',
            fontSize: '0.7rem', color: '#BDC3C7',
            textTransform: 'uppercase', letterSpacing: '1px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span>#</span>
            <span>Name</span>
            <span style={{ textAlign: 'center' }}>Year</span>
            <span style={{ textAlign: 'right' }}>Time</span>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#BDC3C7' }}>Loading…</div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#E74C3C' }}>{error}</div>
          ) : entries.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#7F8C8D' }}>
              No scores yet{yearFilter ? ` for Year ${yearFilter}` : ''}. Be the first!
            </div>
          ) : (
            entries.map((entry, i) => (
              <div key={entry.id} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 62px 80px',
                padding: '12px 16px',
                borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                background: i === 0 ? 'rgba(243,156,18,0.08)' : i === 1 ? 'rgba(243,156,18,0.04)' : i === 2 ? 'rgba(243,156,18,0.02)' : 'transparent',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: i < 3 ? '1.2rem' : '0.9rem', color: '#BDC3C7' }}>
                  {i < 3 ? MEDALS[i] : i + 1}
                </span>
                <span style={{
                  fontWeight: i < 3 ? 'bold' : 'normal',
                  fontSize: '0.95rem',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {entry.name}
                </span>
                <span style={{ textAlign: 'center', color: '#BDC3C7', fontSize: '0.85rem' }}>
                  Yr {entry.year_level}
                </span>
                <span style={{
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontVariantNumeric: 'tabular-nums',
                  color: i === 0 ? '#F39C12' : '#ECF0F1',
                  fontSize: '0.95rem',
                }}>
                  {formatTime(entry.time_ms)}
                </span>
              </div>
            ))
          )}
        </div>

        {!loading && entries.length > 0 && (
          <p style={{ textAlign: 'center', color: '#7F8C8D', fontSize: '0.75rem', marginTop: '12px' }}>
            Showing top {entries.length} times
          </p>
        )}
      </div>
    </div>
  );
}
