let cache = {};
export default function handler(req,res){
  const q = (req.query.q || "pants").toLowerCase();
  const now = Date.now();
  const THIRTY_DAYS = 30*24*60*60*1000;
  if(cache[q] && cache[q].expiry > now){
    return res.json(cache[q].data);
  }
  const products = [
    {title:"Mehrang Mens Stretchable Formal Pant for "+q, price:299, delivery:19, totalPrice:318, platform:"Amazon.in", image:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200", product_link:"https://www.amazon.in/s?k="+q},
    {title:"RynoGear Regular Fit Super Stretchable track pant for Men "+q, price:520, delivery:0, totalPrice:520, platform:"Amazon.in", image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=200", product_link:"https://www.amazon.in/s?k="+q},
    {title:"KOTTY Mens Wide Leg Casual Trousers "+q, price:487, delivery:0, totalPrice:487, platform:"Amazon.in", image:"https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=200", product_link:"https://www.amazon.in/s?k="+q}
  ];
  const data = {products};
  cache[q] = {data, expiry: now + THIRTY_DAYS};
  res.json(data);
}
