declare module '*.mdx' {
  const component: import('./lib/content/projectDetailMdx').ProjectDetailMdxComponent;
  export default component;
  export const frontmatter: import('./lib/types/post').PostMetadata;
}
