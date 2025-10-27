import { Command } from "commander";
import path from "path";
import { createClientFromEnv } from "../lib/contentfulClient";
import { ensureDir, readJsonFilesInDir } from "../lib/fs";
import { logger } from "../lib/logger";

export function registerEntriesImportCommand(program: Command) {
  program
    .command("entries-import")
    .description("Import entries from JSONs with upsert and locale support")
    .requiredOption("--type <id>", "Content type ID to import")
    .option("--in <dir>", "Input directory", "data/entries")
    .option("--locale <locale>", "Default locale (e.g., en, fr)")
    .option("--upsert", "Upsert entries")
    .option(
      "--env <path>",
      "Path to env file (defaults to tools/contentful/.env.locale)",
    )
    .option("--dry-run", "Show changes without applying")
    .option("--no-publish", "Create/update without publishing")
    .option("--only-prefix <prefix>", "Only process files whose name starts with this prefix")
    .action(async (opts) => {
      const { getEnvironment } = createClientFromEnv(opts.env);
      const inDir = path.resolve(process.cwd(), opts.in as string);
      ensureDir(inDir);

      let files = readJsonFilesInDir<any>(inDir);
      if (opts.onlyPrefix) {
        files = files.filter(({ file }) => path.basename(file).startsWith(opts.onlyPrefix as string));
      }
      if (!files.length) {
        logger.info(`No entry JSON files found in ${inDir}`);
        return;
      }

      const env = await getEnvironment();
      let imported = 0;
      const ctId: string = opts.type as string;

      // Simple filename prefix-to-type mapping to filter mixed folders
      const prefixMap: Record<string, string> = {
        'workItem_': 'workItem',
        'highlight_': 'highlightItem',
        'metric_': 'metricItem',
        'projectMeta_': 'projectMeta',
        'linkItem_': 'linkItem',
        'seo_': 'seo',
        'techTag_': 'techTag',
      };

      for (const { file, data } of files) {
        const base = path.basename(file);
        // Determine prefix and mapped type
        const matchedPrefix = Object.keys(prefixMap).find((p) => base.startsWith(p));
        const mappedType = matchedPrefix ? prefixMap[matchedPrefix] : undefined;
        if (mappedType && mappedType !== ctId) {
          // Skip files that don't match the requested type
          continue;
        }

        const sysId: string | undefined = data?.sys?.id;
        const fields = data?.fields ?? data; // support raw fields JSON too
        if (!fields || typeof fields !== "object") {
          logger.warn(`Skipping ${file} (missing fields)`);
          continue;
        }
        logger.info(
          `Processing entry ${sysId ? `'${sysId}' ` : ""}from ${file}`,
        );

        try {
          if (sysId) {
            // Try fetch existing
            try {
              const existing = await env.getEntry(sysId);
              existing.fields = { ...existing.fields, ...fields };
              if (!opts.dryRun) {
                const updated = await existing.update();
                if (!opts.noPublish) {
                  await updated.publish();
                }
              }
              imported++;
              continue;
            } catch (e: any) {
              // Only proceed to create if truly NotFound
              const notFound = e?.name === 'NotFound' || e?.response?.status === 404;
              if (!notFound) {
                logger.error(`Error reading existing entry '${sysId}': ${e?.message || e}`);
                continue;
              }
              if (!opts.upsert) {
                logger.warn(
                  `Entry '${sysId}' not found and --upsert not set. Skipping.`,
                );
                continue;
              }
            }
          }

          // Create new entry
          if (!opts.dryRun) {
            try {
              const created = sysId
                ? await env.createEntryWithId(ctId, sysId, { fields })
                : await env.createEntry(ctId, { fields });
              if (!opts.noPublish) {
                await created.publish();
              }
            } catch (createErr: any) {
              // If already exists (409), fallback to update path
              const isConflict = createErr?.response?.status === 409 || createErr?.status === 409;
              if (isConflict && sysId) {
                try {
                  const existing = await env.getEntry(sysId);
                  existing.fields = { ...existing.fields, ...fields };
                  const updated = await existing.update();
                  if (!opts.noPublish) {
                    await updated.publish();
                  }
                } catch (updateErr: any) {
                  throw updateErr;
                }
              } else {
                throw createErr;
              }
            }
          }
          imported++;
        } catch (e: any) {
          logger.error(
            `Error importing entry ${sysId || "(new)"}: ${e?.message || e}`,
          );
          // Continue with next file instead of aborting the entire batch
          continue;
        }
      }

      logger.info(`Done. Imported/updated ${imported} entrie(s).`);
    });
}
