# 🧰 Windsurf Prompt — Contentful CLI Builder

## 🎯 Goal

Create a **Node/TypeScript CLI tool** to manage all my **Contentful content** (content types, entries, migrations, and scripts), using `.env`, JSON import/export, and generating ChatGPT prompt templates.

---

## 🧭 Context

- Utility scripts: `tools\contentful\scripts`
- Migrations: `tools\contentful\migrations` (previously run with `run-migration` before splitting folders)
- Launchers: `tools\contentful\run-migration.bat`, `tools\contentful\run-migration.js`
- New data to import: `tools\contentful\projects-data`

---

## ✅ CLI Features

1. Run Node scripts from `tools\contentful\scripts`
2. Run migration scripts from `tools\contentful\migrations` **with .env injection**
3. Fetch and export all Content Types (CPT) as JSON  
   `https://api.contentful.com/spaces/{space_id}/environments/{environment_id}/content_types`
4. Import entries from JSONs (like `tools\contentful\scripts\seed_services.js` but per CPT)
5. Create new CPTs from JSON
6. Update existing CPTs from JSON (diff-based)
7. Generate a ChatGPT data generation prompt or Markdown template

---

## 🧩 Technical Stack

- Language: **TypeScript**
- CLI: `commander` or `yargs`
- ENV: `dotenv`
- SDK: `contentful-management`
- Structure:
  ```
  /tools/contentful-cli/
    src/
      cli.ts
      commands/
        scripts.ts
        migrations.ts
        cpt-export.ts
        cpt-apply.ts
        entries-import.ts
        prompt-template.ts
      lib/
        contentfulClient.ts
        fs.ts
        diff.ts
        logger.ts
        env.ts
  ```

---

## 🔐 Environment Variables

Needs to be in a `.env` file in the /tools/contentful folder.

```
CONTENTFUL_SPACE_ID=
CONTENTFUL_ENVIRONMENT=
CONTENTFUL_MANAGEMENT_TOKEN=
CONTENTFUL_DELIVERY_TOKEN=
```

---

## 🖥️ CLI Commands

```
pnpm contentful:run-script --name seed_services
pnpm contentful:migrate --all
pnpm contentful:cpt:export --out data/cpt
pnpm contentful:cpt:apply --in data/cpt
pnpm contentful:entries:import --type project --in tools\contentful\projects-data
pnpm contentful:prompt --type project > prompts/project.md
```

---

## 🧪 Acceptance Criteria

- Migrations run with `.env` injection, clear logs
- JSON export: one file per CPT
- Safe updates via diff for CPTs
- Entry import: upsert, locale-aware
- Prompt generation outputs Markdown ready to use

---

## 🧱 Implementation Notes

- Use `contentful-management` for publish/update logic
- Use REST for fetching content types if needed
- Support `--dry-run`, `--yes`, `--only`, `--locale`, `--upsert`

---

## 🧷 Example Prompt Template (Generated)

```md
# Prompt — Generate Contentful Entries (project)

You generate valid JSON entries matching the `project` content type.

Constraints:

- Locale: fr
- Respect field types and required validations.

Example JSON:
{
"fields": {
"internalTitle": { "en-US": "Portfolio — NT2" },
"title": { "fr": "Recherche NT2 — Exposition Re|Search" },
"kind": { "fr": "project" }
}
}
```

---

## 🧰 Scripts

```json
{
  "scripts": {
    "contentful:run-script": "ts-node tools/contentful-cli/src/cli.ts scripts",
    "contentful:migrate": "ts-node tools/contentful-cli/src/cli.ts migrate",
    "contentful:cpt:export": "ts-node tools/contentful-cli/src/cli.ts cpt-export",
    "contentful:cpt:apply": "ts-node tools/contentful-cli/src/cli.ts cpt-apply",
    "contentful:entries:import": "ts-node tools/contentful-cli/src/cli.ts entries-import",
    "contentful:prompt": "ts-node tools/contentful-cli/src/cli.ts prompt-template"
  }
}
```

---

## 📘 README Tasks

Include setup, env var explanation, command usage, and limitations.
