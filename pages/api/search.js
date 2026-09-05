export default async function handler(req, res){
  const q = req.query.q;
  if(!q) return res.json({results:[]});
  
  // SerpApi free key - tumhari dashboard wali key yahan lagao
  const API_KEY = process.env.SERPAPI_KEY || "fb3b0dd8b8b8f8e7f8c9d0e1f2a3b4c5d6e7f8g9h0";
  
  try{
    // Real Google Shopping data for Amazon & Flipkart
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    let results = (data.shopping_results || []).map(item => {
      const title = item.title || "";
      const src = (item.source || "").toLowerCase();
      let source = "Other";
      if(src.includes("amazon")) source = "Amazon";
      if(src.includes("flipkart")) source = "Flipkart";
      
      return {
        title: item.title,
        price: item.extracted_price || item.price,
        finalPrice: item.extracted_price || item.price,
        thumbnail: item.thumbnail,
        link: item.product_link || item.link,
        source: source
      };
    }).filter(r => r.source !== "Other").slice(0,16);

    // Agar filter ke baad empty hai to top 12 dikhao
    if(results.length === 0){
      results = (data.shopping_results || []).slice(0,12).map(item=>({
        title: item.title,
        price: item.extracted_price,
        finalPrice: item.extracted_price,
        thumbnail: item.thumbnail,
        link: item.product_link,
        source: item.source || "Store"
      }));
    }

    res.json({results});
  }catch(err){
    res.json({results:[], error: err.message});
  }
}
