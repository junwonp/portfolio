import { defineConfig } from 'react-doctor/api';

export default defineConfig({
  ignore: {
    overrides: [
      {
        // These render <picture> with pre-generated responsive variants, so
        // next/image cannot replace their <img>.
        files: [
          'src/components/portfolio/project-detail/ProjectLightbox.tsx',
          'src/components/portfolio/project-detail/ImageDescription.tsx',
        ],
        rules: ['react-doctor/nextjs-no-img-element'],
      },
      {
        // This effect mirrors measured ref geometry into state on resize and
        // active-item changes; it is not state derived from props.
        files: ['src/components/portfolio/navigation/BaseSideNav.tsx'],
        rules: ['react-doctor/no-adjust-state-on-prop-change'],
      },
      {
        // Both effects are intentionally mount-only / stable-ref driven (see
        // the matching biome-ignore notes); listing the ref-held helpers as
        // dependencies would re-run them on every render.
        files: ['src/components/analytics/AnalyticsTracker.tsx'],
        rules: ['react-doctor/exhaustive-deps'],
      },
      {
        // This legacy route is a migration shim: it only ever returns a
        // permanent redirect to the /r/ short-link namespace or a 404, so it
        // never renders a document that a search preview could describe.
        // The pattern is glob-escaped: `[[]x[]]` matches a literal `[x]`
        // directory, and `*` stands in for the `(portfolio)` route group
        // because backslash escaping is normalised away.
        files: ['src/app/*/[[]locale[]]/[[]slug[]]/page.tsx'],
        rules: ['react-doctor/nextjs-missing-metadata'],
      },
      {
        // Pre-existing and intentional: this theme initializer must run
        // synchronously before first paint to apply the stored theme without a
        // flash, so it stays a blocking native script. Converting it to
        // next/script is behaviour-sensitive and belongs in its own change.
        files: ['src/app/layout.tsx'],
        rules: ['react-doctor/nextjs-no-native-script'],
      },
    ],
  },
});
