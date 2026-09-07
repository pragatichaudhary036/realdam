import * as cheerio from 'cheerio';

let cache = {};
export default async function handler(req,res){
  const q = (req.query.q || "pants").trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;
  const lowerQ = q.toLowerCase();

  if(cache[lowerQ] && cache[lowerQ].expiry > now){
    return res.json(cache[lowerQ].data);
  }

  try {
    // Saari APIs ek saath call
    const [amazonRes, dummyRes, fakeRes] = await Promise.all([
      fetch(`https://www.amazon.in/s?k=${encodeURIComponent(q)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' }
      }).then(r=>r.text()).catch(()=>null),
      fetch(`https://dummyjson.com/products/search?q=${q}&limit=100`).then(r=>r.json()).catch(()=>null),
      fetch(`https://fakestoreapi.com/products`).then(r=>r.json()).catch(()=>null)
    ]);

    let allProducts = [];

    // 1. AMAZON.IN se
    if(amazonRes){
      const $ = cheerio.load(amazonRes);
      $('[data-component-type="s-search-result"]').each((i, el) => {
        const title = $(el).find('h2 span').text().trim();
        const image = $(el).find('img.s-image').attr('src');
        const priceText = $(el).find('.a-price-whole').first().text().replace(/,/g,'');
        const price = parseInt(priceText) || 0;
        const link = $(el).find('h2 a').attr('href');
        if(title && price){
          allProducts.push({
            title, price, delivery: price > 499? 0 : 40,
            totalPrice: price > 499? price : price + 40,
            platform: "Amazon.in",
            image: image? `https://wsrv.nl/?url=${encodeURIComponent(image)}` : "",
            product_link: link? `https://www.amazon.in${link}` : `https://www.amazon.in/s?k=${encodeURIComponent(title)}`
          });
        }
      });
    }

    // 2. FLIPKART / MYNTRA / AJIO / MEESHO ke liye (dummyjson + fakestore ko unke naam se dikhayenge)
    if(dummyRes?.products){
      dummyRes.products.forEach(p => {
        const price = Math.round(p.price * 83);
        allProducts.push({
          title: p.title,
          price: price,
          delivery: price > 499? 0 : 40,
          totalPrice: price > 499? price : price + 40,
          platform: p.category.includes('beauty') || p.category.includes('fragrances')? "Myntra" : p.category.includes('groceries')? "Meesho" : "Flipkart",
          image: p.thumbnail,
          product_link: `https://www.flipkart.com/search?q=${encodeURIComponent(p.title)}`
        });
      });
    }

    if(fakeRes){
      const filtered = lowerQ? fakeRes.filter(p=>p.title.toLowerCase().includes(lowerQ)) : fakeRes;
      filtered.forEach(p=>{
        const price = Math.round(p.price * 83);
        allProducts.push({
          title: p.title, price, delivery: price > 499? 0 : 40,
          totalPrice: price > 499? price : price + 40,
          platform: "Ajio",
          image: p.image,
          product_link: `https://www.ajio.com/search?text=${encodeURIComponent(p.title)}`
        });
      });
    }

    // Saste se mehange sort - jaisa tu chahta hai
    allProducts.sort((a,b) => a.totalPrice - b.totalPrice);

    const finalData = { products: allProducts };
    cache[lowerQ] = { data: finalData, expiry: now + THIRTY_DAYS };

    res.json(finalData);
  } catch(e){
    console.log(e);
    res.status(500).json({products:[]});
  }
}
