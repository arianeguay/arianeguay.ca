import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import { logger } from '../lib/logger';
import { ensureDir } from '../lib/fs';
import { createClientFromEnv } from '../lib/contentfulClient';

export function registerCptExportCommand(program: Command) {
  program
    .command('cpt-export')
    .description('Export Content Types as JSON (one file per type)')
    .option('--out <dir>', 'Output directory', 'data/cpt')
    .option('--env <path>', 'Path to env file (defaults to tools/contentful/.env.locale)')
    .action(async (opts) => {
      const { getEnvironment } = createClientFromEnv(opts.env);
      const outDir = path.resolve(process.cwd(), opts.out as string);
      ensureDir(outDir);

      // Paginate through all content types
      const limit = 100;
      let skip = 0;
      let total = 0;
      let exported = 0;

      logger.info(`Exporting Content Types to ${outDir}`);

      const env = await getEnvironment();
      do {
        const res = await env.getContentTypes({ skip, limit });
        total = res.total ?? 0;
        for (const ct of res.items ?? []) {
          const id = ct.sys.id;
          const filePath = path.join(outDir, `${id}.json`);
          fs.writeFileSync(filePath, JSON.stringify(ct, null, 2), 'utf-8');
          exported++;
          logger.info(`✔ wrote ${filePath}`);
        }
        skip += (res.items?.length ?? 0);
      } while (skip < total);

      logger.info(`Done. Exported ${exported} content type(s).`);
    });
}
