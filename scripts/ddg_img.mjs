import fs from 'fs';

async function searchImages(q, count = 5) {
  try {
    const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const html = await res.text();
    const match = html.match(/vqd=([^&'"]+)/);
    if (!match) return [];
    const vqd = match[1];
    const imgUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}`;
    const iRes = await fetch(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const data = await iRes.json();
    return (data.results || []).slice(0, count).map(r => ({
      title: r.title,
      image: r.image,
      thumbnail: r.thumbnail
    }));
  } catch (e) {
    console.error('Error:', e.message);
    return [];
  }
}

async function download(url, dest) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (!res.ok) return false;
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  const q = process.argv[2] || 'laser cut wood clock modern wall';
  const tag = process.argv[3] || 'test_clock';
  console.log(`Searching for "${q}"...`);
  const results = await searchImages(q, 4);
  console.log(`Found ${results.length} images:`);
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    console.log(`[${i}] ${r.title} -> ${r.image}`);
    const dest = `src/assets/catalog/${tag}_${i}.jpg`;
    const ok = await download(r.image, dest);
    if (ok) console.log(`   Downloaded to ${dest}`);
  }
}

main();
