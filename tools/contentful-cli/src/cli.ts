import { Command } from "commander";
import { registerCptApplyCommand } from "./commands/cpt-apply";
import { registerCptExportCommand } from "./commands/cpt-export";
import { registerEntriesImportCommand } from "./commands/entries-import";
import { registerMigrationsCommand } from "./commands/migrations";
import { registerPromptTemplateCommand } from "./commands/prompt-template";
import { registerScriptsCommand } from "./commands/scripts";

const program = new Command();
program
  .name("contentful-cli")
  .description(
    "Manage Contentful content: scripts, migrations, content types, entries, and prompts",
  )
  .version("0.1.0");

registerScriptsCommand(program);
registerMigrationsCommand(program);
registerCptExportCommand(program);
registerCptApplyCommand(program);
registerEntriesImportCommand(program);
registerPromptTemplateCommand(program);

program.parseAsync(process.argv);
