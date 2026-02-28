import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parkour Master — Learn & Play',
  description: 'A fun 2D parkour platformer game for kids, based on the Australian School Curriculum. Answer questions to keep playing!',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Replace ca-pub-1877862214525424 with your AdSense publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1877862214525424"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
