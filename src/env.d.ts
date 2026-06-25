declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const component: ComponentType<unknown>;
  export default component;
}

export {};
