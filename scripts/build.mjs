import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// Force working directory
process.chdir(projectRoot);
console.log(`Working directory: ${process.cwd()}`);

// Clean dist directory with retry
if (fs.existsSync(distDir)) {
  try {
    fs.rmSync(distDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 500 });
  } catch (e) {
    console.warn('Notice: Could not clean dist directory completely, continuing...');
  }
}

const { build } = await import('astro');
try {
  await build({ root: projectRoot });
  console.log('✓ Astro build completed successfully!');
} catch (err) {
  if (err && err.code === 'EBUSY') {
    console.log('Notice: Windows file lock during chunk unlink; verifying dist/index.html...');
    const indexHtml = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexHtml)) {
      console.error('Astro build failed:', err);
      process.exit(1);
    }
  } else {
    console.error('Astro build failed:', err);
    process.exit(1);
  }
}

// Run Pagefind static indexing
console.log('Running Pagefind search indexer...');
try {
  const pagefindBin = path.join(projectRoot, 'node_modules', 'pagefind', 'lib', 'runner', 'bin.cjs');
  execSync(`node "${pagefindBin}" --site "${distDir}"`, { stdio: 'inherit' });
  console.log('✓ Pagefind search indexing completed successfully!');
} catch (err) {
  console.warn('Notice: Pagefind indexing encountered non-fatal error:', err);
}
