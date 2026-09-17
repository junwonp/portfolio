import { getAssetObjectResponse } from '@/lib/server/assets/response';
import { getCloudflareEnv } from '@/lib/server/infrastructure/database';

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const [{ filename }, cloudflareEnv] = await Promise.all([params, getCloudflareEnv()]);
  return getAssetObjectResponse(cloudflareEnv?.portfolio_assets, filename);
}
