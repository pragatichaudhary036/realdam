import { useRouter } from 'next/router';
import { useState } from 'react';

const PRODUCTS = {
  "milk": { name: "Amul Milk 500ml", mrp: 30, cat: "grocery" },
  "bread": { name: "Britannia Bread", mrp: 45, cat: "grocery" },
  "atta": { name: "Aashirvaad Atta 5kg", mrp: 280, cat: "grocery" },
  "dal": { name: "Toor Dal 1kg", mrp: 180, cat: "grocery" },
  "iphone 16": { name: "Apple iPhone 16 128GB", mrp: 79900, cat: "normal" },
  "airpods": { name: "AirPods Pro 2nd Gen", mrp: 26900, cat: "normal" },
  "shoes": { name: "Nike Running Shoes", mrp: 5999, cat: "normal" },
};

export default function Search() {
  const router = useRouter();
  const qRaw = (router.query.q || '').toLowerCase().trim();
  const catFromUrl = router.query.cat || '';
  const [sort, setSort] = useState('low');

  const product = PRODUCTS[qRaw] || PRODUCTS[Object.keys(PRODUCTS).find(k => qRaw.includes(k))] || { name: qRaw, mrp: qRaw.includes('iphone')?79900:30, cat: catFromUrl || (qRaw.includes('iphone')||qRaw.includes('shoe')||qRaw.includes('airpods')?'normal':'grocery') };

  // Decide category
  const category = catFromUrl || product.cat;

  const groceryPlatforms = [
    { id:'zepto', name:'Zepto', delivery:40, handling:10, smallCart:20, surge:0 },
    { id:'instamart', name:'Instamart', delivery:35, handling:8, smallCart:25, surge:0 },
    { id:'blinkit', name:'Blinkit', delivery:40, handling:10, smallCart:20, surge:15 },
  ];
  const normalPlatforms = [
    { id:'amazon', name:'Amazon', delivery:0, handling:0, smallCart:0, surge:0, extra: -500, label: "Free Delivery" },
    { id:'flipkart', name:'Flipkart', delivery:40, handling:0, smallCart:0, surge:0, label: "Plus Delivery ₹40" },
    { id:'myntra', name:'Myntra', delivery:99, handling:0, smallCart:0, surge:0, label: "Shipping ₹99" },
  ];

  const platformsConfig = category==='normal'? normalPlatforms : groceryPlatforms;

  let platforms = platformsConfig.map(p => {
    const final = product.mrp + p.delivery + p.handling + (p.smallCart||0) + (p.surge||0) + (p.extra||0);
    const breakdown = category==='grocery'
     ? `MRP ₹${product.mrp} + Delivery ₹${p.delivery} + Handling ₹${p.handling} + Small Cart ₹${p.smallCart||0} ${p.surge?`+ Surge ₹${p.surge}`:''} = ₹${final} Final`
      : `MRP ₹${product.mrp} ${p.delivery?`+ Delivery ₹${p.delivery}`:''} ${p.label?`(${p.label})`:''} = ₹${final} Final`;
    return {...p, final, breakdown, extra: final-product.mrp };
  });

  platforms = platforms.sort((a,b) => sort==='low'? a.final-b.final : b.final-a.final);
  const cheapest = [...platforms].sort((a,b)=>a.final-b.final)[0];

  return (
    <div style={{ maxWidth: 650, margin: '0 auto', padding: 20, fontFamily: 'system-ui', background:'#fff', minHeight:'100vh' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:'bold' }}><span style={{background:'#10b981', color:'white', padding:'4px 8px', borderRadius:8}}>₹</span> RealDAM</div>
        <button onClick={()=>router.push('/')} style={{ border:'none', background:'none', cursor:'pointer' }}>← Back</button>
      </div>

      <h2 style={{ marginTop:20 }}>Results for "{router.query.q}"</h2>
      <div style={{ display:'flex', gap:8, margin:'10px 0' }}>
        <span style={{ background: category==='grocery'?'#10b981':'#eee', color: category==='grocery'?'#fff':'#000', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:'bold' }}>Category: {category?.toUpperCase()}</span>
        <span style={{ background:'#f3f4f6', padding:'4px 10px', borderRadius:20, fontSize:11 }}>MRP ₹{product.mrp}</span>
        <span style={{ background:'#f3f4f6', padding:'4px 10px', borderRadius:20, fontSize:11 }}>{category==='grocery'?'Fast Delivery':'Normal Delivery'}</span>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:15 }}>
        <button onClick={()=>setSort('low')} style={{ padding:'6px 12px', borderRadius:20, border:'1px solid #ccc', background: sort==='low'?'#000':'#fff', color: sort==='low'?'#fff':'#000', fontSize:12 }}>Low to High</button>
        <button onClick={()=>setSort('high')} style={{ padding:'6px 12px', borderRadius:20, border:'1px solid #ccc', background: sort==='high'?'#000':'#fff', color: sort==='high'?'#fff':'#000', fontSize:12 }}>High to Low</button>
      </div>

      {platforms.map(p => (
        <div key={p.id} style={{ border: p.id===cheapest.id?'2px solid #10b981':'1px solid #eee', background: p.id===cheapest.id?'#f0fdf4':'#fff', padding:15, borderRadius:12, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontWeight:'bold' }}>{p.name} {p.id===cheapest.id && <span style={{ background:'#facc15', padding:'2px 6px', borderRadius:4, fontSize:11, marginLeft:5 }}>🏆 Cheapest</span>}</div>
            <div style={{ fontWeight:'bold' }}>₹{p.final}</div>
          </div>
          <div style={{ fontSize:11, color:'#555', marginTop:5 }}>{p.breakdown}</div>
          <div style={{ fontSize:11, color: p.extra>0?'#dc2626':'#16a34a', marginTop:5 }}>
            {p.extra>0?`You saw ₹${product.mrp} but pay ₹${p.final}. Extra ₹${p.extra} hidden fees!`:`You SAVE ₹${Math.abs(p.extra)} on ${p.name}!`}
          </div>
        </div>
      ))}

      <div style={{ background:'#111', color:'#fff', padding:12, borderRadius:10, textAlign:'center', marginTop:20, fontSize:13 }}>
        {category==='grocery'? `Fast Delivery: Cheapest is ${cheapest.name} at ₹${cheapest.final}` : `Normal Delivery: Best is ${cheapest.name} at ₹${cheapest.final} - Save ₹${platforms[platforms.length-1].final - cheapest.final}!`}
      </div>
    </div>
  );
}
