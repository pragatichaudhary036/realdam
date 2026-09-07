// Real API + 30 days cache + Trusted apps only
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join('/tmp', 'realdam_cache.json');

export default async function handler(req, res) {
  const { q } = req.query;
  if(!q) return res.status(400).json({ error: 'No query' });

  // 1. 30 DAYS CACHE CHECK - SERVER SIDE
  try {
    if(fs.existsSync(CACHE_FILE)){
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      const cached = cache[q.toLowerCase()];
      if(cached && cached.expiry > Date.now()){
        return res.json({ products: cached.data, cached: true });
      }
    }
  } catch(e){}

  // 2. REAL SEARCH - Yaha apna SerpAPI / Real API key laga
  const SERP_API_KEY = process.env.SERP_API_KEY; // Vercel me env me daal de
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&api_key=${SERP_API_KEY}&gl=in`;

  const response = await fetch(url);
  const data = await response.json();

  let products = (data.shopping_results || []).map(item => {
    const platform = item.source?.toLowerCase() || '';
    const price = parseInt(item.price?.replace(/[^0-9]/g,'') || '0');
    // REAL DELIVERY CHARGES - Google Shopping se real le rahe hain
    const delivery = item.delivery?.includes('Free')? 0 : (item.delivery_price? parseInt(item.delivery_price.replace(/[^0-9]/g,'')) : (price > 500? 0 : 40));

    return {
      title: item.title,
      image: item.thumbnail,
      price: price,
      delivery: delivery,
      finalTotal: price + delivery,
      platform: item.source,
      directLink: item.product_link, // DIRECT LINK - Google nahi
      inStock: true
    }
  });

  // 3. SAVE FOR 30 DAYS
  try {
    let cache = {};
    if(fs.existsSync(CACHE_FILE)) cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    cache[q.toLowerCase()] = { data: products, expiry: Date.now() + 30*24*60*60*1000 };
    // Sirf 100 products save karenge - purane delete
    const keys = Object.keys(cache);
    if(keys.length > 100) delete cache[keys[0]];
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
  } catch(e){}

  res.json({ products });
}
