export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.json({ results: [] });

  const API_KEY = process.env.SERP_API_KEY || process.env.SERPAPI_KEY || "";
  if (!API_KEY) return res.json({ results: [], error: "API key missing" });

  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    const TRUSTED = ["amazon", "flipkart", "myntra", "ajio", "tatacliq", "nykaa", "jiomart", "croma", "reliance"];

    let results = (data.shopping_results || []).map((item) => ({
      title: item.title,
      price: item.extracted_price || 999999,
      price_str: item.price,
      source: item.source || "Store",
      product_link: item.product_link,
      thumbnail: item.thumbnail,
      logo: item.source_icon || `https://www.google.com/s2/favicons?domain=${item.source.toLowerCase().replace(/\s/g,'')}.in&sz=64`
    })).filter(item => {
      const s = item.source.toLowerCase();
      return TRUSTED.some(t => s.includes(t));
    });

    // Agar trusted me kuch nahi mila toh sab dikha do
    if (results.length === 0) {
      results = (data.shopping_results || []).map((item) => ({
        title: item.title,
        price: item.extracted_price || 999999,
        price_str: item.price,
        source: item.source,
        product_link: item.product_link,
        thumbnail: item.thumbnail,
        logo: item.source_icon || `https://www.google.com/s2/favicons?domain=${item.source.toLowerCase().replace(/\s/g,'')}.in&sz=64`
      }));
    }

    results.sort((a, b) => a.price - b.price);
    return res.json({ results });
  } catch (e) {
    return res.json({ results: [], error: e.message });
  }
}
