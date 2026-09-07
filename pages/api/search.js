let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

export default async function handler(req, res){
  const { q, clear } = req.query;
  if(clear==="1"){ cache={}; globalThis.realdamCache={}; return res.json({cleared:true}); }
  if(!q) return res.json({products:[]});

  const key = q.toLowerCase().trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  if(cache[key] && cache[key].expiry > now){
    return res.json({products: cache[key].data});
  }

  const apiKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`;

  try{
    const r = await fetch(url);
    const data = await r.json();
    let results = data.shopping_results || [];

    results = results.filter(item => {
      const s = (item.source||"").toLowerCase();
      return s.includes("flipkart") || s.includes("amazon") || s.includes("myntra") || s.includes("nykaa") || s.includes("meesho");
    });

    const products = results.map(item=>{
      let truePrice = item.extracted_price || parseInt((item.price||"").replace(/[^0-9]/g,'')) || 0;
      if(truePrice < 10 || truePrice > 100000) return null;

      const allText = [...(item.extensions||[]), item.shipping||""].join(" ").toLowerCase();
      let deliveryCharge = 0;
      let deliveryText = "Free Delivery";
      if(!allText.includes("free")){
        const m = allText.match(/(\d+)\s*(?:delivery|shipping)/);
        if(m){ deliveryCharge = parseInt(m[1]); deliveryText = `₹${deliveryCharge} Delivery`; }
        else { deliveryText = "Delivery in App"; }
      }

      return {
        title: item.title,
        price: truePrice,
        totalPrice: truePrice + deliveryCharge,
        deliveryCharge,
        deliveryText,
        image: item.product_photos?.[0] || item.thumbnail,
        platform: item.source,
        product_link: item.product_link, // direct app pe jayega, google pe nahi
      };
    }).filter(Boolean);

    products.sort((a,b)=>a.totalPrice-b.totalPrice);
    cache[key] = { data: products, expiry: now + THIRTY_DAYS };
    res.json({products});
  }catch(e){ res.json({products:[]}); }
}
