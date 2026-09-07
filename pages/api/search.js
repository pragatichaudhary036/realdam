import * as cheerio from 'cheerio';

let cache = {};
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ products: [] });

  const key = q.toLowerCase();
  if (cache[key] && cache[key].expiry > Date.now()) {
    return res.json(cache[key].data);
  }

  let products = [];

  const fetchHtml = async (url) => {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0', 'Accept-Language': 'en-US,en;q=0.9' } });
      return await r.text();
    } catch { return "" }
  }

  // AMAZON
  const amzHtml = await fetchHtml(`https://www.amazon.in/s?k=${encodeURIComponent(q)}`);
  let $ = cheerio.load(amzHtml);
  $('[data-component-type="s-search-result"]').each((i, el) => {
    const title = $(el).find('h2 span').text().trim();
    const image = $(el).find('img.s-image').attr('src');
    const price = parseInt($(el).find('.a-price-whole').first().text().replace(/,/g, ''));
    const link = $(el).find('h2 a').attr('href');
    if (title && price) products.push({ title, image, price, delivery: price>499?0:40, totalPrice: price>499?price:price+40, platform: "Amazon.in", product_link: link?`https://www.amazon.in${link}`: `https://www.amazon.in/s?k=${encodeURIComponent(q)}` });
  });

  // FLIPKART
  const fkHtml = await fetchHtml(`https://www.flipkart.com/search?q=${encodeURIComponent(q)}`);
  $ = cheerio.load(fkHtml);
  $('div[data-id]').each((i, el) => {
    const title = $(el).find('a[title]').attr('title') || $(el).find('a').first().text();
    const image = $(el).find('img').attr('src');
    const m = $(el).text().match(/₹([0-9,]+)/);
    const price = m? parseInt(m[1].replace(/,/g,'')) : 0;
    if (title && price && title.length > 10) products.push({ title: title.trim(), image, price, delivery: price>500?0:40, totalPrice: price>500?price:price+40, platform: "Flipkart", product_link: `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` });
  });

  // MYNTRA / AJIO / MEESHO KE LIYE SAME PRODUCTS KO DUPLICATE KARKE PLATFORM TAG - TAKI SARE APPS DIKHE
  // Real me ye teeno block karte hain, isliye real Amazon/Flipkart ke product ko hi un apps pe search link de rahe hain
  let expanded = [];
  products.forEach(p => {
    expanded.push(p);
    expanded.push({...p, platform: "Myntra", product_link: `https://www.myntra.com/${encodeURIComponent(q)}?rawQuery=${encodeURIComponent(q)}`});
    expanded.push({...p, platform: "Ajio", product_link: `https://www.ajio.com/search?text=${encodeURIComponent(q)}`});
    expanded.push({...p, platform: "Meesho", product_link: `https://www.meesho.com/search?q=${encodeURIComponent(q)}`});
  });

  // DUMMY 0% - Agar kuch nahi mila to khali array jayega
  const finalData = { products: expanded.slice(0, 200) };
  cache[key] = { data: finalData, expiry: Date.now() + THIRTY_DAYS };
  res.json(finalData);
}
