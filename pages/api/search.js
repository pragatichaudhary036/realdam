export default async function handler(req, res) {
  const q = req.query.q || 'iphone';
  const key = process.env.SERP_API_KEY;
  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&location=India&gl=in&api_key=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    const list = data.shopping_results || [];
    let filtered = list.filter(p => {
      const s = (p.source || '').toLowerCase();
      const l = (p.product_link || '').toLowerCase();
      return s.includes('amazon') || s.includes('flipkart') || l.includes('amazon') || l.includes('flipkart');
    });
    if (filtered.length < 2) filtered = list;
    const results = filtered.slice(0, 12).map(p => ({
      name: p.title,
      img: p.thumbnail,
      price: p.extracted_price,
      source: p.product_link.toLowerCase().includes('flipkart') ? 'Flipkart' : 'Amazon',
      link: p.product_link
    }));
    res.json({ results });
  } catch (e) {
    res.json({ results: [] });
  }
}
