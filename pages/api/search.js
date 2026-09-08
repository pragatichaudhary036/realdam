export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: "SERPAPI_KEY missing", results: [] });

  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&location=India&gl=in&hl=en&api_key=${apiKey}`;

  try {
    const r = await fetch(url);
    const data = await r.json();

    const results = (data.shopping_results || []).map((item) => {
      const extText = (item.extensions || []).join(" ").toLowerCase();
      const basePrice = item.extracted_price || 0;

      let deliveryCost = 0;
      let deliveryDisplay = "Free Delivery";

      const isFree = extText.includes("free delivery") || extText.includes("free shipping");

      if (!isFree) {
        // Real delivery charge nikalne ka pattern
        // jaise: "₹40 delivery", "Delivery ₹40", "+ ₹40 shipping"
        let match = extText.match(/₹\s?(\d+)\s*(delivery|shipping)/) ||
                    extText.match(/(delivery|shipping)[^₹]{0,10}₹\s?(\d+)/) ||
                    extText.match(/\+\s*₹\s?(\d+)/);

        if (match) {
          let num = parseInt(match[1] || match[2] || match[3] || "0");

          // Check: agar "below ₹499" jaisa hai to ye threshold hai, charge nahi
          // To usko 0 hi rakho
          if (extText.includes("below") && extText.includes("delivery")) {
            const realDeliveryLine = (item.extensions || []).find(e => e.toLowerCase().includes("₹") && e.toLowerCase().includes("delivery"));
            deliveryDisplay = realDeliveryLine || "Delivery charges may apply";
            deliveryCost = 0;
          } else if (num > 0 && num < 500) { // 500 se zyada delivery nahi hota, to valid hai
            deliveryCost = num;
            deliveryDisplay = `₹${num} Delivery`;
          }
        } else {
          deliveryDisplay = "Delivery charges may apply";
        }
      }

      const finalTotal = basePrice + deliveryCost;

      return {
        title: item.title,
        thumbnail: item.product_photos?.[0] || item.thumbnail,
        product_link: item.product_link,
        source: item.source,
        base_price: basePrice,
        delivery_cost: deliveryCost,
        price: finalTotal, // YEH HAI TRUE FINAL PRICE
        price_str: `₹${finalTotal}`,
        base_price_str: `₹${basePrice}`,
        delivery: deliveryDisplay,
        extensions: item.extensions
      };
    });

    // 30 Days Cache - isse fast hoga aur SerpAPI ka paisa bachega
    res.setHeader('Cache-Control', 's-maxage=2592000, stale-while-revalidate=86400');

    return res.status(200).json({ results: results });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed", results: [] });
  }
}
