import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const articlesDir = path.join(projectRoot, 'src', 'content', 'articles');

console.log('Running content validation suite across all published articles...');

// Read all articles recursively
function getArticleFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getArticleFiles(fullPath));
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const articleFiles = getArticleFiles(articlesDir);
console.log(`Found ${articleFiles.length} article files to validate.`);

if (articleFiles.length < 100) {
  console.error(`ERROR: Expected at least 100 articles, but found only ${articleFiles.length}!`);
  process.exit(1);
}

const seenTitles = new Set();
const seriesOrders = new Map();
let errors = 0;

for (const file of articleFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  if (!frontmatterMatch) {
    console.error(`ERROR: Missing frontmatter in ${file}`);
    errors++;
    continue;
  }

  const fm = frontmatterMatch[1];
  const titleMatch = fm.match(/title:\s*"([^"]+)"/);
  const seriesMatch = fm.match(/series:\s*"([^"]+)"/);
  const orderMatch = fm.match(/seriesOrder:\s*(\d+)/);

  if (!titleMatch) {
    console.error(`ERROR: Missing title in ${file}`);
    errors++;
  } else {
    const title = titleMatch[1];
    if (seenTitles.has(title)) {
      console.error(`ERROR: Duplicate article title detected: "${title}" in ${file}`);
      errors++;
    }
    seenTitles.add(title);
  }

  if (seriesMatch && orderMatch) {
    const key = `${seriesMatch[1]}-${orderMatch[1]}`;
    if (seriesOrders.has(key)) {
      console.error(`ERROR: Duplicate seriesOrder detected for ${key} in ${file}`);
      errors++;
    }
    seriesOrders.set(key, file);
  }
}

if (errors > 0) {
  console.error(`Validation failed with ${errors} errors!`);
  process.exit(1);
}

console.log(`✓ All ${articleFiles.length} articles passed strict schema, uniqueness, and series validation!`);
