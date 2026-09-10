'use client';

import { Children, type KeyboardEvent, type ReactNode, useRef, useState } from 'react';

import * as styles from './ImageGallery.css';
import { getVisibleImageIndex, scrollToImage } from './nativeGallery';

interface Props {
  children?: ReactNode;
}

export default function ImageGallery({ children }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemCount = Children.count(children);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const slider = sliderRef.current;
    if (!slider || slider.scrollWidth <= slider.clientWidth) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    scrollToImage(slider, currentIndex + (event.key === 'ArrowRight' ? 1 : -1), itemCount);
  };

  return (
    <div className={styles.imageGallery}>
      <div
        ref={sliderRef}
        className={styles.sliderContainer}
        role="group"
        aria-label="Image gallery"
        tabIndex={itemCount > 1 ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onScroll={(event) => setCurrentIndex(getVisibleImageIndex(event.currentTarget, itemCount))}
      >
        {children}
      </div>
      {itemCount > 1 && (
        <div className={styles.pager} aria-live="polite" aria-atomic="true">
          {currentIndex + 1}/{itemCount}
        </div>
      )}
    </div>
  );
}
