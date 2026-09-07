let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

export default async function handler(req, res){
  const { q } = req.query;
  if(!q) return res.json({products:[]});

  const apiKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`;

  try{
    const r = await fetch(url);
    const data = await r.json();
    let results = data.shopping_results || [];

    results = results.filter(item => {
      const s = (item.source||"").toLowerCase();
      return s.includes("flipkart") || s.includes("amazon") || s.includes("myntra") || s.includes("nykaa");
    });

    const products = results.map(item=>{
      let truePrice = item.extracted_price || parseInt((item.price||"").replace(/[^0-9]/g,'')) || 0;
      if(truePrice < 10) return null;

      // REAL DELIVERY
      const allText = [...(item.extensions||[]), item.shipping||""].join(" ").toLowerCase();
      let deliveryCharge = 0;
      let deliveryText = "Free Delivery";

      if(allText.includes("free delivery") || allText.includes("free shipping")){
        deliveryCharge = 0;
        deliveryText = "Free Delivery";
      } else {
        const m = allText.match(/(\d+)\s*(?:delivery|shipping)/);
        if(m){
          deliveryCharge = parseInt(m[1]);
          deliveryText = `₹${deliveryCharge} Delivery`;
        } else {
          deliveryText = "Delivery - Check in App";
          deliveryCharge = 0;
        }
      }

      return {
        title: item.title,
        price: truePrice,
        totalPrice: truePrice + deliveryCharge,
        deliveryCharge: deliveryCharge,
        deliveryText: deliveryText,
        image: item.product_photos?.[0] || item.thumbnail,
        platform: item.source,
        product_link: item.product_link,
      };
    }).filter(Boolean);

    products.sort((a,b)=>a.totalPrice-b.totalPrice);
    res.json({products});

  }catch(e){ res.json({products:[]}); }
}
