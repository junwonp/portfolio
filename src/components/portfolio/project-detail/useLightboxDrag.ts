import React, { useEffect, useRef, useState } from "react";

const VELOCITY_THRESHOLD = 0.3; // px/ms
const DRAG_THRESHOLD_RATIO = 0.25;

interface UseLightboxDragProps {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  atStart: boolean;
  atEnd: boolean;
}

export function useLightboxDrag({
  overlayRef,
  activeIndex,
  setActiveIndex,
  atStart,
  atEnd,
}: UseLightboxDragProps) {
  const [dragX, setDragX] = useState(0);
  const [, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isSnappingRef = useRef(false);
  const dragXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const velocitySamplesRef = useRef<{ x: number; t: number }[]>([]);

  const getVelocity = () => {
    const samples = velocitySamplesRef.current;
    if (samples.length < 2) return 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = last.t - first.t;
    return dt > 0 ? (last.x - first.x) / dt : 0;
  };

  const recordSample = (x: number) => {
    const now = performance.now();
    velocitySamplesRef.current.push({ x, t: now });
    const cutoff = now - 100;
    velocitySamplesRef.current = velocitySamplesRef.current.filter(
      (s) => s.t >= cutoff
    );
  };

  const startDrag = (x: number) => {
    if (isSnappingRef.current) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = x;
    setDragX(0);
    dragXRef.current = 0;
    velocitySamplesRef.current = [{ x, t: performance.now() }];
  };

  const moveDrag = (x: number) => {
    if (!isDraggingRef.current) return;
    let offset = x - startXRef.current;
    if (Math.abs(offset) > 5) hasDraggedRef.current = true;

    // Rubber-band resistance at edges
    if (atStart && offset > 0) offset = offset * 0.3;
    else if (atEnd && offset < 0) offset = offset * 0.3;

    setDragX(offset);
    dragXRef.current = offset;
    recordSample(x);
  };

  const navigateWithAnimation = async (
    direction: "next" | "prev",
    containerWidth: number
  ) => {
    setIsSnapping(true);
    isSnappingRef.current = true;
    const targetOffset =
      direction === "next" ? -containerWidth : containerWidth;
    setDragX(targetOffset);
    dragXRef.current = targetOffset;

    await new Promise((r) => setTimeout(r, 300));

    setIsSnapping(false);
    isSnappingRef.current = false;
    setDragX(0);
    dragXRef.current = 0;

    setActiveIndex((prev) => {
      if (prev === null) return null;
      return direction === "next" ? prev + 1 : prev - 1;
    });
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;

    const velocity = getVelocity();
    const containerWidth = overlayRef.current?.offsetWidth ?? window.innerWidth;
    const threshold = containerWidth * DRAG_THRESHOLD_RATIO;

    const shouldGoNext =
      (dragXRef.current < -threshold || velocity < -VELOCITY_THRESHOLD) &&
      !atEnd;
    const shouldGoPrev =
      (dragXRef.current > threshold || velocity > VELOCITY_THRESHOLD) &&
      !atStart;

    if (shouldGoNext) {
      void navigateWithAnimation("next", containerWidth);
    } else if (shouldGoPrev) {
      void navigateWithAnimation("prev", containerWidth);
    } else {
      setIsSnapping(true);
      isSnappingRef.current = true;
      setDragX(0);
      dragXRef.current = 0;
      setTimeout(() => {
        setIsSnapping(false);
        isSnappingRef.current = false;
      }, 350);
    }
  };

  // Touch and mouse events on overlay
  useEffect(() => {
    if (!overlayRef.current) return;
    const el = overlayRef.current;

    const onTouchStart = (e: TouchEvent) => {
      startDrag(e.touches[0].clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      moveDrag(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      endDrag();
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button")) return;
      startDrag(e.clientX);
    };
    const onMouseMove = (e: MouseEvent) => {
      moveDrag(e.clientX);
    };
    const onMouseUp = () => {
      endDrag();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startDrag/moveDrag/endDrag use stable refs
  }, [activeIndex, isSnapping, atStart, atEnd]);

  return {
    dragX,
    isSnapping,
    hasDraggedRef,
    startDrag,
    moveDrag,
    endDrag,
  };
}
