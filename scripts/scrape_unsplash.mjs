async function getUnsplashPhotos(query) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/);
  if (match) {
    const data = JSON.parse(match[1]);
    const results = data.props?.pageProps?.searchQuery?.results || 
                    data.props?.pageProps?.initialSearch?.results ||
                    data.props?.pageProps?.search?.photos?.results;
    if (results) {
      console.log(results.slice(0, 5).map(p => ({
        id: p.id,
        slug: p.slug,
        desc: p.description || p.alt_description,
        url: p.urls?.regular
      })));
      return;
    }
  }
  // fallback to searching photo urls in html
  const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_-]+/g;
  const urls = Array.from(new Set(html.match(regex) || []));
  console.log('Direct image URLs:', urls.slice(0, 5));
}

getUnsplashPhotos(process.argv[2] || 'wedding-welcome-sign');
