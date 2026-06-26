import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/.open-next/**',
      '**/.vinext/**',
      '**/dist/**',
      '**/out/**',
      '**/build/**',
      'cloudflare-env.d.ts',
      'next-env.d.ts',
      '**/scripts/**',
      '**/.wrangler/**',
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side-effect imports (e.g. import 'normalize.css')
            ['^\\u0000'],
            // React and Next.js libraries
            ['^react', '^next', '^@?\\w'],
            // Internal path aliases
            ['^@/'],
            // Same-directory relative: ./
            ['^\\.(?!\\.)'],
            // Parent-directory relative: ../
            ['^\\.\\./'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  prettier,
];

export default eslintConfig;
