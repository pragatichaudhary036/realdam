import * as cheerio from 'cheerio';

let cache = {};

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ products: [] });

  const key = q.toLowerCase();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  // 30 DAY CACHE
  if (cache[key] && cache[key].expiry > Date.now()) {
    return res.json(cache[key].data);
  }

  let allProducts = [];

  // 1. AMAZON REAL
  try {
    const html = await fetch(`https://www.amazon.in/s?k=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' }
    }).then(r => r.text());
    const $ = cheerio.load(html);
    $('[data-component-type="s-search-result"]').each((i, el) => {
      const title = $(el).find('h2 span').text().trim();
      const image = $(el).find('img.s-image').attr('src');
      const price = parseInt($(el).find('.a-price-whole').first().text().replace(/,/g, ''));
      const link = $(el).find('h2 a').attr('href');
      if (title && price) {
        allProducts.push({
          title, image, price,
          delivery: price > 499? 0 : 40,
          totalPrice: price > 499? price : price + 40,
          platform: "Amazon.in",
          product_link: link? `https://www.amazon.in${link}` : ""
        });
      }
    });
  } catch (e) {}

  // 2. FLIPKART REAL
  try {
    const html = await fetch(`https://www.flipkart.com/search?q=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' }
    }).then(r => r.text());
    const $ = cheerio.load(html);
    $('div[data-id]').each((i, el) => {
      const title = $(el).find('a[title]').attr('title');
      const img = $(el).find('img').attr('src');
      const m = $(el).text().match(/₹([0-9,]+)/);
      const price = m? parseInt(m[1].replace(/,/g, '')) : 0;
      if (title && price) {
        allProducts.push({
          title, image: img, price,
          delivery: price > 500? 0 : 40,
          totalPrice: price > 500? price : price + 40,
          platform: "Flipkart",
          product_link: `https://www.flipkart.com/search?q=${encodeURIComponent(title)}`
        });
      }
    });
  } catch (e) {}

  allProducts.sort((a, b) => a.totalPrice - b.totalPrice);
  const finalData = { products: allProducts.slice(0, 100) };

  // Agar kuch nahi mila to khali hi jayega - DUMMY NAHI
  cache[key] = { data: finalData, expiry: Date.now() + THIRTY_DAYS };
  res.json(finalData);
}
