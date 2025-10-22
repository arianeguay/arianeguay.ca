import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import { loadEnv } from '../lib/env';
import { logger } from '../lib/logger';

export function registerScriptsCommand(program: Command) {
  program
    .command('scripts')
    .description('Run a Node script from tools/contentful/scripts with env injection')
    .requiredOption('--name <name>', 'Script filename without extension')
    .option('--env <path>', 'Path to env file (defaults to tools/contentful/.env.locale)')
    .action((opts) => {
      const { loadedFrom } = loadEnv(opts.env);
      if (loadedFrom) logger.info(`Loaded env from ${loadedFrom}`);

      const scriptsDir = path.resolve(process.cwd(), '../contentful/scripts');
      const candidate = path.join(scriptsDir, `${opts.name}.js`);
      if (!fs.existsSync(candidate)) {
        throw new Error(`Script not found: ${candidate}`);
      }
      logger.info(`> node ${candidate}`);
      const res = spawnSync('node', [candidate], { stdio: 'inherit', shell: true });
      process.exit(res.status ?? 1);
    });
}
