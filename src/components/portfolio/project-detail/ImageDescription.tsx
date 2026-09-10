import type { ReactNode } from 'react';

import { getResponsiveImageProps } from '@/lib/utils/image';

import AutoVideo from './AutoVideo';
import * as styles from './ImageDescription.css';

interface Props {
  src: string;
  alt: string;
  mobileSrc?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  children?: ReactNode;
}

export default function ImageDescription({
  src,
  alt,
  mobileSrc,
  priority = false,
  width,
  height,
  children,
}: Props) {
  const isVideo = /\.(mp4|webm|mov|avi|m4v)$/i.test(src);
  const image = getResponsiveImageProps(src);
  const mobile = mobileSrc ? getResponsiveImageProps(mobileSrc) : undefined;

  return (
    <figure className={styles.imageDescription}>
      <div className={styles.mediaWrapper}>
        {isVideo ? (
          <AutoVideo src={src} title={alt} width={width} height={height} />
        ) : (
          <picture>
            {mobile && (
              <source
                media="(max-width: 768px)"
                srcSet={mobile.srcSet ?? mobile.src}
                sizes={mobile.sizes}
                width={mobile.width}
                height={mobile.height}
              />
            )}
            <img
              {...image}
              alt={alt}
              width={width ?? image.width}
              height={height ?? image.height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
            />
          </picture>
        )}
      </div>
      {children && <figcaption className={styles.figcaption}>{children}</figcaption>}
    </figure>
  );
}
