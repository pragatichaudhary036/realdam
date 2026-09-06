export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.json({ results: [] });

  const API_KEY = process.env.SERP_API_KEY || process.env.SERPAPI_KEY || "";
  
  if (!API_KEY) {
    return res.json({ results: [], error: "API key missing in Vercel" });
  }

  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    if (data.error) {
      return res.json({ results: [], error: data.error });
    }

    const results = (data.shopping_results || []).map((item) => {
      return {
        title: item.title,
        price: item.extracted_price || 999999,
        price_str: item.price,
        source: item.source || "Store",
        product_link: item.product_link,
        thumbnail: item.thumbnail,
        delivery: item.delivery || "",
        rating: item.rating,
        logo: item.source_icon || `https://www.google.com/s2/favicons?domain=${item.source.toLowerCase().replace(/\s/g,'')}.in&sz=64`
      };
    });

    results.sort((a, b) => a.price - b.price);
    return res.json({ results });
  } catch (e) {
    return res.json({ results: [], error: e.message });
  }
}
