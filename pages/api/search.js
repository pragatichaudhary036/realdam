import * as cheerio from 'cheerio';

let cache = {};
export default async function handler(req,res){
  const q = (req.query.q || "pants").toLowerCase().trim();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  if(cache[q] && cache[q].expiry > now){
    return res.json(cache[q].data);
  }

  try {
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    let products = [];
    $('[data-component-type="s-search-result"]').each((i, el) => {
      const title = $(el).find('h2 span').text().trim();
      const image = $(el).find('img.s-image').attr('src');
      const priceText = $(el).find('.a-price-whole').first().text().replace(/,/g,'');
      const price = parseInt(priceText) || 0;
      const link = $(el).find('h2 a').attr('href');

      if(title && price){
        products.push({
          title,
          price: price,
          delivery: price > 499? 0 : 40,
          totalPrice: price > 499? price : price + 40,
          platform: "Amazon.in",
          // Image proxy fix taki Vercel pe block na ho
          image: image? `https://wsrv.nl/?url=${encodeURIComponent(image)}` : "",
          product_link: link? `https://www.amazon.in${link}` : `https://www.amazon.in/s?k=${encodeURIComponent(title)}`
        });
      }
    });

    // Saste se mehange sort
    products.sort((a,b) => a.totalPrice - b.totalPrice);

    const finalData = { products };
    cache[q] = { data: finalData, expiry: now + THIRTY_DAYS };

    res.json(finalData);

  } catch(e){
    console.log(e);
    res.status(500).json({products:[]});
  }
}
