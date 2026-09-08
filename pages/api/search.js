export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(200).json({ results: [] });

  try {
    const apiKey = process.env.SERPAPI_KEY;
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&location=India&api_key=${apiKey}`;

    const r = await fetch(url);
    const data = await r.json();
    const shopping = data.shopping_results || [];

    const results = shopping.map(item => {
      const ext = (item.extensions || []).join(" ");
      const lower = ext.toLowerCase();
      const base = item.extracted_price || 0;

      let deliveryFee = 0;
      let deliveryText = "Free delivery";

      // Video wala case: ₹114 + ₹99 = ₹213
      if (lower.includes("delivery fee") || lower.includes("+")) {
        const m = ext.match(/\+\s*₹?\s?(\d+)/);
        if (m) deliveryFee = parseInt(m[1]);
      } else if (lower.includes("990")) {
        // Tera wala case - Free above 990 but below me charge
        if (base < 990 && lower.includes("99")) deliveryFee = 99;
      }

      if (deliveryFee > 0) deliveryText = `₹${deliveryFee} Delivery`;

      const total = deliveryFee > 0? base + deliveryFee : base;

      return {
        title: item.title,
        thumbnail: item.product_photos?.[0] || item.thumbnail,
        product_link: item.product_link,
        source: item.source || "Store",
        base_price: base,
        delivery_cost: deliveryFee,
        price: total, // YE HAI REAL FINAL
        price_str: `₹${total}`,
        base_price_str: `₹${base}`,
        delivery: deliveryText,
        is_true_total: deliveryFee > 0
      };
    });

    // 30 DAYS CACHE
    res.setHeader('Cache-Control', 's-maxage=2592000, stale-while-revalidate=86400');
    return res.status(200).json({ results });

  } catch (e) {
    console.error(e);
    return res.status(200).json({ results: [] });
  }
}
