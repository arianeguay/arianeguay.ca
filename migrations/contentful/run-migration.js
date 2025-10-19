#!/usr/bin/env node

/**
 * Runner script for Contentful migrations
 * Usage: node run-migration.js <migration-file>
 * Example: node run-migration.js contentful_forms_migration.js
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env.locale");
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log(
    "No .env file found in project root. You need to provide environment variables manually.",
  );
}

// Get migration file from command line arguments
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error("Error: No migration file specified");
  console.log("Usage: node run-migration.js <migration-file>");
  console.log("Example: node run-migration.js contentful_forms_migration.js");
  process.exit(1);
}

// Check if migration file exists
const migrationPath = path.resolve(__dirname, migrationFile);
if (!fs.existsSync(migrationPath)) {
  console.error(
    `Error: Migration file '${migrationFile}' not found in contentful directory`,
  );
  process.exit(1);
}

// Required environment variables
const requiredEnvVars = [
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ENV_ID",
  "CONTENTFUL_CMA_TOKEN",
];

// Check if all required environment variables are set
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    `Error: Missing required environment variables: ${missingVars.join(", ")}`,
  );
  console.log(
    "Make sure these variables are defined in your .env file or environment.",
  );
  process.exit(1);
}

// Extract environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const envId = process.env.CONTENTFUL_ENV_ID || "master";
const cmaToken = process.env.CONTENTFUL_CMA_TOKEN;

// Construct the full path to the migration file
const migrationFilePath = path.join("migrations", "contentful", migrationFile);

// Build the command
console.log(`Running migration: ${migrationFile}`);
console.log(`Space ID: ${spaceId}`);
console.log(`Environment: ${envId}`);

// Execute the contentful-migration command
const child = spawn(
  "npx",
  [
    "contentful-migration",
    "--space-id",
    spaceId,
    "--environment-id",
    envId,
    "--access-token",
    cmaToken,
    migrationFilePath,
  ],
  {
    stdio: "inherit",
    shell: true,
  },
);

child.on("close", (code) => {
  if (code === 0) {
    console.log("Migration completed successfully");
  } else {
    console.error(`Migration failed with exit code ${code}`);
    process.exit(code);
  }
});
