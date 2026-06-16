import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distIndexPath = join(process.cwd(), 'dist', 'index.html');

if (!existsSync(distIndexPath)) {
  throw new Error('dist/index.html does not exist. Run npm run build first.');
}

const html = readFileSync(distIndexPath, 'utf8');
const externalAssetPattern = /\/assets\//;

if (externalAssetPattern.test(html)) {
  throw new Error('dist/index.html still depends on external /assets files.');
}

if (!/<style\b[^>]*>[\s\S]*<\/style>/.test(html)) {
  throw new Error('dist/index.html does not contain inlined CSS.');
}

if (!/<script\s+type=["']module["'][^>]*>[\s\S]*<\/script>/.test(html)) {
  throw new Error('dist/index.html does not contain inlined module JavaScript.');
}

const closingScriptTagCount = html.match(/<\/script>/gi)?.length ?? 0;
if (closingScriptTagCount !== 1) {
  throw new Error(`dist/index.html should contain exactly one closing script tag, found ${closingScriptTagCount}.`);
}

console.log('Build output is self-contained.');
