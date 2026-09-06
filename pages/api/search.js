// PERMANENT 30-DAY CACHE
let cache = globalThis._searchCache || new Map();
globalThis._searchCache = cache;

export default async function handler(req, res) {
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q) return res.json({ results: [] });

  // 1. Check if already in cache (30 days)
  if (cache.has(q)) {
    const cached = cache.get(q);
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - cached.time < THIRTY_DAYS) {
      return res.json({ results: cached.data, fromCache: true });
    }
  }

  // 2. If not in cache, call SerpApi
  const API_KEY = process.env.SERP_API_KEY || "";
  if (!API_KEY) return res.json({ results: [], error: "No API Key" });

  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    if (data.error) {
      // Agar limit khatam, to bhi cache wala data bhejo agar hai
      if (cache.has(q)) {
        return res.json({ results: cache.get(q).data, fromCache: true, note: "Limit over, serving cache" });
      }
      return res.json({ results: [], error: data.error });
    }

    const results = (data.shopping_results || []).map(item => {
      const priceNum = parseFloat(String(item.extracted_price || item.price || "0").replace(/[^0-9.]/g, '')) || 0;
      return {
        title: item.title || "",
        price: item.price || `Rs. ${priceNum}`,
        thumbnail: item.product_thumbnail || item.thumbnail || "",
        link: item.product_link || item.link || "#",
        finalPrice: Math.round(priceNum + 50)
      };
    });

    // 3. Save for 30 days
    cache.set(q, { data: results, time: Date.now() });
    return res.json({ results: results });

  } catch (e) {
    return res.json({ results: [], error: e.message });
  }
}
