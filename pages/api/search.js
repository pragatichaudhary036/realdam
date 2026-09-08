export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ results: [] });

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return res.status(500).json({ results: [] });

  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&location=India&api_key=${apiKey}`;

  try {
    const r = await fetch(url);
    const data = await r.json();

    const results = (data.shopping_results || []).map(item => {
      const ext = (item.extensions || []).join(" ");
      const lowerExt = ext.toLowerCase();
      const base = item.extracted_price || 0;

      let deliveryFee = 0;
      let deliveryText = "Free delivery";

      // 1. Direct fee pattern: "+ ₹99", "Delivery fee +99"
      const directMatch = ext.match(/\+\s*₹?\s?(\d+)/);

      if (lowerExt.includes("delivery fee") && directMatch) {
        deliveryFee = parseInt(directMatch[1]);
        deliveryText = `₹${deliveryFee} Delivery fee`;
      }
      // 2. Tera video wala case: Free on 990+ but actually 99 charged
      else if (lowerExt.includes("990") || lowerExt.includes("free delivery")) {
        if (base < 990) {
          // Google Total page pe ₹213 dikha raha hai = 114+99, isliye 99 add
          const has99 = lowerExt.includes("99");
          if (has99) {
            deliveryFee = 99;
            deliveryText = `₹99 Delivery (Free above ₹990)`;
          } else {
            deliveryText = `Free delivery above ₹990`;
          }
        } else {
          deliveryText = `Free delivery`;
        }
      }

      const total = base + deliveryFee;

      return {
        title: item.title,
        thumbnail: item.product_photos?.[0] || item.thumbnail,
        product_link: item.product_link,
        source: item.source || "Store",
        base_price: base,
        delivery_cost: deliveryFee,
        price: total, // TRUE FINAL
        price_str: `₹${total}`,
        base_price_str: `₹${base}`,
        delivery: deliveryText,
        is_true_total: deliveryFee > 0
      };
    });

    // 30 DAYS CACHE - SAME RAHEGA
    res.setHeader('Cache-Control', 's-maxage=2592000, stale-while-revalidate=86400');
    return res.status(200).json({ results });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ results: [] });
  }
}
