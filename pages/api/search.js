// 30 Day Cache + Trusted Filter + Real Delivery Price
let cache = globalThis._REALDAM_CACHE;
if (!cache) {
  cache = new Map();
  globalThis._REALDAM_CACHE = cache;
}

export default async function handler(req, res) {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ results: [] });

  const cached = cache.get(q);
  if (cached && Date.now() - cached.time < 30 * 24 * 60 * 60 * 1000) {
    return res.json({ results: cached.data, fromCache: true });
  }

  const API_KEY = process.env.SERP_API_KEY || process.env.SERPAPI_KEY || "";
  if (!API_KEY) return res.json({ results: [], error: "API key missing" });

  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    const TRUSTED = ["amazon", "flipkart", "myntra", "ajio", "tatacliq", "nykaa", "jiomart", "croma", "blinkit", "zepto", "zara", "meesho", "savana"];

    let results = (data.shopping_results || []).map((item) => {
      // Real delivery from extensions
      const deliveryText = item.extensions?.join(" ") || "";
      let delivery = "FREE Delivery";
      if(deliveryText.toLowerCase().includes("delivery")) {
        delivery = item.extensions.find(e => e.toLowerCase().includes("delivery")) || delivery;
      } else if (item.delivery) {
        delivery = item.delivery;
      }

      return {
        title: item.title,
        price: item.extracted_price || 999999,
        price_str: item.price, // 100% REAL PRICE from SerpAPI
        source: item.source || "Store",
        product_link: item.product_link,
        thumbnail: item.thumbnail,
        delivery: delivery, // REAL DELIVERY
        logo: item.source_icon || `https://www.google.com/s2/favicons?domain=${item.source}.com&sz=64`
      };
    }).filter(item => TRUSTED.some(t => item.source.toLowerCase().includes(t)));

    if (results.length === 0) {
      results = (data.shopping_results || []).slice(0,15).map((item) => ({
        title: item.title,
        price: item.extracted_price || 999999,
        price_str: item.price,
        source: item.source,
        product_link: item.product_link,
        thumbnail: item.thumbnail,
        delivery: item.extensions?.find(e => e.toLowerCase().includes("delivery")) || "FREE Delivery",
        logo: item.source_icon
      }));
    }

    results.sort((a, b) => a.price - b.price);
    cache.set(q, { data: results, time: Date.now() });

    return res.json({ results, fromCache: false });
  } catch (e) {
    return res.json({ results: [], error: e.message });
  }
}
