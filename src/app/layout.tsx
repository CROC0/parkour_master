import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parkour Master — Learn & Play',
  description: 'A fun 2D parkour platformer game for kids, based on the Australian School Curriculum. Answer questions to keep playing!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
