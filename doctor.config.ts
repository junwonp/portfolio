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
    ],
  },
});
