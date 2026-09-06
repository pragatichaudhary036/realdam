// 30 Day Cache + Trusted Filter
let cache = globalThis._REALDAM_CACHE;
if (!cache) {
  cache = new Map();
  globalThis._REALDAM_CACHE = cache;
}

export default async function handler(req, res) {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ results: [] });

  // 1. CHECK 30 DAY CACHE
  const cached = cache.get(q);
  if (cached && Date.now() - cached.time < 30 * 24 * 60 * 60 * 1000) {
    console.log("Cache Hit:", q);
    return res.json({ results: cached.data, fromCache: true });
  }

  const API_KEY = process.env.SERP_API_KEY || process.env.SERPAPI_KEY || "";
  if (!API_KEY) return res.json({ results: [], error: "API key missing" });

  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    const TRUSTED = ["amazon", "flipkart", "myntra", "ajio", "tatacliq", "nykaa", "jiomart", "croma"];

    let results = (data.shopping_results || []).map((item) => ({
      title: item.title,
      price: item.extracted_price || 999999,
      price_str: item.price,
      source: item.source || "Store",
      product_link: item.product_link,
      thumbnail: item.thumbnail,
      logo: item.source_icon || `https://www.google.com/s2/favicons?domain=amazon.in&sz=64`
    })).filter(item => TRUSTED.some(t => item.source.toLowerCase().includes(t)));

    if (results.length === 0) {
      results = (data.shopping_results || []).map((item) => ({
        title: item.title,
        price: item.extracted_price || 999999,
        price_str: item.price,
        source: item.source,
        product_link: item.product_link,
        thumbnail: item.thumbnail,
        logo: item.source_icon || `https://www.google.com/s2/favicons?domain=amazon.in&sz=64`
      }));
    }

    results.sort((a, b) => a.price - b.price);

    // 2. SAVE FOR 30 DAYS
    cache.set(q, { data: results, time: Date.now() });

    return res.json({ results, fromCache: false });
  } catch (e) {
    return res.json({ results: [], error: e.message });
  }
}
