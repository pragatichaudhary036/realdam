import { useRouter } from 'next/router';

export default function Product(){
  const router = useRouter();
  const { name, img } = router.query;

  // REAL FINAL PRICE LOGIC - Today prices
  const prices = [
    { site:'Amazon', price:72900, delivery:0, link:`https://amazon.in/s?k=${name}` },
    { site:'Flipkart', price:74900, delivery:40, link:`https://flipkart.com/search?q=${name}` },
  ];
  const withFinal = prices.map(p=>({...p, final: p.price + p.delivery}));
  const best = [...withFinal].sort((a,b)=>a.final-b.final)[0];

  return (
    <div style={{maxWidth:700, margin:'0 auto', padding:20, fontFamily:'system-ui'}}>
      <button onClick={()=>router.back()} style={{border:'none', background:'#f3f4f6', padding:'8px 14px', borderRadius:20}}>← Back</button>
      <img src={img} style={{width:'100%', height:220, objectFit:'contain', marginTop:20, background:'#f9f9f9', borderRadius:12}} />
      <h1 style={{fontSize:22, marginTop:15}}>{name}</h1>
      <p style={{fontSize:12, color:'#666'}}>Final Daam = Product Price + Delivery</p>

      {withFinal.map(p=>(
        <div key={p.site} style={{border: p.site===best.site?'2px solid #10b981':'1px solid #eee', background: p.site===best.site?'#f0fdf4':'#fff', padding:14, borderRadius:12, marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <b>{p.site} {p.site===best.site && '🏆 Cheapest'}</b>
            <div style={{fontSize:11, color:'#666', marginTop:3}}>Price ₹{p.price} + Delivery ₹{p.delivery} = Final ₹{p.final}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:20, fontWeight:900}}>₹{p.final.toLocaleString('en-IN')}</div>
            <a href={p.link} target="_blank" style={{fontSize:11, background:'#000', color:'#fff', padding:'6px 12px', borderRadius:20, textDecoration:'none'}}>Buy</a>
          </div>
        </div>
      ))}

      <div style={{background:'#111', color:'#fff', padding:14, borderRadius:10, textAlign:'center', marginTop:18, fontWeight:800}}>
        Final Recommendation: {best.site} par lo, Save ₹{(withFinal[1].final - best.final).toLocaleString('en-IN')}
      </div>
    </div>
  );
}
