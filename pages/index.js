import { useState } from 'react';
export default function Home(){
  const [q,setQ]=useState("Nail extension");
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const search=async(e)=>{
    if(e) e.preventDefault();
    setLoading(true);
    const res=await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data=await res.json();
    setItems(data.products||[]);
    setLoading(false);
  };
  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:"system-ui"}}>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between"}}>
        <b style={{fontSize:20}}>RealDAM</b><span style={{background:"#f3f4f6",padding:"5px 12px",borderRadius:20,fontSize:12}}>TRUE Price + Delivery</span>
      </div>
      <form onSubmit={search} style={{padding:"12px 16px"}}>
        <div style={{display:"flex",border:"1px solid #e5e7eb",borderRadius:28,padding:"4px 4px 4px 14px"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",outline:"none",padding:"10px"}}/>
          <button style={{background:"#2563eb",color:"#fff",border:"none",padding:"11px 20px",borderRadius:22}}>Search</button>
        </div>
      </form>
      <div style={{padding:"8px 12px"}}>
        {loading&&<p style={{textAlign:"center"}}>Loading trusted apps...</p>}
        {items.map((p,i)=>(
          <div key={i} style={{display:"flex",gap:12,border:"1px solid #f1f5f9",borderRadius:18,padding:12,marginBottom:12}}>
            <img src={p.image} style={{width:68,height:68,borderRadius:10,objectFit:"cover"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,WebkitLineClamp:2,display:"-webkit-box",WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.title}</div>
              <div style={{fontWeight:800,marginTop:4}}>₹{p.price} {p.deliveryCharge>0? `+ ₹${p.deliveryCharge} delivery = ₹${p.totalPrice}` : ` (Free Delivery)`}</div>
              <div style={{fontSize:11,color:"#16a34a",fontWeight:600}}>✓ {p.platform} - Trusted ✓ True Price</div>
            </div>
            <a href={p.product_link} target="_blank" style={{background:"#000",color:"#fff",padding:"10px 18px",borderRadius:20,fontSize:13,textDecoration:"none"}}>Buy in App</a>
          </div>
        ))}
      </div>
    </div>
  )
}
