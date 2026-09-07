let cache = {};
export default async function handler(req,res){
  const q = (req.query.q || "pants").toLowerCase();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  if(cache[q] && cache[q].expiry > now){
    return res.json(cache[q].data);
  }

  try {
    // 100 products tak fetch karega
    const response = await fetch(`https://dummyjson.com/products/search?q=${q}&limit=100`);
    const data = await response.json();

    const products = data.products.map(p => ({
      title: p.title,
      price: Math.round(p.price * 83),
      delivery: p.price > 20? 0 : 40,
      totalPrice: Math.round(p.price * 83) + (p.price > 20? 0 : 40),
      platform: "Trusted Store",
      image: p.thumbnail,
      product_link: `https://www.google.com/search?q=buy+${encodeURIComponent(p.title)}`
    }));

    const finalData = { products };
    cache[q] = { data: finalData, expiry: now + THIRTY_DAYS };
    res.json(finalData);

  } catch(e){
    res.status(500).json({products:[]});
  }
}
