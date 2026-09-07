let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

export default async function handler(req, res){
  const { q } = req.query;
  if(!q) return res.json({products:[]});

  // Cache hata diya abhi ke liye taki dikkat na ho - testing ke baad 30 din laga dena
  const apiKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`;

  try{
    const r = await fetch(url);
    const data = await r.json();
    let results = data.shopping_results || [];

    // Sirf trusted
    results = results.filter(item => {
      const s = (item.source||"").toLowerCase();
      return s.includes("flipkart") || s.includes("amazon") || s.includes("myntra") || s.includes("nykaa");
    });

    const products = results.map(item=>{
      let truePrice = item.extracted_price || parseInt((item.price||"").replace(/[^0-9]/g,'')) || 0;
      if(truePrice < 10) return null;
      let ext = (item.extensions||[]).join(" ").toLowerCase();
      let isFree = ext.includes("free");
      let delivery = isFree? 0 : (truePrice < 500? 40 : 0);

      return {
        title: item.title,
        price: truePrice,
        totalPrice: truePrice + delivery,
        deliveryCharge: delivery,
        image: item.product_photos?.[0] || item.thumbnail,
        platform: item.source,
        product_link: item.product_link,
      };
    }).filter(Boolean);

    products.sort((a,b)=>a.totalPrice-b.totalPrice);
    res.json({products});

  }catch(e){ res.json({products:[]}); }
}
