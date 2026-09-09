async function searchDDG(query) {
  const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const rawUrls = Array.from(html.matchAll(/uddg=([^&"]+)/g)).map(m => decodeURIComponent(m[1]));
  const unsplash = rawUrls.filter(u => u.includes('unsplash.com/photos/'));
  console.log(query, '->', unsplash.slice(0, 3));
}

async function main() {
  await searchDDG('site:unsplash.com/photos neon sign wedding');
  await searchDDG('site:unsplash.com/photos wedding welcome sign easel');
  await searchDDG('site:unsplash.com/photos wooden coasters');
  await searchDDG('site:unsplash.com/photos wood desk organizer');
  await searchDDG('site:unsplash.com/photos baked donuts gourmet');
  await searchDDG('site:unsplash.com/photos protein energy balls');
  await searchDDG('site:unsplash.com/photos table centerpiece wedding flowers');
}
main();
