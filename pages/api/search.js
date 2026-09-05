export default async function handler(req, res){
  const q = req.query.q;
  if(!q) return res.json({results:[]});
  
  const API_KEY = process.env.SERP_API_KEY || process.env.SERPAPI_KEY || "";
  console.log("Using API Key exists:", !!API_KEY);

  if(!API_KEY){
    return res.json({results:[], error:"API Key missing in Vercel"});
  }

  try{
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    
    if(data.error){
      return res.json({results:[], error: data.error});
    }

    let results = (data.shopping_results || []).slice(0,20).map(item=>{
      const src = (item.source || "").toLowerCase();
      let source = item.source || "Store";
      if(src.includes("amazon")) source = "Amazon";
      if(src.includes("flipkart")) source = "Flipkart";
      
      // TRUE final price - platform fee ka logic
      const basePrice = item.extracted_price || 0;
      let finalPrice = basePrice;
      if(source === "Flipkart" && basePrice < 500) finalPrice += 40; // small cart fee
      if(source === "Amazon") finalPrice += 0; // prime free delivery

      return {
        title: item.title,
        price: item.extracted_price,
        finalPrice: finalPrice,
        thumbnail: item.thumbnail,
        link: item.product_link || item.link,
        source: source
      };
    });

    res.json({results});
  }catch(e){
    res.json({results:[], error: e.message});
  }
}
