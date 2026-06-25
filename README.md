# Portfolio

A personal portfolio website built with **Next.js 16** and deployed on **Cloudflare Workers** via [OpenNext](https://opennext.js.org/cloudflare).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Custom Properties
- **Content**: MDX
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Workers (via `@opennextjs/cloudflare`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview locally in Workers runtime
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
└── proxy.ts          # Edge proxy (middleware)
```

## License

Private
