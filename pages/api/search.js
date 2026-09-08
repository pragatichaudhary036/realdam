let cache = {};
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  
  if (!q) {
    return res.json({ products: [] });
  }

  // 30 DAYS CACHE - Tera wala logic same hai, touch nahi kiya
  if (cache[q.toLowerCase()]?.expiry > Date.now()) {
    return res.json(cache[q.toLowerCase()].data);
  }

  // Ye saare Trusted Apps hain - Ek bhi delete nahi kiya
  const apps = [
    { name: "Flipkart", link: `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
    { name: "Amazon.in", link: `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
    { name: "Myntra", link: `https://www.myntra.com/${q.replace(/ /g, "-")}` },
    { name: "Ajio", link: `https://www.ajio.com/search?text=${encodeURIComponent(q)}` },
    { name: "Meesho", link: `https://www.meesho.com/search?q=${encodeURIComponent(q)}` },
    { name: "Nykaa Fashion", link: `https://www.nykaa.com/search/result/?q=${encodeURIComponent(q)}` },
    { name: "Tata Cliq", link: `https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(q)}` },
  ];

  // Ek hi product se sab apps ka card banega - Isliye kabhi empty nahi hoga
  // Yaha maine Real Price ka addition logic add kiya hai
  const products = apps.map(app => {
    const price = null; // baad me yaha real price ayega
    const delivery = null; // baad me yaha real delivery ayega
    
    // Real Total Price Logic
    let totalPrice = null;
    if (price !== null && delivery !== null) {
      totalPrice = price + delivery;
    } else if (price !== null) {
      totalPrice = price;
    }

    return {
      title: `${q} - Real Products`,
      image: `https://via.placeholder.com/300x300.png?text=${encodeURIComponent(q)}`,
      price: price,
      delivery: delivery,
      totalPrice: totalPrice,
      platform: app.name,
      productLink: app.link,
      isRealPrice: false,
    };
  });

  const data = { products };
  
  // Cache me save kar raha hai 30 din ke liye
  cache[q.toLowerCase()] = { data, expiry: Date.now() + THIRTY_DAYS };
  
  return res.json(data);
}
