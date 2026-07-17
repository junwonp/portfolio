"use client";

import React, { useEffect, useRef, useState } from "react";

import styles from "./ImageGallery.module.css";

interface Props {
  children?: React.ReactNode;
}

const DRAG_THRESHOLD = 50;
const MOBILE_BREAKPOINT = 768;

export default function ImageGallery({ children }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Resize handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev < itemCount - 1 ? prev + 1 : prev));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) return;
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = startXRef.current;
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragOffset(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || !isDraggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    currentXRef.current = e.touches[0].clientX;
    setDragOffset(currentXRef.current - startXRef.current);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile || !isDraggingRef.current) return;
    e.stopPropagation();
    const diff = currentXRef.current - startXRef.current;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) prev();
      else next();
    }

    setIsDragging(false);
    isDraggingRef.current = false;
    startXRef.current = 0;
    currentXRef.current = 0;
    setDragOffset(0);
  };

  const handleMouseStart = (e: MouseEvent) => {
    startXRef.current = e.clientX;
    currentXRef.current = startXRef.current;
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragOffset(0);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.clientX;
    setDragOffset(currentXRef.current - startXRef.current);
  };

  const handleMouseEnd = () => {
    if (!isDraggingRef.current) return;
    const diff = currentXRef.current - startXRef.current;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) prev();
      else next();
    }

    setIsDragging(false);
    isDraggingRef.current = false;
    startXRef.current = 0;
    currentXRef.current = 0;
    setDragOffset(0);
  };

  // Bind native drag/touch events on sliderRef
  useEffect(() => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const opts: AddEventListenerOptions = { passive: false };

    el.addEventListener("touchstart", handleTouchStart, opts);
    el.addEventListener("touchmove", handleTouchMove, opts);
    el.addEventListener("touchend", handleTouchEnd, opts);
    el.addEventListener("touchcancel", handleTouchEnd, opts);
    el.addEventListener("mousedown", handleMouseStart);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseEnd);

    // Dynamic item count check
    setItemCount(el.children.length);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
      el.removeEventListener("mousedown", handleMouseStart);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handlers reference stable refs
  }, [isMobile, itemCount]);

  return (
    <div
      ref={galleryRef}
      className={`${styles["image-gallery"]} ${isMobile ? styles.mobile : ""}`}
      role="group"
      onKeyDown={isMobile && itemCount > 1 ? handleKeyDown : undefined}
      tabIndex={isMobile && itemCount > 1 ? 0 : undefined}
      aria-label={isMobile && itemCount > 1 ? "Image gallery" : undefined}
    >
      {children &&
        (isMobile ? (
          <>
            <div
              ref={sliderRef}
              className={`${styles["slider-container"]} ${
                isDragging ? styles.dragging : ""
              }`}
              style={{
                transform: `translateX(calc(-${currentIndex} * 100% + ${dragOffset}px))`,
              }}
              draggable={false}
              role="presentation"
            >
              {children}
            </div>
            {itemCount > 1 && (
              <div
                className={styles.pager}
                aria-live="polite"
                aria-atomic="true"
                aria-label={`Image ${currentIndex + 1} of ${itemCount}`}
              >
                {currentIndex + 1}/{itemCount}
              </div>
            )}
          </>
        ) : (
          children
        ))}
    </div>
  );
}
