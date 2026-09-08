import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
     .then(r => r.json())
     .then(d => {
        setProducts(d.products || d.results || []);
        setLoading(false);
      });
  }, [q]);

  if (loading) return <div style={{padding:40,textAlign:'center'}}>Finding best prices for {q}...</div>;

  return (
    <div style={{padding:16, maxWidth:1200, margin:'0 auto'}}>
      <h2 style={{marginBottom:16}}>Results for "{q}" - Sorted by Total Price</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16}}>
        {products.map((p, i) => (
          <a key={i} href={p.product_link} target="_blank" rel="noreferrer" style={{border:'1px solid #eee', borderRadius:12, padding:12, textDecoration:'none', color:'#000', display:'flex', flexDirection:'column'}}>
            <img src={p.image || p.thumbnail} alt={p.title} style={{width:'100%', height:180, objectFit:'contain'}} />
            <div style={{fontSize:13, marginTop:8, height:38, overflow:'hidden'}}>{p.title}</div>
            <div style={{fontSize:11, color:'#666', marginTop:4}}>{p.platform || p.source}</div>
            <div style={{marginTop:8}}>
              <span style={{fontWeight:'bold', fontSize:16}}>₹{p.totalPrice || p.price}</span>
              {p.deliveryCharge > 0 && <span style={{fontSize:11, color:'#666', marginLeft:6}}> + ₹{p.deliveryCharge} delivery</span>}
            </div>
            {p.isFreeDelivery?
              <div style={{marginTop:4, fontSize:11, color:'#fff', background:'#16a34a', display:'inline-block', padding:'2px 6px', borderRadius:4, width:'fit-content'}}>FREE Delivery</div>
              : <div style={{marginTop:4, fontSize:11, color:'#666'}}>Price: ₹{p.price} | Delivery: ₹{p.deliveryCharge}</div>
            }
            <div style={{marginTop:'auto', background:'#000', color:'#fff', textAlign:'center', padding:8, borderRadius:8, fontSize:13, marginTop:12}}>View Deal</div>
          </a>
        ))}
      </div>
    </div>
  );
}
