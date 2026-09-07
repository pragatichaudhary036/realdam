import { useState, useEffect } from 'react';

export default function Home(){
  const [q,setQ]=useState("");
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [searched,setSearched]=useState(false);
  const [sort,setSort]=useState(null);
  const [showSortMenu,setShowSortMenu]=useState(false);
  const [deferredPrompt,setDeferredPrompt]=useState(null);
  const [showInstall,setShowInstall]=useState(false);

  useEffect(()=>{
    window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); });
  },[]);

  const handleInstall = async()=>{
    if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; setShowInstall(false); }
  };

  const search=async(e)=>{
    if(e) e.preventDefault();
    if(!q) return;
    setLoading(true); setSearched(true); setSort(null); setShowSortMenu(false);
    const res=await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data=await res.json();
    setItems(data.products||[]);
    setLoading(false);
  };

  const openApp = (link)=>{
    if(link) window.open(link, "_blank");
  };

  let sorted = [...items];
  if(sort==="low") sorted.sort((a,b)=>a.totalPrice-b.totalPrice);
  if(sort==="high") sorted.sort((a,b)=>b.totalPrice-a.totalPrice);

  return(
    <div style={{background:"#ffffff",minHeight:"100vh",fontFamily:"system-ui",color:"#0f172a"}}>
      {/* HEADER - SAME THEME BOTH PAGES */}
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:searched?"1px solid #f1f5f9":"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:searched?32:42,height:searched?32:42,background:"#2563eb",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900}}>R</div>
          <div><div style={{fontWeight:800,fontSize:searched?16:18,lineHeight:1}}>RealDAM</div>{!searched && <div style={{fontSize:11,color:"#64748b"}}>TRUE Price Finder</div>}</div>
        </div>
        {searched && <div style={{fontSize:11,background:"#eff6ff",color:"#2563eb",padding:"4px 10px",borderRadius:20}}>TRUE Final Price</div>}
      </div>

      {/* HOME */}
      {!searched ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 20px 0"}}>
          <div style={{width:90,height:90,background:"#f8faff",borderRadius:24,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #dbeafe",fontSize:40}}>🛍️</div>
          <h1 style={{fontSize:32,margin:"16px 0 4px",letterSpacing:-1}}>Real<span style={{color:"#2563eb"}}>DAM</span></h1>
          <p style={{margin:0,fontSize:14,color:"#475569"}}>Sabse Sasta Nahi, <b style={{color:"#2563eb"}}>TRUE Final Price</b> Dikhata Hai</p>

          <form onSubmit={search} style={{width:"100%",maxWidth:460,marginTop:28,display:"flex",border:"2px solid #e2e8f0",borderRadius:30,padding:"4px 4px 4px 16px",alignItems:"center"}}>
            <span>🔍</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Product search karo - iPhone, Iron..." style={{flex:1,border:"none",outline:"none",padding:"12px 8px",fontSize:15}}/>
            <button style={{background:"#2563eb",color:"#fff",border:"none",padding:"11px 20px",borderRadius:22,fontWeight:600}}>Search</button>
          </form>

          <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap",justifyContent:"center"}}>
            {["iPhone 15","Nike Shoes","Smart Watch","Iron"].map(t=><button key={t} onClick={()=>{setQ(t); setTimeout(()=>{document.querySelector('form').requestSubmit()},100)}} style={{padding:"8px 14px",borderRadius:20,border:"1px solid #e2e8f0",background:"#fff",fontSize:12}}>{t}</button>)}
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={search} style={{padding:"12px 16px",display:"flex",border:"2px solid #2563eb",borderRadius:28,margin:"12px 16px",alignItems:"center"}}>
            <span>🔍</span>
            <input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",outline:"none",padding:"10px 8px"}}/>
            <button style={{background:"#2563eb",color:"#fff",border:"none",padding:"8px 16px",borderRadius:20}}>Search</button>
          </form>

          {/* OPTIONAL SORT - AB OPTIONAL HAI */}
          <div style={{padding:"0 16px",display:"flex",gap:8,position:"relative"}}>
            <button onClick={()=>setShowSortMenu(!showSortMenu)} style={{padding:"8px 16px",borderRadius:20,border:"1px solid #2563eb",background:"#fff",fontSize:13,fontWeight:600}}>⇅ Sort {sort?`(${sort})`:""}</button>
            {showSortMenu && (
              <div style={{position:"absolute",top:40,left:16,background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,boxShadow:"0 10px 20px rgba(0,0,0,0.1)",zIndex:20,overflow:"hidden"}}>
                <div onClick={()=>{setSort("low");setShowSortMenu(false)}} style={{padding:"12px 20px",fontSize:13,background:sort==="low"?"#eff6ff":"#fff",cursor:"pointer"}}>Low to High</div>
                <div onClick={()=>{setSort("high");setShowSortMenu(false)}} style={{padding:"12px 20px",fontSize:13,background:sort==="high"?"#eff6ff":"#fff",cursor:"pointer"}}>High to Low</div>
                <div onClick={()=>{setSort(null);setShowSortMenu(false)}} style={{padding:"12px 20px",fontSize:13,cursor:"pointer",borderTop:"1px solid #f1f5f9"}}>Clear Sort</div>
              </div>
            )}
            <button onClick={()=>{setSearched(false); setQ("");}} style={{padding:"8px 16px",borderRadius:20,border:"1px solid #e2e8f0",background:"#fff",fontSize:13}}>← Home</button>
          </div>

          {loading? (
            <div style={{padding:80,textAlign:"center"}}>
              <div style={{fontSize:50,animation:"bounce 1s infinite"}}>🛒</div>
              <p style={{marginTop:16,fontWeight:700,color:"#2563eb"}}>Real Price Check Kar Rahe Hain...</p>
              <p style={{fontSize:12,color:"#64748b",marginTop:6}}>Flipkart • Amazon se delivery charge ke saath</p>
              <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
            </div>
          ) : (
            <div style={{padding:12}}>
              {sorted.map((p,i)=>(
                <div key={i} onClick={()=>openApp(p.product_link)} style={{display:"flex",gap:12,border:i===0?"2px solid #2563eb":"1px solid #f1f5f9",borderRadius:18,padding:12,marginBottom:12,background:i===0?"#f8faff":"#fff",cursor:"pointer"}}>
                  <img src={p.image} style={{width:70,height:70,borderRadius:12,objectFit:"cover"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14}}>{p.title.slice(0,70)}</div>
                    <div style={{marginTop:6,fontWeight:800,fontSize:15}}>₹{p.price} <span style={{fontWeight:400,fontSize:11,color:"#64748b"}}>{p.deliveryText} = ₹{p.totalPrice} Final</span></div>
                    {i===0 && <div style={{marginTop:4,fontSize:11,background:"#2563eb",color:"#fff",display:"inline-block",padding:"2px 8px",borderRadius:10}}>✓ CHEAPEST - {p.platform}</div>}
                  </div>
                  <div style={{alignSelf:"center",background:"#0f172a",color:"#fff",padding:"10px 14px",borderRadius:20,fontSize:12,whiteSpace:"nowrap"}}>Go to {p.platform} ↗</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showInstall && <div style={{position:"fixed",bottom:0,left:0,right:0,padding:14,background:"#0f172a",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13}}>📲 Install RealDAM App</span><button onClick={handleInstall} style={{background:"#2563eb",color:"#fff",border:"none",padding:"8px 16px",borderRadius:20,fontSize:12}}>Add to Home</button></div>}
    </div>
  )
}
