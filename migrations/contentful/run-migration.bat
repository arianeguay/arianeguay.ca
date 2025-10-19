@echo off
REM Run Contentful migration with environment variables from .env file
REM Usage: run-migration.bat <migration-file>
REM Example: run-migration.bat contentful_forms_migration.js

IF "%1"=="" (
  echo Error: No migration file specified
  echo Usage: run-migration.bat ^<migration-file^>
  echo Example: run-migration.bat contentful_forms_migration.js
  exit /b 1
)

node run-migration.js %1
