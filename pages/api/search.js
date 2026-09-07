let cache = {};
export default async function handler(req,res){
  const q = (req.query.q || "").toLowerCase().trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  if(cache[q] && cache[q].expiry > now){
    return res.json(cache[q].data);
  }

  try {
    // Poore 194 products ek baar me fetch
    const response = await fetch(`https://dummyjson.com/products?limit=194`);
    const data = await response.json();
    let allProducts = data.products;

    // Agar search kiya hai to filter karega, nahi to saare dikhayega
    if(q){
      allProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Saste se mehange sort
    allProducts.sort((a,b) => a.price - b.price);

    const products = allProducts.map(p => ({
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
