import { env } from 'cloudflare:workers';

import { getAssetObjectResponse } from '@/lib/server/assetResponse';

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { filename } = await params;
  return getAssetObjectResponse(env.portfolio_assets, filename);
}
