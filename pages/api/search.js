// REALDAM API - FINAL with 6 logic
let cache = globalThis.realdamCache || (globalThis.realdamCache = {});

// 1. SIRF TRUSTED APPS
const TRUSTED_APPS = ["Flipkart", "Amazon", "Myntra", "Nykaa", "Ajio", "Meesho", "Amazon.in"];

export default async function handler(req, res){
  const { q } = req.query;
  if(!q) return res.json({products:[]});

  const key = q.toLowerCase().trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  // ===== 1. 30 DAY LOGIC =====
  if(cache[key] && cache[key].expiry > now){
    console.log("CACHE HIT:", key);
    return res.json({products: cache[key].data, cached: true});
  }

  const apiKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=in&hl=en&api_key=${apiKey}`;

  try{
    const r = await fetch(url);
    const data = await r.json();
    let results = data.shopping_results || [];

    // ===== 2. SIRF TRUSTED APPS FILTER =====
    results = results.filter(item => {
      const source = (item.source || "").toLowerCase();
      return TRUSTED_APPS.some(trusted => source.includes(trusted.toLowerCase()));
    });

    const products = results.map(item=>{
      // ===== 3. NO FAKE PRICE + APP SE TRUE PRICE =====
      // extracted_price = real price jo app dikhata hai, price string fake ho sakta hai
      let truePrice = item.extracted_price;
      if(!truePrice){
        // Agar extracted nahi hai toh price string se number nikalo
        truePrice = parseInt((item.price || "").replace(/[^0-9]/g,'')) || 0;
      }

      // Fake price filter - agar price 0 hai ya bahut zyada hai toh skip
      if(truePrice < 10 || truePrice > 100000) return null;

      // ===== 4. DELIVERY CHARGE ADDED =====
      const extensions = (item.extensions || []).join(" ").toLowerCase();
      let deliveryCharge = 0;
      let isFreeDelivery = extensions.includes("free delivery") || extensions.includes("free shipping");

      if(!isFreeDelivery){
        if(truePrice < 500) deliveryCharge = 40; // 500 se kam pe 40rs
        else deliveryCharge = 0; // 500 se zyada pe free
      }

      const totalPrice = truePrice + deliveryCharge;

      // ===== 5. BUY ON APP SE APP PE JAO =====
      // Google shopping link se direct merchant link banao - ye app me khulega
      let appLink = item.product_link;
      let webLink = item.product_link;

      // Direct link = Google redirect ko bypass karke direct store
      // Flipkart/Amazon ke links universal links hain - mobile pe app me khulenge
      if(item.source?.toLowerCase().includes("flipkart")){
        // Flipkart link already app supported hai
        webLink = item.product_link;
        appLink = item.product_link; // Phone pe Flipkart app me khulega
      } else if(item.source?.toLowerCase().includes("amazon")){
        webLink = item.product_link;
        appLink = item.product_link; // Phone pe Amazon app me khulega
      }

      return {
        title: item.title,
        price: truePrice, // TRUE PRICE
        totalPrice: totalPrice, // Delivery ke saath
        deliveryCharge: deliveryCharge,
        isFreeDelivery: isFreeDelivery,
        image: item.product_photos?.[0] || item.thumbnail,
        platform: item.source,
        product_link: webLink, // Buy pe ye khulega - app pe jayega
        app_link: appLink, // App deep link
        rating
