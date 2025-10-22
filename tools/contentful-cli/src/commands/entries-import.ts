import path from 'path';
import { Command } from 'commander';
import { logger } from '../lib/logger';
import { ensureDir, readJsonFilesInDir } from '../lib/fs';
import { createClientFromEnv } from '../lib/contentfulClient';

export function registerEntriesImportCommand(program: Command) {
  program
    .command('entries-import')
    .description('Import entries from JSONs with upsert and locale support')
    .requiredOption('--type <id>', 'Content type ID to import')
    .option('--in <dir>', 'Input directory', 'data/entries')
    .option('--locale <locale>', 'Default locale (e.g., fr-CA, en-US)')
    .option('--upsert', 'Upsert entries')
    .option('--env <path>', 'Path to env file (defaults to tools/contentful/.env.locale)')
    .option('--dry-run', 'Show changes without applying')
    .action(async (opts) => {
      const { getEnvironment } = createClientFromEnv(opts.env);
      const inDir = path.resolve(process.cwd(), opts.in as string);
      ensureDir(inDir);

      const files = readJsonFilesInDir<any>(inDir);
      if (!files.length) {
        logger.info(`No entry JSON files found in ${inDir}`);
        return;
      }

      const env = await getEnvironment();
      let imported = 0;
      const ctId: string = opts.type as string;

      for (const { file, data } of files) {
        const sysId: string | undefined = data?.sys?.id;
        const fields = data?.fields ?? data; // support raw fields JSON too
        if (!fields || typeof fields !== 'object') {
          logger.warn(`Skipping ${file} (missing fields)`);
          continue;
        }
        logger.info(`Processing entry ${sysId ? `'${sysId}' ` : ''}from ${file}`);

        try {
          if (sysId) {
            // Try fetch existing
            try {
              const existing = await env.getEntry(sysId);
              existing.fields = { ...existing.fields, ...fields };
              if (!opts.dryRun) {
                const updated = await existing.update();
                await updated.publish();
              }
              imported++;
              continue;
            } catch (e: any) {
              // Not found or error; if upsert or create, fall through
              if (!opts.upsert) {
                logger.warn(`Entry '${sysId}' not found and --upsert not set. Skipping.`);
                continue;
              }
            }
          }

          // Create new entry
          if (!opts.dryRun) {
            const created = sysId
              ? await env.createEntryWithId(ctId, sysId, { fields })
              : await env.createEntry(ctId, { fields });
            await created.publish();
          }
          imported++;
        } catch (e: any) {
          logger.error(`Error importing entry ${sysId || '(new)'}: ${e?.message || e}`);
          throw e;
        }
      }

      logger.info(`Done. Imported/updated ${imported} entrie(s).`);
    });
}
