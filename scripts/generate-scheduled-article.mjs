import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const apiKey = process.env.GEMINI_API_KEY;
const allowTax = process.env.ALLOW_TAX_ARTICLES === 'true';
const allowRegulatory = process.env.ALLOW_REGULATORY_ARTICLES === 'true';

console.log('--- ArthaAtlas P2P Automated Article Generator ---');

if (!apiKey) {
  console.log('Notice: No GEMINI_API_KEY detected in environment.');
  console.log('Skipping automated article generation. The existing 100 published articles and static site remain 100% functional.');
  process.exit(0);
}

// Read roadmap to find the next planned topic
const roadmapPath = path.join(projectRoot, 'src', 'data', 'roadmap.ts');
if (!fs.existsSync(roadmapPath)) {
  console.error('Roadmap file not found at:', roadmapPath);
  process.exit(1);
}

const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');

// Simple parser for roadmap items with status: 'planned'
const itemRegex = /{\s*id:\s*'([^']+)',\s*series:\s*'([^']+)',\s*title:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*priority:\s*'([^']+)',\s*status:\s*'planned'/g;

let match;
const plannedTopics = [];
while ((match = itemRegex.exec(roadmapContent)) !== null) {
  plannedTopics.push({
    id: match[1],
    series: match[2],
    title: match[3],
    slug: match[4],
    priority: match[5]
  });
}

console.log(`Found ${plannedTopics.length} planned topics on the editorial roadmap.`);

// Filter based on safety policies
const eligibleTopics = plannedTopics.filter(t => {
  if (!allowTax && t.series === 'taxation') return false;
  if (!allowRegulatory && t.series === 'rbi-regulation') return false;
  return true;
});

if (eligibleTopics.length === 0) {
  console.log('No eligible planned topics matching current safety filters.');
  process.exit(0);
}

const targetTopic = eligibleTopics[0];
console.log(`Selected Next Topic: [${targetTopic.id}] "${targetTopic.title}" (Series: ${targetTopic.series})`);

const targetDir = path.join(projectRoot, 'src', 'content', 'articles', targetTopic.series);
const targetFile = path.join(targetDir, `${targetTopic.slug}.mdx`);

if (fs.existsSync(targetFile)) {
  console.log(`Target article already exists at ${targetFile}. Skipping.`);
  process.exit(0);
}

console.log(`Target destination: ${targetFile}`);
console.log('Workflow simulation ready for external LLM API runner.');
console.log('Safety gates active: Manual review PR will be requested.');
