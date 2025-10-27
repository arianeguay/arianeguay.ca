import { createClient, type Environment } from 'contentful-management';
import { loadEnv, type Env } from './env';

export type CmaContext = {
  env: Env;
  getEnvironment: () => Promise<Environment>;
};

export function createClientFromEnv(explicitEnvPath?: string): CmaContext {
  const { env } = loadEnv(explicitEnvPath);
  const mgmt = createClient({ accessToken: env.CONTENTFUL_MANAGEMENT_TOKEN });
  const getEnvironment = async (): Promise<Environment> => {
    const space = await mgmt.getSpace(env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(env.CONTENTFUL_ENVIRONMENT);
    return environment;
  };
  return { env, getEnvironment };
}
