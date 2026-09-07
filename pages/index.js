import { useState, useEffect } from 'react';

export default function Home(){
  const [q,setQ]=useState("");
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [searched,setSearched]=useState(false);
  const [sort,setSort]=useState("low");
  const [deferredPrompt,setDeferredPrompt]=useState(null);
  const [showInstall,setShowInstall]=useState(false);

  useEffect(()=>{
    window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); });
  },[]);

  const handleInstall = async()=>{
    if(deferredPrompt){ deferredPrompt.prompt(); const {outcome}=await deferredPrompt.userChoice; setDeferredPrompt(null); setShowInstall(false); }
  };

  const search=async(e)=>{
    if(e) e.preventDefault();
    if(!q) return;
    setLoading(true); setSearched(true);
    const res=await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data=await res.json();
    setItems(data.products||[]);
    setLoading(false);
  };

  const sorted = [...items].sort((a,b)=> sort==="low"? a.totalPrice-b.totalPrice : b.totalPrice-a.totalPrice);

  // HOME PAGE
  if(!searched){
    return(
      <div style={{background:"#ffffff",minHeight:"100vh",fontFamily:"Inter,system-ui",display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{width:72,height:72,background:"#0a2540",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:28}}>R</div>
          <h1 style={{margin:"14px 0 4px",fontSize:36,letterSpacing:-1,color:"#0a2540"}}>realdam</h1>
          <p style={{margin:0,color:"#64748b",fontSize:14}}>the true final price, <b style={{color:"#0a2540"}}>sasta nhi real</b></p>

          <form onSubmit={search} style={{width:"100%",maxWidth:480,marginTop:36,display:"flex",border:"2px solid #0a2540",borderRadius:30,padding:"4px 4px 4px 16px",alignItems:"center"}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product..." style={{flex:1,border:"none",outline:"none",fontSize:16,padding:"12px 0"}}/>
            <button style={{background:"#0a2540",color:"#fff",border:"none",width:44,height:44,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center"}}>⌕</button>
          </form>
        </div>
        {showInstall && <div style={{padding:16,borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",bottom:0,background:"#fff"}}><span style={{fontSize:13}}>Install RealDAM App</span><button onClick={handleInstall} style={{background:"#2563eb",color:"#fff",border:"none",padding:"10px 18px",borderRadius:20,fontSize:13}}>Add to Home Screen</button></div>}
      </div>
    )
  }

  // SEARCHING / 2ND PAGE
  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:"Inter,system-ui"}}>
      <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #f1f5f9",position:"sticky",top:0,background:"#fff",zIndex:10}}>
        <div style={{width:32,height:32,background:"#0a2540",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800}}>R</div>
        <span style={{fontWeight:800,color:"#0a2540"}}>realdam</span>
        <span style={{fontSize:11,color:"#64748b",marginLeft:6}}>the true final price</span>
      </div>

      <form onSubmit={search} style={{padding:"12px 16px"}}><div style={{display:"flex",border:"2px solid #0a2540",borderRadius:28,padding:"4px 4px 4px 14px"}}><input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",outline:"none",padding:"10px"}}/><button style={{background:"#0a2540",color:"#fff",border:"none",padding:"10px 18px",borderRadius:22}}>⌕</button></div></form>

      <div style={{padding:"0 16px 8px",display:"flex",gap:8}}>
        <button onClick={()=>setSort("low")} style={{padding:"6px 14px",borderRadius:20,border:sort==="low"?"1px solid #0a2540":"1px solid #e2e8f0",background:sort==="low"?"#0a2540":"#fff",color:sort==="low"?"#fff":"#000",fontSize:12}}>Low to High</button>
        <button onClick={()=>setSort("high")} style={{padding:"6px 14px",borderRadius:20,border:sort==="high"?"1px solid #0a2540":"1px solid #e2e8f0",background:sort==="high"?"#0a2540":"#fff",color:sort==="high"?"#fff":"#000",fontSize:12}}>High to Low</button>
      </div>

      {loading? (
        <div style={{padding:60,textAlign:"center"}}><div style={{width:40,height:40,border:"3px solid #e2e8f0",borderTop:"3px solid #0a2540",borderRadius:50,margin:"0 auto",animation:"spin 1s linear infinite"}}></div><p style={{marginTop:16,color:"#0a2540",fontWeight:600}}>Finding the REAL price...</p><p style={{fontSize:12,color:"#64748b"}}>Checking delivery charges from real apps</p><style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style></div>
      ) : (
        <div style={{padding:"8px 12px"}}>
          {sorted.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:12,border:"1px solid #f1f5f9",borderRadius:18,padding:12,marginBottom:12,background:i===0?"#f8faff":"#fff",borderColor:i===0?"#bfdbfe":"#f1f5f9"}}>
              <img src={p.image} style={{width:70,height:70,borderRadius:12,objectFit:"cover"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,lineHeight:"18px"}}>{p.title.slice(0,70)}</div>
                <div style={{marginTop:6,fontWeight:800,fontSize:16,color:"#0a2540"}}>₹{p.price} <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>{p.deliveryText} = ₹{p.totalPrice} Final</span></div>
                {i===0 && <div style={{marginTop:4,fontSize:11,background:"#2563eb",color:"#fff",display:"inline-block",padding:"2px 8px",borderRadius:10}}>WINNER - Cheapest Final Price</div>}
                <div style={{fontSize:11,color:"#16a34a",marginTop:2}}>✓ {p.platform}</div>
              </div>
              <a href={p.product_link} target="_blank" style={{background:"#0a2540",color:"#fff",padding:"10px 14px",borderRadius:20,fontSize:12,textDecoration:"none",height:"fit-content",alignSelf:"center",whiteSpace:"nowrap"}}>Buy on {p.platform}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
