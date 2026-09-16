'use client';

import type { ReactNode } from 'react';

import { reportOutboundLink } from '@/lib/analytics/outboundLinks';

interface Props {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
  title?: string;
}

/**
 * Anchor for external destinations. A single reporting layer owns the click
 * handler so one click produces exactly one analytics beacon; internal hrefs
 * are filtered out by `reportOutboundLink`.
 */
export default function OutboundLink({
  ariaLabel,
  children,
  className,
  href,
  onClick,
  title,
}: Props) {
  const handleClick = () => {
    reportOutboundLink(href);
    onClick?.();
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
