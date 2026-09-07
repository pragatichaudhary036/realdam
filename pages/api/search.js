let cache = {};
export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ products: [] });
  if (cache[q] && cache[q].expiry > Date.now()) return res.json(cache[q].data);

  let products = [];
  try {
    const html = await fetch(`https://www.amazon.in/s?k=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' }
    }).then(r => r.text());

    const titles = [...html.matchAll(/<h2[^>]*>.*?<span>(.*?)<\/span>/gs)].map(m=>m[1]);
    const prices = [...html.matchAll(/<span class="a-price-whole">([0-9,]+)<\/span>/g)].map(m=>parseInt(m[1].replace(/,/g,'')));
    const images = [...html.matchAll(/<img[^>]*class="s-image"[^>]*src="([^"]+)"/g)].map(m=>m[1]);

    for(let i=0; i < Math.min(titles.length, prices.length); i++){
      if(titles[i] && prices[i]){
        products.push({
          title: titles[i],
          image: images[i] || "",
          price: prices[i],
          delivery: prices[i] > 499? 0 : 40,
          totalPrice: prices[i] > 499? prices[i] : prices[i] + 40,
          platform: "Amazon.in",
          product_link: `https://www.amazon.in/s?k=${encodeURIComponent(q)}`
        });
      }
    }
  } catch(e){}

  const data = { products: products.slice(0,50) };
  cache[q] = { data, expiry: Date.now() + 30*24*60*60*1000 };
  res.json(data);
}
