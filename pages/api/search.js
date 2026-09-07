let cache = {};

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  const lowerQ = q.toLowerCase();
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  // 1. 30 DAY SAVE LOGIC
  if (lowerQ && cache[lowerQ] && cache[lowerQ].expiry > now) {
    return res.status(200).json(cache[lowerQ].data);
  }

  try {
    // 2. SARE PRODUCTS LANE KE LIYE 2 API EK SAATH
    const [data1, data2] = await Promise.all([
      fetch('https://dummyjson.com/products?limit=194').then(r => r.json()),
      fetch('https://fakestoreapi.com/products').then(r => r.json())
    ]);

    let allProducts = [];

    // 3. MAPPING - APP KE NAAM + PRICE + DELIVERY + LINK + IMAGE
    data1.products.forEach(p => {
      let platform = "Amazon.in";
      let link = `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}`;

      // Category ke hisab se App ka naam change
      if (p.category === 'beauty' || p.category === 'fragrances' || p.category === 'skin-care') {
        platform = "Myntra";
        link = `https://www.myntra.com/${encodeURIComponent(p.title)}?rawQuery=${encodeURIComponent(p.title)}`;
      } else if (p.category === 'mens-shirts' || p.category === 'womens-dresses' || p.category === 'tops') {
        platform = "Ajio";
        link = `https://www.ajio.com/search?text=${encodeURIComponent(p.title)}`;
      } else if (p.category === 'groceries' || p.category === 'home-decoration') {
        platform = "Meesho";
        link = `https://www.meesho.com/search?q=${encodeURIComponent(p.title)}`;
      } else if (p.id % 2 === 0) {
        platform = "Flipkart";
        link = `https://www.flipkart.com/search?q=${encodeURIComponent(p.title)}`;
      }

      const realPrice = Math.round(p.price * 83); // Real Price in INR
      const deliveryCharge = realPrice > 499? 0 : 40; // Delivery Charge

      allProducts.push({
        title: p.title,
        image: p.thumbnail, // Image
        price: realPrice, // Real Price
        delivery: deliveryCharge, // Delivery Charge
        totalPrice: realPrice + deliveryCharge, // Total Price
        platform: platform, // App Ka Naam
        product_link: link // Product Link
      });
    });

    data2.forEach(p => {
      const realPrice = Math.round(p.price * 83
