let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

export default async function handler(req, res) {
  const { q, clear } = req.query;

  if (clear === "1") {
    globalThis.realdamCache = {};
    return res.json({ msg: "cleared" });
  }

  if (!q) return res.json({ results: [], products: [] });

  const key = q.toLowerCase().trim();
  const now = Date.now();
  const THIRTY = 30 * 24 * 60 * 60 * 1000;

  if (cache[key] && cache[key].expiry > now) {
    return res.json({ results: cache[key].data, products: cache[key].data, cached: true });
  }

  const apiKey = process.env.SERPAPI_KEY || process.env.SERP_API_KEY || "";
  if (!apiKey) return res.json({ results: [], error: "Key missing" });

  try {
    const r = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`);
    const data = await r.json();
    let shopping = data.shopping_results || [];

    const TRUSTED = ["amazon", "flipkart", "myntra", "ajio", "tatacliq", "nykaa", "jiomart", "croma", "meesho"];
    let filtered = shopping.filter((i) => {
      const s = (i.source || "").toLowerCase();
      return TRUSTED.some((t) => s.includes(t));
    });

    let toUse = filtered.length > 0? filtered : shopping;

    const products = toUse.map((i) => {
      let p = i.extracted_price || parseInt((i.price || "").replace(/[^0-9]/g, "")) || 0;
      if (p < 10) return null;
      const ext = (i.extensions || []).join(" ").toLowerCase();
      let isFree = ext.includes("free delivery") || ext.includes("free shipping");
      let del = isFree? 0 : p < 500? 40 : 0;
      return {
        title: i.title,
        price: p,
        totalPrice: p + del,
        deliveryCharge: del,
        isFreeDelivery: isFree,
        image: i.thumbnail,
        thumbnail: i.thumbnail,
        platform: i.source,
        source: i.source,
        product_link: i.product_link,
        price_str: i.price
      };
    }).filter(Boolean);

    products.sort((a, b) => a.totalPrice - b.totalPrice);
    cache[key] = { data: products, expiry: now + THIRTY };

    return res.json({ results: products, products: products, cached: false });
  } catch (e) {
    return res.json({ results: [], products: [], error: e.message });
  }
}
