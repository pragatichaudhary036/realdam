let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

export default async function handler(req, res){
  const { q, clear } = req.query;

  if(clear === "1"){
    globalThis.realdamCache = {};
    return res.json({msg:"Cache cleared"});
  }

  if(!q) return res.json({results:[], products:[]});

  const key = q.toLowerCase().trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  // 30 Day Cache
  if(cache[key] && cache[key].expiry > now){
    return res.json({results: cache[key].data, products: cache[key].data, cached:true});
  }

  const apiKey = process.env.SERPAPI_KEY || process.env.SERP_API_KEY || process.env.SERP_API_KEY_2;
  if(!apiKey) return res.json({results:[], error:"Key missing"});

  try{
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`;
    const r = await fetch(url);
    const data = await r.json();

    let shopping = data.shopping_results || [];

    // Agar google_shopping empty hai toh direct products try karo
    if(shopping.length === 0){
      return res.json({results:[], products:[], raw:data, msg:"No shopping_results from SerpAPI"});
    }

    const TRUSTED = ["amazon","flipkart","myntra","ajio","tatacliq","nykaa","jiomart","croma","meesho","reliance"];

    let filtered = shopping.filter(item => {
      const src = (item.source || "").toLowerCase();
      return TRUSTED.some(t => src.includes(t));
    });

    // IMPORTANT FIX: Agar trusted se 0 ho gaya toh saare dikhao - empty mat karo
    let toUse = filtered.length > 0? filtered : shopping;

    const products = toUse.map(item=>{
      let truePrice = item.extracted_price || parseInt((item.price||"").replace(/[^0-9]/g,'')) || 0;
      if(truePrice < 10) return null;

      const ext = (item.extensions||[]).join(" ").toLowerCase();
      let isFree = ext.includes("free delivery") || ext.includes("free shipping");
      let delivery = isFree? 0 : (truePrice < 500? 40 : 0);

      return {
        title: item.title,
        price: truePrice,
        totalPrice: truePrice + delivery,
        deliveryCharge: delivery,
        isFreeDelivery: isFree,
        image: item.thumbnail,
        thumbnail: item.thumbnail,
        platform: item.source,
        source: item.source,
        product_link: item.product_link,
        price_str: item.price
      };
    }).filter(Boolean);

    products.sort((a,b)=> a.totalPrice - b.totalPrice);

    cache[key] = { data: products, expiry: now + THIRTY_DAYS };

    return res.json({results: products, products: products, cached:false});

  }catch(e){
    return res.json({results:[], products:[], error: e.message});
  }
}
