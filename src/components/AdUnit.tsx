"use client";

import { useEffect } from "react";

interface AdUnitProps {
  slotId: string;       // Replace with your AdSense ad slot ID
  format?: string;      // e.g. "auto", "rectangle", "horizontal"
  responsive?: boolean;
  style?: React.CSSProperties;
}

export default function AdUnit({
  slotId,
  format = "auto",
  responsive = true,
  style,
}: AdUnitProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* AdSense not loaded yet or blocked by ad blocker */
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-1877862214525424" // Replace with your publisher ID
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
