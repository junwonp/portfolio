declare module '*.mdx' {
  const component: import('./lib/portfolio/projectDetailMdx').ProjectDetailMdxComponent;
  export default component;
  export const frontmatter: import('./lib/portfolio/projectTypes').PostMetadata;
}

// The Workers D1 test applies the deployed root `schema.sql` verbatim so the
// tested schema cannot drift from the one that is actually applied.
declare module '*.sql?raw' {
  const content: string;
  export default content;
}
