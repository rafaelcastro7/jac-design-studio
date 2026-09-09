async function testPexels(q) {
  const url = `https://www.pexels.com/search/${encodeURIComponent(q)}/`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const matches = Array.from(html.matchAll(/https:\/\/images\.pexels\.com\/photos\/[0-9]+\/[^"?'\s]+/g)).map(m => m[0]);
  const unique = Array.from(new Set(matches));
  console.log(`Pexels matches for "${q}":`, unique.slice(0, 4));
  return unique[0];
}

async function main() {
  await testPexels('wedding welcome sign');
  await testPexels('wooden clock');
  await testPexels('glazed donuts');
  await testPexels('wood desk organizer');
  await testPexels('wooden coasters');
}
main();
