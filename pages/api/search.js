let cache = globalThis._searchCache || new Map();
globalThis._searchCache = cache;

export default async function handler(req, res){
  const q = (req.query.q || "").trim().toLowerCase();
  if(!q) return res.json({results:[]});

  if(cache.has(q)){
    const cached = cache.get(q);
    const isFresh = (Date.now() - cached.time) < 24 * 60 * 60 * 1000;
    if(isFresh){
      console.log("Serving from cache:", q);
      return res.json({results: cached.data});
    }
  }

  const API_KEY = process.env.SERP_API_KEY || process.env.SERPAPI_KEY || "";
  if(!API_KEY){
    return res.json({results:[], error:"API key missing"});
  }

  try{
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    if(data.error){
      return res.json({results:[], error:data.error});
    }
    const results = (data.shopping_results || []).map(item => {
      const title = item.title || "";
      const priceStr = item.extracted_price || item.price || "0";
      const priceNum = parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
      const finalPrice = Math.round(priceNum + 50);
      let source = "Other";
      if((item.source || "").toLowerCase().includes("amazon")) source = "Amazon";
      else if((item.source || "").toLowerCase().includes("flipkart")) source = "Flipkart";
      return {
        title: title,
        price: item.price || `Rs. ${priceNum}`,
        thumbnail: item.product_thumbnail || item.thumbnail || "",
        link: item.product_link || item.link || "",
        source: source,
        finalPrice: finalPrice
      };
    });
    cache.set(q, { data: results, time: Date.now() });
    return res.json({results: results});
  }catch(e){
    return res.json({results:[], error: e.message});
  }
}
