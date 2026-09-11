'use client';

import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  title: string;
  width?: number;
  height?: number;
}

export default function AutoVideo({ src, title, width, height }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play muted GIF-style, but honor reduced-motion by never starting.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (query.matches) {
        el.pause();
      } else {
        el.play().catch(() => {});
      }
    };

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      title={title}
      aria-label={title}
      width={width}
      height={height}
      loop
      muted
      playsInline
      preload="metadata"
    >
      <track kind="captions" src="/captions/empty.vtt" label="No dialogue" default />
    </video>
  );
}
