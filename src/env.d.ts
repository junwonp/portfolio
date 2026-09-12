declare module '*.mdx' {
  const component: import('./lib/portfolio/projectDetailMdx').ProjectDetailMdxComponent;
  export default component;
  export const frontmatter: import('./lib/portfolio/projectTypes').PostMetadata;
}
