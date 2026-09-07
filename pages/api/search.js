let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

const TRUSTED_APPS = ["Flipkart", "Amazon", "Myntra", "Nykaa", "Ajio", "Meesho", "Amazon.in"];

export default async function handler(req, res){
  const { q, clear } = req.query;

  // CACHE CLEAR LOGIC
  if(clear === "1"){
    cache = {};
    globalThis.realdamCache = {};
    return res.json({msg:"Cache cleared - 6 points wala naya code chalega"});
  }

  if(!q) return res.json({products:[]});
  const key = q.toLowerCase().trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  // 1. 30 DAY LOGIC
  if(cache[key] && cache[key].expiry > now){
    return res.json({products: cache[key].data, cached: true});
  }

  const apiKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`;

  try{
    const r = await fetch(url);
    const data = await r.json();
    let results = data.shopping_results || [];

    // 2. SIRF TRUSTED APPS
    results = results.filter(item => {
      const source = (item.source || "").toLowerCase();
      return TRUSTED_APPS.some(t => source.includes(t.toLowerCase()));
    });

    const products = results.map(item=>{
      // 3. NO FAKE PRICE + APP SE TRUE PRICE
      let truePrice = item.extracted_price || parseInt((item.price || "").replace(/[^0-9]/g,'')) || 0;
      if(truePrice < 10 || truePrice > 100000) return null;

      // 4. DELIVERY CHARGE ADDED
      const ext = (item.extensions || []).join(" ").toLowerCase();
      let isFree = ext.includes("free delivery") || ext.includes("free shipping");
      let deliveryCharge = isFree? 0 : (truePrice < 500? 40 : 0);
      let totalPrice = truePrice + deliveryCharge;

      // 5. BUY ON APP SE APP PE JO + 6. TRUE PRICE
      return {
        title: item.title,
        price: truePrice,
        totalPrice: totalPrice,
        deliveryCharge: deliveryCharge,
        isFreeDelivery: isFree,
        image: item.product_photos?.[0] || item.thumbnail,
        platform: item.source,
        product_link: item.product_link, // App me khulega
        app_link: item.product_link,
        trusted: true
      };
    }).filter(Boolean);

    products.sort((a,b) => a.totalPrice - b.totalPrice);

    cache[key] = { data: products, expiry: now + THIRTY_DAYS };

    res.json({products, cached: false});

  }catch(e){
    res.json({products:[]});
  }
}
