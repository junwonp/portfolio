# Portfolio

A personal portfolio website built with the **Next.js 16 App Router API** on [vinext](https://www.npmjs.com/package/vinext) and deployed to **Cloudflare Workers**.

## Tech Stack

- **Framework**: [vinext](https://www.npmjs.com/package/vinext) with the [Next.js 16](https://nextjs.org/) App Router API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Custom Properties
- **Content**: MDX
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Workers (via `vinext` and `@cloudflare/vite-plugin`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start the local production server
pnpm preview

# Deploy to Cloudflare Workers
pnpm deploy
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── lib/
│   ├── components/   # React components
│   ├── content/      # MDX project content
│   ├── data/         # Static data and constants
│   ├── hooks/        # Custom React hooks
│   ├── server/       # Server-side utilities (D1, R2)
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Shared utility functions
└── proxy.ts          # Request proxy
```

## License

Private
