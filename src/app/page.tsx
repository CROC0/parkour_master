import Game from '@/components/Game';
import AdUnit from '@/components/AdUnit';

export default function Home() {
  return (
    <>
      <Game />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <AdUnit slotId="3191988436" format="horizontal" responsive />
      </div>
    </>
  );
}
