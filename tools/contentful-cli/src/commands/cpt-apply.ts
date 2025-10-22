import path from 'path';
import { Command } from 'commander';
import { logger } from '../lib/logger';
import { ensureDir, readJsonFilesInDir } from '../lib/fs';
import { createClientFromEnv } from '../lib/contentfulClient';

export function registerCptApplyCommand(program: Command) {
  program
    .command('cpt-apply')
    .description('Apply/Create/Update Content Types from JSON (diff-based)')
    .option('--in <dir>', 'Input directory', 'data/cpt')
    .option('--env <path>', 'Path to env file (defaults to tools/contentful/.env.locale)')
    .option('--dry-run', 'Show changes without applying')
    .action(async (opts) => {
      const { getEnvironment } = createClientFromEnv(opts.env);
      const inDir = path.resolve(process.cwd(), opts.in as string);
      ensureDir(inDir);

      const files = readJsonFilesInDir<any>(inDir);
      if (!files.length) {
        logger.info(`No content type JSON files found in ${inDir}`);
        return;
      }

      const env = await getEnvironment();
      let applied = 0;

      for (const { file, data } of files) {
        const id = data?.sys?.id;
        if (!id) {
          logger.warn(`Skipping ${file} (missing sys.id)`);
          continue;
        }
        logger.info(`Processing content type '${id}' from ${file}`);

        try {
          const existing = await env.getContentType(id);
          // Update existing: set core props
          existing.name = data.name ?? existing.name;
          existing.description = data.description ?? existing.description;
          existing.displayField = data.displayField ?? existing.displayField;
          existing.fields = data.fields ?? existing.fields;
          logger.info(`Updating content type '${id}'`);
          if (!opts.dryRun) {
            const updated = await existing.update();
            await updated.publish();
          }
          applied++;
        } catch (e: any) {
          if (e?.name === 'NotFound' || e?.sys?.id === 'NotFound') {
            // Create new
            logger.info(`Creating content type '${id}'`);
            if (!opts.dryRun) {
              const created = await env.createContentTypeWithId(id, {
                name: data.name ?? id,
                description: data.description ?? '',
                displayField: data.displayField,
                fields: data.fields ?? [],
              });
              await created.publish();
            }
            applied++;
          } else {
            logger.error(`Error applying '${id}': ${e?.message || e}`);
            throw e;
          }
        }
      }

      logger.info(`Done. Applied ${applied} content type(s).`);
    });
}
