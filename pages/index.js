import { useState, useEffect } from 'react';

export default function Home(){
  const [q,setQ]=useState("");
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [searched,setSearched]=useState(false);
  const [sort,setSort]=useState(null);
  const [showSort,setShowSort]=useState(false);
  const [promptEvent,setPromptEvent]=useState(null);
  const [showInstall,setShowInstall]=useState(true); // hamesha dikhega

  useEffect(()=>{
    window.addEventListener('beforeinstallprompt',(e)=>{
      e.preventDefault();
      setPromptEvent(e);
      setShowInstall(true);
    });
    // agar browser prompt na de to bhi 3 sec baad button dikhega
    setTimeout(()=>setShowInstall(true), 1000);
  },[]);

  const handleInstall=async()=>{
    if(promptEvent){
      promptEvent.prompt();
      await promptEvent.userChoice;
      setPromptEvent(null);
      setShowInstall(false);
    } else {
      alert("3 dot pe click karo > Add to Home Screen / Install App pe click karo. App install ho jayega.");
    }
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

  let sorted=[...items];
  if(sort==="low") sorted.sort((a,b)=>a.totalPrice-b.totalPrice);
  if(sort==="high") sorted.sort((a,b)=>b.totalPrice-a.totalPrice);

  const goToApp = (link) => {
    // direct app pe leke jayega, google pe nahi
    window.location.href = link;
  };

  return(
    <div style={{background:"#ffffff", minHeight:"100vh", fontFamily:"Inter,system-ui", color:"#0a2540"}}>
      <link rel="manifest" href="/manifest.json" />

      {/* HEADER - SAME THEME HOME + 2ND PAGE */}
      <div style={{background:"#0a2540", color:"#fff", padding: searched?"10px 16px":"14px 16px", display:"flex", alignItems:"center", gap:10}}>
        <div style={{width:32,height:32,background:"#2563eb",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>R</div>
        <div style={{display:"flex", flexDirection: searched?"row":"column", gap: searched?6:0, alignItems: searched?"center":"flex-start"}}>
          <b style={{fontSize: searched?16:18, letterSpacing:-0.5}}>realdam</b>
          <span style={{fontSize:11, opacity:0.8, marginLeft: searched?6:0}}>the true final price, sasta nhi real</span>
        </div>
      </div>

      {!searched ? (
        /* HOME PAGE */
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 20px 0"}}>
          <div style={{width:80,height:80,background:"#eff6ff",border:"2px solid #0a2540",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>🛍️</div>
          <h1 style={{margin:"16px 0 4px", fontSize:28}}>realdam</h1>
          <p style={{margin:0, fontSize:13, color:"#64748b"}}>the true final price, <b style={{color:"#0a2540"}}>sasta nhi real</b></p>

          <form onSubmit={search} style={{width:"100%",maxWidth:460,marginTop:30,display:"flex",border:"2px solid #0a2540",borderRadius:30,padding:"4px", alignItems:"center"}}>
            <span style={{paddingLeft:14}}>⌕</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product..." style={{flex:1,border:"none",outline:"none",padding:"12px 8px",fontSize:15}}/>
            <button style={{background:"#0a2540",color:"#fff",border:"none",padding:"12px 22px",borderRadius:24,fontWeight:700}}>Search</button>
          </form>
        </div>
      ) : (
        /* 2ND PAGE */
        <>
          <form onSubmit={search} style={{display:"flex",margin:"12px 16px",border:"2px solid #0a2540",borderRadius:28,padding:"4px",alignItems:"center"}}>
            <span style={{paddingLeft:12}}>⌕</span>
            <input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",outline:"none",padding:"10px 8px"}}/>
            <button style={{background:"#0a2540",color:"#fff",border:"none",padding:"10px 18px",borderRadius:20}}>Search</button>
          </form>

          {/* OPTIONAL SHORT BAR - optional hai */}
          <div style={{padding:"0 16px",display:"flex",gap:8}}>
            <button onClick={()=>setShowSort(!showSort)} style={{padding:"7px 14px",borderRadius:20,border:"1px solid #0a2540",background:"#fff",fontSize:12,fontWeight:600}}>↕ Sort {sort?`(${sort})`:""}</button>
            {showSort && <>
              <button onClick={()=>{setSort("low");setShowSort(false)}} style={{padding:"7px 14px",borderRadius:20,border:sort==="low"?"1px solid #0a2540":"1px solid #e2e8f0",background:sort==="low"?"#0a2540":"#fff",color:sort==="low"?"#fff":"#000",fontSize:12}}>Low to High</button>
              <button onClick={()=>{setSort("high");setShowSort(false)}} style={{padding:"7px 14px",borderRadius:20,border:sort==="high"?"1px solid #0a2540":"1px solid #e2e8f0",background:sort==="high"?"#0a2540":"#fff",color:sort==="high"?"#fff":"#000",fontSize:12}}>High to Low</button>
            </>}
          </div>

          {loading ? (
            /* INTERESTING LOADING THING */
            <div style={{padding:70,textAlign:"center"}}>
              <div style={{fontSize:44,animation:"bounce 0.8s infinite"}}>🛒</div>
              <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>
                <div style={{width:8,height:8,background:"#0a2540",borderRadius:10,animation:"dot 1s infinite"}}></div>
                <div style={{width:8,height:8,background:"#2563eb",borderRadius:10,animation:"dot 1s infinite 0.2s"}}></div>
                <div style={{width:8,height:8,background:"#0a2540",borderRadius:10,animation:"dot 1s infinite 0.4s"}}></div>
              </div>
              <p style={{marginTop:14,fontWeight:700,fontSize:14}}>Real Price Check Ho Raha Hai...</p>
              <p style={{fontSize:11,color:"#64748b"}}>Flipkart • Amazon se delivery ke saath</p>
              <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}} @keyframes dot{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
            </div>
          ) : (
            <div style={{padding:12}}>
              {sorted.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:12,border:i===0?"2px solid #2563eb":"1px solid #e2e8f0",borderRadius:16,padding:12,marginBottom:10,background:i===0?"#f8faff":"#fff"}}>
                  <img src={p.image} style={{width:68,height:68,borderRadius:12,objectFit:"cover"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,lineHeight:"17px"}}>{p.title?.slice(0,75)}</div>
                    <div style={{marginTop:6,fontWeight:800,fontSize:14}}>₹{p.price} <span style={{fontWeight:400,fontSize:10,color:"#64748b"}}>= ₹{p.totalPrice} Final</span></div>
                    {i===0 && <div style={{marginTop:4,fontSize:10,background:"#2563eb",color:"#fff",display:"inline-block",padding:"3px 8px",borderRadius:10}}>WINNER - Cheapest</div>}
                  </div>
                  <button onClick={()=>goToApp(p.product_link)} style={{background:"#0a2540",color:"#fff",border:"none",padding:"10px 14px",borderRadius:20,fontSize:11,height:"fit-content",alignSelf:"center"}}>Buy on {p.platform} ↗</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* INSTALLABLE BUTTON - BOTTOM PE FIXED */}
      {showInstall && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0a2540",color:"#fff",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:100}}>
          <span style={{fontSize:13}}>📲 RealDAM Install Karo</span>
          <button onClick={handleInstall} style={{background:"#fff",color:"#0a2540",border:"none",padding:"8px 16px",borderRadius:20,fontWeight:700,fontSize:12}}>Add to Home Screen</button>
        </div>
      )}
    </div>
  )
}
