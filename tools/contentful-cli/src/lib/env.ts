import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export type Env = {
  CONTENTFUL_SPACE_ID: string;
  CONTENTFUL_ENVIRONMENT: string; // aka ENV_ID
  CONTENTFUL_MANAGEMENT_TOKEN: string; // aka CMA_TOKEN
  CONTENTFUL_DELIVERY_TOKEN?: string;
};

function tryLoadEnv(p: string) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    return p;
  }
  return undefined;
}

export function loadEnv(explicitPath?: string): { env: Env; loadedFrom?: string } {
  const tried: string[] = [];

  const candidates = [
    explicitPath,
    process.env.ENV_FILE,
    path.resolve(process.cwd(), '../contentful/.env.locale'),
    path.resolve(process.cwd(), '.env.locale'),
    path.resolve(process.cwd(), '.env'),
  ].filter(Boolean) as string[];

  let loadedFrom: string | undefined;
  for (const p of candidates) {
    tried.push(p);
    const hit = tryLoadEnv(p);
    if (hit) { loadedFrom = hit; break; }
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID || '';
  const envId = process.env.CONTENTFUL_ENVIRONMENT || process.env.CONTENTFUL_ENV_ID || '';
  const mgmtToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN || process.env.CONTENTFUL_CMA_TOKEN || '';
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  const missing: string[] = [];
  if (!spaceId) missing.push('CONTENTFUL_SPACE_ID');
  if (!envId) missing.push('CONTENTFUL_ENVIRONMENT');
  if (!mgmtToken) missing.push('CONTENTFUL_MANAGEMENT_TOKEN');
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}\nTried env files: ${tried.join(' | ')}`);
  }

  return {
    env: {
      CONTENTFUL_SPACE_ID: spaceId,
      CONTENTFUL_ENVIRONMENT: envId,
      CONTENTFUL_MANAGEMENT_TOKEN: mgmtToken,
      CONTENTFUL_DELIVERY_TOKEN: deliveryToken,
    },
    loadedFrom,
  };
}
