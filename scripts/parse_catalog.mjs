import fs from 'fs';

const content = fs.readFileSync('src/data/products.ts', 'utf8');
const idMatches = Array.from(content.matchAll(/id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*cat:\s*['"]([^'"]+)['"]/g));
console.log('Total parsed products:', idMatches.length);

const importMatches = Array.from(content.matchAll(/import\s+([a-zA-Z0-9_]+)\s+from\s+["']@\/assets\/catalog\/([^"']+)["']/g));
const importMap = {};
importMatches.forEach(m => {
  importMap[m[1]] = m[2];
});

idMatches.forEach(([_, id, name, cat]) => {
  console.log(`${id.padEnd(28)} | ${cat.padEnd(10)} | ${name}`);
});
