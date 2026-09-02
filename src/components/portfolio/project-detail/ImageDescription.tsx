/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { getOptimizedImageUrl } from "@/lib/utils/image";

import * as styles from "./ImageDescription.css";

interface Props {
  src: string;
  alt: string;
  mobileSrc?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".m4v"];

export default function ImageDescription({
  src,
  alt,
  mobileSrc,
  priority = false,
  width,
  height,
  children,
}: Props) {
  const isVideo = videoExtensions.some((ext) =>
    src.toLowerCase().endsWith(ext.toLowerCase())
  );
  const hasDimensions = !!(width && height);

  const [loaded, setLoaded] = useState(priority);
  const [prevPriority, setPrevPriority] = useState(priority);
  // Scroll reveal state — hidden styling is only applied after hydration so
  // the media stays visible without JavaScript
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isRevealed, setIsRevealed] = useState(priority);

  if (priority !== prevPriority) {
    setPrevPriority(priority);
    if (priority) {
      setLoaded(true);
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onLoad = () => {
    setLoaded(true);
  };

  // Image load handling
  useEffect(() => {
    if (priority) {
      return;
    }
    if (!imgRef.current) return;
    const el = imgRef.current;
    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("load", onLoad);
    };
  }, [priority]);

  // Reveal the media with a gentle rise when it first enters the viewport
  useEffect(() => {
    if (priority) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let revealed = false;
    const reveal = (cleanupScroll: () => void) => {
      if (revealed) return;
      revealed = true;
      setIsRevealed(true);
      observer.disconnect();
      cleanupScroll();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(cleanupScroll);
        }
      },
      { rootMargin: "120px", threshold: 0.01 }
    );

    // IntersectionObserver never fires for elements that jump over the
    // viewport instantly (TOC links), so back it up with a scroll check
    // while the media is still hidden
    const onScroll = () => {
      if (wrapper.getBoundingClientRect().top <= window.innerHeight) {
        reveal(cleanupScroll);
      }
    };
    const cleanupScroll = () =>
      window.removeEventListener("scroll", onScroll);

    observer.observe(wrapper);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      cleanupScroll();
    };
  }, [priority]);

  // Video load & intersection play handling
  useEffect(() => {
    if (!videoRef.current) return;
    const el = videoRef.current;

    el.addEventListener("canplay", onLoad);

    if (priority) {
      if (!el.src) {
        el.src = src;
        el.load();
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!el.src) {
              el.src = src;
              el.load();
            }
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    observer.observe(el);

    return () => {
      el.removeEventListener("canplay", onLoad);
      observer.disconnect();
    };
  }, [src, priority]);

  return (
    <figure className={styles.imageDescription}>
      <div
        ref={wrapperRef}
        className={[
          styles.mediaWrapper,
          loaded ? styles.loaded : "",
          isHydrated && !isRevealed ? styles.preReveal : "",
          isRevealed ? styles.revealed : "",
        ].join(" ")}
        style={
          width && height
            ? { aspectRatio: `${String(width)} / ${String(height)}` }
            : undefined
        }
      >
        {!loaded && hasDimensions && (
          <div className={styles.skeleton} aria-hidden="true"></div>
        )}
        {isVideo ? (
          <video
            ref={videoRef}
            title={alt}
            loop
            muted
            playsInline
            preload={priority ? "auto" : "none"}
            className={loaded || !hasDimensions ? styles.loaded : ""}
          >
            <track
              kind="captions"
              src="/captions/empty.vtt"
              label="No dialogue"
              default
            />
          </video>
        ) : mobileSrc ? (
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={getOptimizedImageUrl(mobileSrc, { width: 768 })}
            />
            <img
              ref={imgRef}
              src={getOptimizedImageUrl(src, { width })}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              onLoad={onLoad}
              className={loaded || !hasDimensions ? styles.loaded : ""}
            />
          </picture>
        ) : (
          <img
            ref={imgRef}
            src={getOptimizedImageUrl(src, { width })}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            onLoad={onLoad}
            className={loaded || !hasDimensions ? styles.loaded : ""}
          />
        )}
      </div>
      {children && <figcaption className={styles.figcaption}>{children}</figcaption>}
    </figure>
  );
}
