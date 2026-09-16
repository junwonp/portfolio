'use client';

import React from 'react';

import { iconLink, typeVariants } from './IconLink.css';
import OutboundLink from './OutboundLink';

interface Props {
  href: string;
  title: string;
  ariaLabel?: string;
  children: React.ReactNode;
  type?: 'github' | 'linkedin' | 'normal';
  className?: string;
}

export default function IconLink({
  href,
  title,
  ariaLabel,
  children,
  type = 'normal',
  className = '',
}: Props) {
  const typeClass = typeVariants[type] || '';
  const combinedClass = `${iconLink} ${typeClass} ${className}`.trim();

  return (
    <OutboundLink
      href={href}
      className={combinedClass}
      title={title}
      ariaLabel={ariaLabel || title}
    >
      {children}
    </OutboundLink>
  );
}
