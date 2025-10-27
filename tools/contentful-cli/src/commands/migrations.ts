import path from 'path';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import { loadEnv } from '../lib/env';
import { logger } from '../lib/logger';
import fs from 'fs';

export function registerMigrationsCommand(program: Command) {
  program
    .command('migrate')
    .description('Run Contentful migration scripts from tools/contentful/migrations with .env injection')
    .option('--all', 'Run all migration files in order')
    .option('--only <file>', 'Run only a specific migration file')
    .option('--dry-run', 'Show command without executing')
    .option('--env <path>', 'Path to env file (defaults to tools/contentful/.env.locale)')
    .action(async (opts) => {
      const { env, loadedFrom } = loadEnv(opts.env);
      if (loadedFrom) logger.info(`Loaded env from ${loadedFrom}`);

      const migrationsDir = path.resolve(process.cwd(), '../contentful/migrations');
      if (!fs.existsSync(migrationsDir)) {
        throw new Error(`Migrations folder not found: ${migrationsDir}`);
      }

      const runOne = (file: string) => {
        const scriptPath = path.resolve(migrationsDir, file);
        const args = [
          'contentful-migration',
          '--space-id', env.CONTENTFUL_SPACE_ID,
          '--environment-id', env.CONTENTFUL_ENVIRONMENT,
          '--access-token', env.CONTENTFUL_MANAGEMENT_TOKEN,
          scriptPath,
        ];
        logger.info(`> npx ${args.join(' ')}`);
        if (opts.dryRun) return 0;
        const res = spawnSync('npx', args, { stdio: 'inherit', shell: true });
        return res.status ?? 1;
      };

      if (opts.only) {
        const status = runOne(opts.only);
        process.exit(status);
      }

      if (opts.all) {
        const files = fs.readdirSync(migrationsDir)
          .filter(f => f.endsWith('.js'))
          .sort();
        for (const f of files) {
          logger.info(`Running migration: ${f}`);
          const status = runOne(f);
          if (status !== 0) process.exit(status);
        }
        logger.info('All migrations completed');
        return;
      }

      logger.info('No action specified. Use --all or --only <file>.');
    });
}
