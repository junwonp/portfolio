/* eslint-disable @next/next/no-img-element -- native img needed for drag/carousel lightbox */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";

import { getOptimizedImageUrl } from "@/lib/utils/image";

import styles from "./ProjectLightbox.module.css";
import { useLightboxDrag } from "./useLightboxDrag";

export interface LightboxImage {
  src: string;
  mobileSrc?: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: LightboxImage[];
  variant?: "default" | "phone";
}

export default function ProjectLightbox({ images, variant = "default" }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  const activeImage = activeIndex !== null ? images[activeIndex] : null;
  const atEnd = activeIndex === images.length - 1;
  const atStart = activeIndex === 0;
  const dotIndices = images.map((_, i) => i);
  const nextImage =
    activeIndex !== null && activeIndex < images.length - 1
      ? images[activeIndex + 1]
      : null;
  const prevImage =
    activeIndex !== null && activeIndex > 0 ? images[activeIndex - 1] : null;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const getSrc = (image: LightboxImage) => {
    const rawSrc = isMobile && image.mobileSrc ? image.mobileSrc : image.src;
    return getOptimizedImageUrl(rawSrc, { width: isMobile ? 768 : 1200 });
  };

  const close = () => {
    setActiveIndex(null);
  };

  const toggleChrome = () => {
    setChromeVisible((prev) => !prev);
  };

  const next = () => {
    if (activeIndex === null || activeIndex === images.length - 1) return;
    setActiveIndex((prev) => (prev !== null ? prev + 1 : 0));
  };

  const prev = () => {
    if (activeIndex === null || activeIndex === 0) return;
    setActiveIndex((prev) => (prev !== null ? prev - 1 : 0));
  };

  const open = (index: number) => {
    setActiveIndex(index);
    setChromeVisible(true);
  };

  const {
    dragX,
    isSnapping,
    hasDraggedRef,
  } = useLightboxDrag({
    overlayRef,
    activeIndex,
    imagesLength: images.length,
    setActiveIndex,
    atStart,
    atEnd,
  });

  // Keyboard accessibility
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close/prev/next are stable
  }, [activeIndex]);

  const onOverlayClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    toggleChrome();
  };

  return (
    <>
      <div
        className={`${styles["lightbox-masonry"]} ${
          isMobile ? styles.mobile : ""
        } ${variant === "phone" ? styles["phone-preview"] : ""}`}
      >
        {isMobile && images.length > 1 ? (
          <button
            className={`${styles["masonry-item"]} ${styles["first-only"]}`}
            onClick={() => open(0)}
            aria-label={`View all ${images.length} images`}
          >
            <img src={getSrc(images[0])} alt={images[0].alt} loading="lazy" />
            <div className={styles["more-indicator"]}>
              <div className={styles["indicator-content"]}>
                <ImageIcon size={24} />
                <span className={styles.label}>
                  전체 {images.length}장의 사진 보기
                </span>
              </div>
            </div>
          </button>
        ) : (
          images.map((image, i) => (
            <button
              key={i}
              className={styles["masonry-item"]}
              onClick={() => open(i)}
              aria-label={`View ${image.alt} fullscreen`}
            >
              <img src={getSrc(image)} alt={image.alt} loading="lazy" />
              <span className={styles["zoom-hint"]} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </span>
            </button>
          ))
        )}
      </div>

      {activeIndex !== null && activeImage !== null && (
        <div
          ref={overlayRef}
          className={`${styles.overlay} ${!chromeVisible ? styles["chrome-hidden"] : ""}`}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-label="Image viewer"
          onClick={onOverlayClick}
        >
          {/* Close */}
          <button
            className={styles["overlay-close"]}
            onClick={close}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Carousel */}
          <div className={styles["overlay-image-area"]}>
            <div
              className={`${styles["carousel-track"]} ${
                isSnapping ? styles.snapping : ""
              }`}
              style={
                {
                  "--drag-x": `${dragX}px`,
                } as React.CSSProperties
              }
            >
              <div className={styles["carousel-slide"]}>
                {prevImage !== null && (
                  <img
                    src={getSrc(prevImage)}
                    alt={prevImage.alt}
                    draggable="false"
                  />
                )}
              </div>
              <div className={styles["carousel-slide"]}>
                <img
                  src={getSrc(activeImage)}
                  alt={activeImage.alt}
                  draggable="false"
                />
              </div>
              <div className={styles["carousel-slide"]}>
                {nextImage !== null && (
                  <img
                    src={getSrc(nextImage)}
                    alt={nextImage.alt}
                    draggable="false"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          {images.length > 1 && (
            <>
              <button
                className={`${styles["overlay-nav"]} ${styles.prev}`}
                onClick={prev}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={`${styles["overlay-nav"]} ${styles.next}`}
                onClick={next}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Footer */}
          <div className={styles["overlay-footer"]}>
            {activeImage.caption && (
              <p className={styles["overlay-caption"]}>{activeImage.caption}</p>
            )}
            {images.length > 1 && (
              <div className={styles["overlay-dots"]} aria-hidden="true">
                {dotIndices.map((i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === activeIndex ? styles.active : ""}`}
                    onClick={() => open(i)}
                    aria-label={`Go to image ${i + 1}`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
