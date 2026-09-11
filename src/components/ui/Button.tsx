import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import * as styles from './Button.css';

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md';
type ButtonShape = 'pill' | 'circle' | 'rounded';

interface ButtonOwnProps {
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  iconOnly?: boolean;
  className?: string;
  children: ReactNode;
}

// Discriminated on `as` so button-only props (e.g. `type`, `disabled`) never
// leak onto the anchor branch, and `href` is required when rendering an anchor.
type ButtonAsButtonProps = ButtonOwnProps & {
  as?: 'button';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps | 'as'>;

type ButtonAsAnchorProps = ButtonOwnProps & {
  as: 'a';
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps | 'as' | 'href'>;

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

function buildClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  shape: ButtonShape,
  iconOnly: boolean,
  className: string,
): string {
  const iconOnlyClass = iconOnly ? (size === 'sm' ? styles.iconOnlySm : styles.iconOnlyMd) : '';
  return [
    styles.base,
    styles.variant[variant],
    styles.size[size],
    styles.shape[shape],
    iconOnlyClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export default function Button(props: ButtonProps) {
  if (props.as === 'a') {
    const {
      as,
      variant,
      size,
      shape,
      iconOnly = false,
      className = '',
      children,
      ...anchorProps
    } = props;
    return (
      <a className={buildClasses(variant, size, shape, iconOnly, className)} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    as,
    variant,
    size,
    shape,
    iconOnly = false,
    className = '',
    children,
    ...buttonProps
  } = props;
  // Default to type="button" so buttons never submit ancestor forms by accident
  return (
    <button
      className={buildClasses(variant, size, shape, iconOnly, className)}
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
    >
      {children}
    </button>
  );
}
