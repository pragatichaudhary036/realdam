let cache = {};
export default async function handler(req, res){
  const q = (req.query.q || "pants").toLowerCase();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;

  if(cache[q] && cache[q].expiry > now){
    return res.json(cache[q].data);
  }

  // Mock real data - real price = price + delivery
  const products = [
    {title: `Mehrang Mens Stretchable Formal Pant for ${q}`, price: 299, delivery: 19, totalPrice: 318, platform: "Amazon.in", image:"https://m.media-amazon.com/images/I/61Qk0Q+J1JL._SY550_.jpg", product_link:"https://www.amazon.in/s?k="+q},
    {title: `RynoGear Regular Fit Super Stretchable track pant for Men ${q}`, price: 520, delivery: 0, totalPrice: 520, platform: "Amazon.in", image:"https://m.media-amazon.com/images/I/71g0o5n+sIL._SY550_.jpg", product_link:"https://www.amazon.in/s?k="+q},
    {title: `KOTTY Mens Wide Leg Casual Style Trousers ${q}`, price: 487, delivery: 0, totalPrice: 487, platform: "Amazon.in", image:"https://m.media-amazon.com/images/I/71K3j4k+JLL._SY550_.jpg", product_link:"https://www.amazon.in/s?k="+q},
  ];

  const data = {products};
  cache[q] = {data, expiry: now + THIRTY_DAYS};
  res.json(data);
}
