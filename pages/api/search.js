let cache = globalThis.realdamCache || (globalThis.realdamCache = {});
export default async function handler(req, res) {
  const { q, clear } = req.query;
  if (clear === "1") { globalThis.realdamCache = {}; return res.json({ msg: "cleared" }); }
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
    let filtered = shopping.filter(i => {
      const s = (i.source || "").toLowerCase();
      return TRUSTED.some(t => s.includes(t));
    });
    let toUse = filtered.length > 0? filtered : shopping;
    const products = toUse.map(i => {
      let p = i.extracted_price || parseInt((i.price || "").replace(/[^0-9]/g, "")) || 0;
      if (p < 10) return null;
      const extText = (i.extensions || []).join(" ").toLowerCase();
      let deliveryCharge = 0;
      let isFree = extText.includes("free delivery") || extText.includes("free shipping");
      if (!isFree) {
        const match = extText.match(/delivery[^0-9]*₹?\s?(\d+)/i);
        if (match) deliveryCharge = parseInt(match[1]);
        else if (p < 500) deliveryCharge = 40;
      }
      return {
        title: i.title,
        price: p,
        totalPrice: p + deliveryCharge,
        deliveryCharge: deliveryCharge,
        isFreeDelivery: isFree,
        image: i.thumbnail,
        thumbnail: i.thumbnail,
        platform: i.source,
        source: i.source,
        product_link: i.product_link,
        extensions: i.extensions
      };
    }).filter(Boolean);
    products.sort((a, b) => a.totalPrice - b.totalPrice);
    cache[key] = { data: products, expiry: now + THIRTY };
    return res.json({ results: products, products: products, cached: false });
  } catch (e) {
    return res.json({ results: [], products: [], error: e.message });
  }
}
