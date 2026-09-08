export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(200).json({ results: [] });

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "SERPAPI_KEY missing", results: [] });
  }

  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&location=India&api_key=${apiKey}`;

  try {
    const r = await fetch(url, { cache: 'no-store' });
    const data = await r.json();

    if (data.error) {
      console.log("SerpAPI Error:", data.error);
      return res.status(200).json({ results: [], error: data.error });
    }

    const results = (data.shopping_results || []).map(item => {
      const ext = (item.extensions || []).join(" ");
      const lowerExt = ext.toLowerCase();
      const base = item.extracted_price || 0;
      let deliveryFee = 0;
      let deliveryText = item.delivery || "Free delivery";

      const directMatch = ext.match(/\+\s*₹?\s?(\d+)/);
      if (lowerExt.includes("delivery fee") && directMatch) {
        deliveryFee = parseInt(directMatch[1]);
        deliveryText = `₹${deliveryFee} Delivery fee`;
      } else if (lowerExt.includes("990") && base < 990 && lowerExt.includes("99")) {
        deliveryFee = 99;
        deliveryText = `₹99 Delivery (Free above ₹990)`;
      }

      const total = base + deliveryFee;
      return {
        title: item.title,
        thumbnail: item.product_photos?.[0]?.link || item.thumbnail,
        product_link: item.product_link,
        source: item.source || "Store",
        base_price: base,
        delivery_cost: deliveryFee,
        price: total,
        price_str: `₹${total}`,
        base_price_str: `₹${base}`,
        delivery: deliveryText,
        is_true_total: deliveryFee > 0
      };
    });

    // NO CACHE - har baar fresh result
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({ results });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ results: [], error: e.message });
  }
}
