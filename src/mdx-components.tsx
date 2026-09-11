import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';

type AnchorProps = ComponentPropsWithoutRef<'a'>;

function MdxLink({ href, children, ...props }: AnchorProps) {
  const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <a {...props} href={href}>
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: MdxLink,
  };
}
