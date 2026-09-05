import { useRouter } from 'next/router';
import { useState } from 'react';

const PRODUCTS = {
  "milk": { name: "Amul Milk 500ml", mrp: 30 },
  "bread": { name: "Britannia Bread", mrp: 45 },
  "iphone 16": { name: "Apple iPhone 16 128GB", mrp: 79900 },
  "iphone": { name: "Apple iPhone 16 128GB", mrp: 79900 },
  "atta": { name: "Aashirvaad Atta 5kg", mrp: 280 },
  "dal": { name: "Toor Dal 1kg", mrp: 180 },
  "rice": { name: "Basmati Rice 1kg", mrp: 120 },
  "oil": { name: "Fortune Oil 1L", mrp: 150 },
};

export default function Search() {
  const router = useRouter();
  const [sort, setSort] = useState('low');
  const q = (router.query.q || '').toLowerCase().trim();

  // Find product or make dynamic one
  const product = PRODUCTS[q] || PRODUCTS[Object.keys(PRODUCTS).find(k => q.includes(k))] || { name: q? q.charAt(0).toUpperCase()+q.slice(1) : "Product", mrp: q.includes('iphone')? 79900 : 30 };

  const fees = {
    zepto: { delivery: 40, handling: 10, smallCart: 20, surge: 0 },
    instamart: { delivery: 40, handling: 10, smallCart: 20, surge: 0 },
    blinkit: { delivery: 40, handling: 10, smallCart: 20, surge: 15 },
  };

  const calcFinal = (f) => product.mrp + f.delivery + f.handling + f.smallCart + f.surge;

  let platforms = [
    { id: 'zepto', name: 'Zepto', final: calcFinal(fees.zepto), breakdown: `MRP ₹${product.mrp} + Delivery ₹${fees.zepto.delivery} + Handling ₹${fees.zepto.handling} + Small Cart ₹${fees.zepto.smallCart} = ₹${calcFinal(fees.zepto)} Final`, extra: calcFinal(fees.zepto)-product.mrp },
    { id: 'instamart', name: 'Instamart', final: calcFinal(fees.instamart), breakdown: `MRP ₹${product.mrp} + Delivery ₹${fees.instamart.delivery} + Handling ₹${fees.instamart.handling} + Small Cart ₹${fees.instamart.smallCart} = ₹${calcFinal(fees.instamart)} Final`, extra: calcFinal(fees.instamart)-product.mrp },
    { id: 'blinkit', name: 'Blinkit', final: calcFinal(fees.blinkit), breakdown: `MRP ₹${product.mrp} + Delivery ₹${fees.blinkit.delivery} + Handling ₹${fees.blinkit.handling} + Surge ₹${fees.blinkit.surge} + Small Cart ₹${fees.blinkit.smallCart} = ₹${calcFinal(fees.blinkit)} Final`, extra: calcFinal(fees.blinkit)-product.mrp },
  ];

  platforms = platforms.sort((a,b) => sort==='low'? a.final-b.final : b.final-a.final);
  const cheapest = [...platforms].sort((a,b)=>a.final-b.final)[0];

  return (
    <div style={{ maxWidth: 650, margin: '0 auto', padding: 20, fontFamily: 'system-ui, Arial', background:'#fff', minHeight:'100vh' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:'bold' }}><span style={{background:'#10b981', color:'white', padding:'4px 8px', borderRadius:8}}>₹</span> RealDAM</div>
        <button onClick={()=>router.push('/')} style={{ border:'none', background:'none', cursor:'pointer' }}>← Back</button>
      </div>

      <h2 style={{ marginTop:20 }}>Results for "{router.query.q}" - REAL Dam</h2>
      <p style={{ color:'#666', fontSize:13 }}>MRP ₹{product.mrp} | Showing FINAL price with all fees | {product.name}</p>

      <div style={{ display:'flex', gap:8, marginBottom:15 }}>
        <button onClick={()=>setSort('low')} style={{ padding:'6px 12px', borderRadius:20, border:'1px solid #ccc', background: sort==='low'?'#000':'#fff', color: sort==='low'?'#fff':'#000', fontSize:12 }}>Low to High</button>
        <button onClick={()=>setSort('high')} style={{ padding:'6px 12px', borderRadius:20, border:'1px solid #ccc', background: sort==='high'?'#000':'#fff', color: sort==='high'?'#fff':'#000', fontSize:12 }}>High to Low</button>
      </div>

      {platforms.map((p, i) => (
        <div key={p.id} style={{ border: p.id===cheapest.id?'2px solid #10b981':'1px solid #eee', background: p.id===cheapest.id?'#f0fdf4':'#fff', padding:15, borderRadius:12, marginBottom:12, position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontWeight:'bold' }}>{p.name} {p.id===cheapest.id && <span style={{ background:'#facc15', padding:'2px 6px', borderRadius:4, fontSize:11, marginLeft:5 }}>🏆 Cheapest</span>}</div>
            <div style={{ fontWeight:'bold' }}>₹{p.final}</div>
          </div>
          <div style={{ fontSize:11, color:'#555', marginTop:5 }}>{p.breakdown}</div>
          <div style={{ fontSize:11, color: p.extra>500?'#dc2626':'#16a34a', marginTop:5 }}>You saw ₹{product.mrp} but pay ₹{p.final}. Extra ₹{p.extra} hidden fees!</div>
        </div>
      ))}

      <div style={{ background:'#111', color:'#fff', padding:12, borderRadius:10, textAlign:'center', marginTop:20, fontSize:13 }}>
        Cheapest is <b>{cheapest.name}</b> at <b>₹{cheapest.final}</b> - Save ₹{platforms[platforms.length-1].final - cheapest.final} vs highest!
      </div>
    </div>
  );
}
