declare module '*.mdx' {
  const component: import('react').ComponentType<unknown>;
  export default component;
  export const frontmatter: import('./lib/types/post').PostMetadata;
}
