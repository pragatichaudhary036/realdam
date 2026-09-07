import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('low');

  useEffect(() => {
    if(!q) return;
    setLoading(true);
    fetch(`/api/search?q=${q}`).then(r=>r.json()).then(data=>{
      let final = data.products || data.results || [];
      final = final.map(p=>({...p, delivery: p.price>500?0:49, total: p.price + (p.price>500?0:49)}));
      final.sort((a,b)=>a.total-b.total);
      setProducts(final);
      localStorage.setItem(`realdam_${q.toLowerCase()}`, JSON.stringify({data:final, expiry: Date.now()+30*24*60*60*1000}));
      setLoading(false);
    });
  }, [q]);

  const sorted = [...products].sort((a,b)=> sort==='low'? a.total-b.total : b.total-a.total);

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px', position: 'sticky', top: 0, background: 'white' }}>
        <span onClick={()=>router.push('/')} style={{ fontWeight: 'bold' }}>← <span style={{color:'#2b6cff'}}>R</span>ealDAM</span>
        <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '20px', padding: '8px 14px', fontSize: '13px' }}>{q}</div>
      </div>
      <div style={{ padding: '10px', display: 'flex', gap: '8px' }}>
        <button onClick={()=>setSort('low')} style={{ background: sort==='low'?'#2b6cff':'#f3f4f6', color: sort==='low'?'white':'black', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '12px' }}>Low to High</button>
        <button onClick={()=>setSort('high')} style={{ background: sort==='high'?'#2b6cff':'#f3f4f6', color: sort==='high'?'white':'black', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '12px' }}>High to Low</button>
      </div>

      {loading? <div style={{padding:'15px'}}>{[1,2,3].map(i=><div key={i} style={{height:'90px', background:'#f3f4f6', borderRadius:'12px', marginBottom:'10px'}}/>)}</div> :
        sorted.map((p,i)=>(
          <div key={i} style={{ margin:'12px', border: i===0?'2px solid #2b6cff':'1px solid #eee', borderRadius:'14px', padding:'12px', position:'relative' }}>
            {i===0 && <div style={{ position:'absolute', top:'-8px', left:'10px', background:'#2b6cff', color:'white', fontSize:'10px', padding:'3px 8px', borderRadius:'10px' }}>✓ CHEAPEST - {p.platform}</div>}
            <div style={{display:'flex', gap:'10px', marginTop:i===0?'8px':'0'}}>
              <img src={p.image} style={{width:'60px', height:'60px', borderRadius:'8px', objectFit:'cover'}} />
              <div><p style={{fontSize:'13px', margin:0}}>{p.title}</p><p style={{fontWeight:'bold', margin:'4px 0'}}>₹{p.price} <span style={{fontSize:'11px', fontWeight:'normal', opacity:0.6}}>+ ₹{p.delivery} = ₹{p.total}</span></p></div>
            </div>
            <a href={p.link || p.url || p.product_link} target="_blank" style={{display:'block', textAlign:'center', background:i===0?'#2b6cff':'black', color:'white', padding:'10px', borderRadius:'20px', textDecoration:'none', marginTop:'10px', fontSize:'13px', fontWeight:'bold'}}>Go to {p.platform} Store ↗</a>
          </div>
        ))
      }
    </div>
  )
}
