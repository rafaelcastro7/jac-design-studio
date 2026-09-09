import fs from 'fs';

async function searchOpenverse(q, count = 10) {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=${count}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => ({
      title: r.title,
      url: r.url,
      thumbnail: r.thumbnail
    }));
  } catch (e) {
    return [];
  }
}

async function download(url, dest) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return false;
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  const query = process.argv[2] || 'wedding easel sign';
  const tag = process.argv[3] || 'test';
  console.log(`Searching Openverse for "${query}"...`);
  const results = await searchOpenverse(query, 6);
  console.log(`Found ${results.length} results:`);
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    console.log(`[${i}] ${r.title} -> ${r.url}`);
    const dest = `src/assets/catalog/${tag}_${i}.jpg`;
    const ok = await download(r.url, dest);
    if (ok) {
      console.log(`    Downloaded to ${dest}`);
    }
  }
}

main();
