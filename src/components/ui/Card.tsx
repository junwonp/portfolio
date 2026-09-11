import type { HTMLAttributes, ReactNode } from 'react';

import * as styles from './Card.css';

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'> {
  variant?: 'surface' | 'glass';
  radius?: 'sm' | 'lg';
  as?: 'div' | 'section';
  className?: string;
  children: ReactNode;
}

export default function Card({
  variant = 'surface',
  radius = 'lg',
  as = 'div',
  className = '',
  children,
  ...rest
}: CardProps) {
  const surfaceClass = radius === 'sm' ? styles.surfaceSm : styles.surface;
  const glassClass = radius === 'sm' ? styles.glassSm : styles.glass;
  const cardClass = variant === 'glass' ? glassClass : surfaceClass;
  const Tag = as;

  return (
    <Tag className={`${cardClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
