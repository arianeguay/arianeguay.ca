import fs from 'fs';
import path from 'path';

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function listFiles(dir: string, exts?: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  if (!exts || !exts.length) return files;
  return files.filter(f => exts.includes(path.extname(f)));
}

export function readJsonFile<T = any>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export function readJsonFilesInDir<T = any>(dir: string): { file: string; data: T }[] {
  const files = listFiles(dir, ['.json']);
  return files.map(f => {
    const full = path.join(dir, f);
    return { file: full, data: readJsonFile<T>(full) };
  });
}
