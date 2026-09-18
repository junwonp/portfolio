/* eslint-disable @next/next/no-img-element -- static responsive assets are served without an image optimizer */
'use client';

import { ChevronLeft, ChevronRight, Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import { cardSurface } from '@/components/ui/surface.css';
import { getResponsiveImageProps } from '@/lib/utils/image';
import { getVisibleImageIndex, scrollToImage } from './nativeGallery';
import * as styles from './ProjectLightbox.css';

interface LightboxImage {
  src: string;
  mobileSrc?: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: LightboxImage[];
  variant?: 'default' | 'phone';
}

function ResponsiveImage({
  image,
  fullscreen = false,
}: {
  image: LightboxImage;
  fullscreen?: boolean;
}) {
  const sizes = fullscreen ? '100vw' : '(max-width: 640px) 100vw, 50vw';
  const mobile = image.mobileSrc ? getResponsiveImageProps(image.mobileSrc, sizes) : null;
  return (
    <picture>
      {mobile && (
        <source
          media="(max-width: 640px)"
          srcSet={mobile.srcSet ?? mobile.src}
          sizes={sizes}
          width={mobile.width}
          height={mobile.height}
        />
      )}
      <img
        {...getResponsiveImageProps(image.src, sizes)}
        alt={image.alt}
        loading={fullscreen ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

interface ViewerProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

function LightboxViewer({ images, initialIndex, onClose }: ViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeIndexRef = useRef(initialIndex);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const captionId = useId();
  const activeImage = images[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    const track = trackRef.current;
    if (!dialog || !track) return;
    dialog.showModal();
    scrollToImage(track, initialIndex, images.length, 'instant');
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const observer = new ResizeObserver(() => {
      scrollToImage(track, activeIndexRef.current, images.length, 'instant');
    });
    observer.observe(track);
    return () => {
      observer.disconnect();
      dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [initialIndex, images.length]);

  const navigate = (index: number) => {
    if (!trackRef.current) return;
    // Intermediate smooth-scroll events can overwrite the next keyboard target.
    const nextIndex = scrollToImage(trackRef.current, index, images.length, 'instant');
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    navigate(activeIndexRef.current + (event.key === 'ArrowRight' ? 1 : -1));
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.overlay}
      aria-label="Image viewer"
      onClose={(event) => {
        // Ignore a queued cleanup event if Strict Mode has reopened the dialog.
        if (!event.currentTarget.open) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.overlayClose}
        onClick={() => dialogRef.current?.close()}
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <div
        ref={trackRef}
        className={styles.carouselTrack}
        role="group"
        aria-label="Image carousel"
        onScroll={(event) => {
          const index = getVisibleImageIndex(event.currentTarget, images.length);
          activeIndexRef.current = index;
          setActiveIndex(index);
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className={styles.carouselSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`Image ${index + 1} of ${images.length}`}
            aria-describedby={index === activeIndex && activeImage?.caption ? captionId : undefined}
          >
            <ResponsiveImage image={image} fullscreen />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.overlayNav} ${styles.prev}`}
            onClick={() => navigate(activeIndexRef.current - 1)}
            aria-label="Previous image"
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={`${styles.overlayNav} ${styles.next}`}
            onClick={() => navigate(activeIndexRef.current + 1)}
            aria-label="Next image"
            disabled={activeIndex === images.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      <footer className={styles.overlayFooter}>
        {activeImage?.caption && (
          <p id={captionId} className={styles.overlayCaption}>
            {activeImage.caption}
          </p>
        )}
        {images.length > 1 && (
          <div className={styles.overlayDots} role="group" aria-label="Choose image">
            {images.map((image, index) => (
              <button
                type="button"
                key={image.src}
                className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
                onClick={() => navigate(index)}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </footer>
    </dialog>
  );
}

export default function ProjectLightbox({ images, variant = 'default' }: Props) {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  return (
    <>
      {images.length > 0 && (
        <ul
          className={`${styles.lightboxMasonry} ${variant === 'phone' ? styles.phonePreview : ''}`}
        >
          {images.map((image, index) => (
            <li key={image.src} className={styles.masonryItemCell}>
              <button
                type="button"
                className={`${styles.masonryItem} ${cardSurface}`}
                onClick={() => setOpenedIndex(index)}
                aria-label={
                  index === 0 && images.length > 1
                    ? `View ${image.alt} fullscreen, ${images.length} photos`
                    : `View ${image.alt} fullscreen`
                }
              >
                <ResponsiveImage image={image} />
                <span className={styles.zoomHint} aria-hidden="true">
                  <ZoomIn size={18} />
                </span>
                {index === 0 && images.length > 1 && (
                  <span className={styles.moreIndicator} aria-hidden="true">
                    <span className={styles.indicatorContent}>
                      <ImageIcon size={24} />
                      <span className={styles.label}>{images.length} photos</span>
                    </span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {openedIndex !== null && images[openedIndex] && (
        <LightboxViewer
          images={images}
          initialIndex={openedIndex}
          onClose={() => setOpenedIndex(null)}
        />
      )}
    </>
  );
}
