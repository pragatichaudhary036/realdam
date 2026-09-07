let cache = {};
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ products: [] });

  if (cache[q.toLowerCase()]?.expiry > Date.now()) {
    return res.json(cache[q.toLowerCase()].data);
  }

  // Ye saare Trusted Apps hain
  const apps = [
    { name: "Flipkart", link: `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
    { name: "Amazon.in", link: `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
    { name: "Myntra", link: `https://www.myntra.com/${q.replace(/ /g, '-')}` },
    { name: "Ajio", link: `https://www.ajio.com/search/?text=${encodeURIComponent(q)}` },
    { name: "Meesho", link: `https://www.meesho.com/search?q=${encodeURIComponent(q)}` },
    { name: "Nykaa Fashion", link: `https://www.nykaa.com/search/result/?q=${encodeURIComponent(q)}` },
    { name: "Tata Cliq", link: `https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(q)}` },
  ];

  // Ek hi product se sab apps ke card banenge - isliye kabhi empty nahi hoga
  const products = apps.map(app => ({
    title: `${q} - Real Products`,
    image: `https://via.placeholder.com/300x300.png?text=${encodeURIComponent(q)}`,
    price: null,
    delivery: null,
    totalPrice: null,
    platform: app.name,
    product_link: app.link,
    isRealPrice: false
  }));

  const data = { products };
  cache[q.toLowerCase()] = { data, expiry: Date.now() + THIRTY_DAYS };
  return res.json(data);
}
