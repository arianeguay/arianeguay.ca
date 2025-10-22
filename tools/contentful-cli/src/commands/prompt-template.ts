import { Command } from 'commander';
import { createClientFromEnv } from '../lib/contentfulClient';

export function registerPromptTemplateCommand(program: Command) {
  program
    .command('prompt-template')
    .description('Generate a ChatGPT data generation prompt or Markdown template')
    .requiredOption('--type <id>', 'Content type ID')
    .option('--locale <code>', 'Locale code for example skeleton (e.g., fr-CA)', 'en-US')
    .option('--env <path>', 'Path to env file (defaults to tools/contentful/.env.locale)')
    .action(async (opts) => {
      const { getEnvironment } = createClientFromEnv(opts.env);
      const env = await getEnvironment();
      const ct = await env.getContentType(opts.type as string);

      const example: any = { fields: {} };
      for (const field of ct.fields) {
        const key = field.id;
        const type = field.type;
        const loc = opts.locale as string;
        switch (type) {
          case 'Symbol':
          case 'Text':
          case 'Slug':
            example.fields[key] = { [loc]: '' };
            break;
          case 'Integer':
          case 'Number':
            example.fields[key] = { [loc]: 0 };
            break;
          case 'Boolean':
            example.fields[key] = { [loc]: false };
            break;
          case 'RichText':
            example.fields[key] = { [loc]: { nodeType: 'document', data: {}, content: [] } };
            break;
          case 'Array':
            if (field.items?.type === 'Link' && field.items?.linkType === 'Entry') {
              example.fields[key] = { [loc]: [] };
            } else if (field.items?.type === 'Symbol') {
              example.fields[key] = { [loc]: [] };
            } else {
              example.fields[key] = { [loc]: [] };
            }
            break;
          case 'Link':
            if ((field as any).linkType === 'Asset' || (field as any).validations?.some((v: any) => v.linkMimetypeGroup)) {
              example.fields[key] = { [loc]: { sys: { type: 'Link', linkType: 'Asset', id: 'asset-id' } } };
            } else {
              example.fields[key] = { [loc]: { sys: { type: 'Link', linkType: 'Entry', id: 'entry-id' } } };
            }
            break;
          case 'Object':
            example.fields[key] = { [loc]: {} };
            break;
          case 'Location':
            example.fields[key] = { [loc]: { lat: 0, lon: 0 } };
            break;
          case 'Date':
            example.fields[key] = { [loc]: new Date().toISOString() };
            break;
          default:
            example.fields[key] = { [loc]: null };
        }
      }

      const md = `# Prompt — Generate Contentful Entries (${ct.sys.id})\n\nYou generate valid JSON entries for the Contentful content type \`${ct.sys.id}\`.\n\nConstraints:\n\n- Locale: ${opts.locale}\n- Respect field types, required flags, and validations.\n\nExample JSON:\n\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n`;
      // Print to stdout
      // eslint-disable-next-line no-console
      console.log(md);
    });
}
