import { useState } from 'react';

export default function Home(){
  const [q, setQ] = useState("Nail extension");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) =>{
    if(e) e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setItems(data.products || []);
    setLoading(false);
  }

  return(
    <div style={{background:"#fff", minHeight:"100vh", fontFamily:"system-ui"}}>
      {/* Header */}
      <div style={{padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
          <div style={{width:38, height:38, background:"#0a0a23", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center"}}>🛍️</div>
          <b style={{fontSize:20}}>RealDAM</b>
        </div>
        <span style={{background:"#f3f4f6", color:"#6b7280", padding:"5px 12px", borderRadius:20, fontSize:12}}>TRUE Price</span>
      </div>

      {/* Search Bar - Screenshot jaisa */}
      <form onSubmit={search} style={{padding:"12px 16px"}}>
        <div style={{display:"flex", alignItems:"center", border:"1px solid #e5e7eb", borderRadius:28, padding:"4px 4px 4px 14px"}}>
          <span>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1, border:"none", outline:"none", padding:"10px 8px", fontSize:15}} />
          <button type="submit" style={{background:"#2563eb", color:"#fff", border:"none", padding:"11px 20px", borderRadius:22, fontWeight:600}}>Search</button>
        </div>
      </form>

      {/* Product List - Screenshot jaisa */}
      <div style={{padding:"8px 12px"}}>
        {loading && <p style={{textAlign:"center", color:"#888"}}>Loading...</p>}
        {items.map((p,i)=>(
          <div key={i} style={{display:"flex", gap:12, alignItems:"center", border:"1px solid #f1f5f9", borderRadius:18, padding:12, marginBottom:12}}>
            <img src={p.image} style={{width:68, height:68, borderRadius:10, objectFit:"cover", background:"#f9fafb"}} />
            <div style={{flex:1}}>
              <div style={{fontSize:14, lineHeight:"1.3", color:"#111", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"}}>{p.title}</div>
              <div style={{fontWeight:800, fontSize:17, marginTop:4}}>₹{p.price}</div>
              <div style={{fontSize:11, color:"#6b7280"}}>{p.platform}</div>
            </div>
            {/* FIX: Ab direct store khulega */}
            <a href={p.product_link || p.link} target="_blank" rel="noreferrer" style={{background:"#000", color:"#fff", padding:"10px 18px", borderRadius:20, fontSize:13, textDecoration:"none", fontWeight:600}}>Buy</a>
          </div>
        ))}
      </div>
    </div>
  )
}
