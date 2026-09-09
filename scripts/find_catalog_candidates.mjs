async function searchOpenverse(q, count = 5) {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=${count}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'JacCatalog/1.0' } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => ({
      title: r.title,
      url: r.url,
      creator: r.creator
    }));
  } catch (e) {
    return [];
  }
}

async function searchWikimedia(q, count = 5) {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=${count}&format=json`;
    const res = await fetch(searchUrl, { headers: { 'User-Agent': 'JacCatalog/1.0' } });
    const data = await res.json();
    const titles = (data.query?.search || []).map(s => s.title);
    const results = [];
    for (const title of titles) {
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
      const iRes = await fetch(infoUrl, { headers: { 'User-Agent': 'JacCatalog/1.0' } });
      const iData = await iRes.json();
      const page = Object.values(iData.query?.pages || {})[0];
      const imgUrl = page?.imageinfo?.[0]?.url;
      if (imgUrl && !imgUrl.endsWith('.svg')) {
        results.push({ title, url: imgUrl });
      }
    }
    return results;
  } catch (e) {
    return [];
  }
}

async function main() {
  const queries = [
    { key: 'fiesta-neon-sign', q: 'neon sign better together' },
    { key: 'fiesta-welcome-easel', q: 'wedding welcome sign easel' },
    { key: 'fiesta-floral-centerpiece', q: 'wedding table centerpiece flowers' },
    { key: 'fiesta-favor-boxes', q: 'wedding favor boxes' },
    { key: 'wood-wall-clock', q: 'laser cut wood clock' },
    { key: 'wood-geometric-coasters', q: 'wooden coasters' },
    { key: 'wood-desk-organizer', q: 'wooden desk organizer' },
    { key: 'wood-night-lamp', q: 'wooden lamp led' },
    { key: 'dessert-baked-donuts', q: 'glazed donuts' },
    { key: 'dessert-energy-balls', q: 'protein energy balls' },
    { key: 'toy-puzzle-cube', q: 'rubik speed cube' },
    { key: 'toy-flexi-dino', q: '3d printed dinosaur toy' },
    { key: 'toy-infinity-cube', q: 'infinity cube fidget' },
    { key: 'toy-retro-robot', q: 'retro tin robot toy' },
    { key: 'toy-kinetic-gyro', q: 'brass gyroscope' }
  ];

  for (const item of queries) {
    console.log(`\n=== Query for [${item.key}]: "${item.q}" ===`);
    const openRes = await searchOpenverse(item.q, 3);
    const wikiRes = await searchWikimedia(item.q, 3);
    console.log('Openverse:', openRes);
    console.log('Wikimedia:', wikiRes);
  }
}

main();
