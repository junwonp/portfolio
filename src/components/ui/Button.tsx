import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import * as styles from './Button.css';

// Native props of both targets intersected: `type` narrows to the button
// literal union and the rest merge cleanly, so one interface covers both tags.
type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

interface ButtonProps extends NativeButtonProps {
  variant: 'primary' | 'ghost' | 'outline' | 'danger';
  size: 'sm' | 'md';
  shape: 'pill' | 'circle' | 'rounded';
  iconOnly?: boolean;
  as?: 'button' | 'a';
  children: ReactNode;
}

export default function Button({
  as = 'button',
  variant,
  size,
  shape,
  iconOnly = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const iconOnlyClass = iconOnly ? (size === 'sm' ? styles.iconOnlySm : styles.iconOnlyMd) : '';
  const classes = [
    styles.base,
    styles.variant[variant],
    styles.size[size],
    styles.shape[shape],
    iconOnlyClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (as === 'a') {
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }

  // Default to type="button" so buttons never submit ancestor forms by accident
  return (
    <button className={classes} {...rest} type={rest.type ?? 'button'}>
      {children}
    </button>
  );
}
