import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState('low');

  useEffect(() => {
    if(!q) return;
    setLoading(true);

    // 30 DAYS CACHE
    const cached = localStorage.getItem(`realdam_${q.toLowerCase()}`);
    if(cached){
      const {data, expiry} = JSON.parse(cached);
      if(expiry > Date.now()){
        setProducts(data);
        setLoading(false);
        return;
      }
    }

    fetch(`/api/search?q=${encodeURIComponent(q)}`)
     .then(r=>r.json())
     .then(data=>{
        let final = data.products || data.results || data.data || data || [];
        if(!Array.isArray(final)) final = [];

        // FIX 5: Store link fix + Delivery add
        final = final.map(p=>{
          return {
           ...p,
            title: p.title || p.name || 'Product',
            image: p.image || p.thumbnail || 'https://via.placeholder.com/100',
            price: Number(p.price || 0),
            platform: p.platform || p.source || p.store || 'Store',
            // GOOGLE LINK HATAO - DIRECT LINK LO
            realLink: p.product_link || p.link || p.url || p.merchant_url || `https://www.google.com/search?q=${encodeURIComponent(p.title || q)}`,
            delivery: Number(p.price) > 500? 0 : 49,
            get total(){ return this.price + this.delivery }
          }
        });

        // FIX 2: HAR MODEL KE LIYE GREEN BOX - sabse sasta green
        final.sort((a,b)=> a.total - b.total);

        localStorage.setItem(`realdam_${q.toLowerCase()}`, JSON.stringify({
          data: final,
          expiry: Date.now() + 30*24*60*60*1000
        }));

        setProducts(final);
        setLoading(false);
      });
  }, [q]);

  const sorted = [...products].sort((a,b)=> sort==='low'? a.total - b.total : b.total - a.total);

  // FIX 3: INTERESTING SKELETON
  const Skeleton = () => (
    <div style={{padding:'15px'}}>
      <style>{`
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
       .shimmer{position:relative; overflow:hidden; background:#f3f4f6;}
       .shimmer::after{content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation:shimmer 1.2s infinite;}
      `}</style>
      {[1,2,3,4].map(i=>(
        <div key={i} style={{display:'flex', gap:'12px', background:'white', border:'1px solid #eee', borderRadius:'16px', padding:'12px', marginBottom:'12px'}}>
          <div className="shimmer" style={{width:'70px', height:'70px', borderRadius:'12px'}}></div>
          <div style={{flex:1}}>
            <div className="shimmer" style={{height:'14px', width:'80%', borderRadius:'6px', marginBottom:'8px'}}></div>
            <div className="shimmer" style={{height:'12px', width:'50%', borderRadius:'6px', marginBottom:'12px'}}></div>
            <div className="shimmer" style={{height:'32px', width:'100%', borderRadius:'20px'}}></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{background:'white', minHeight:'100vh', fontFamily:'Poppins'}}>
      {/* FIX 1: THEME WHITE + SMALL LOGO */}
      <div style={{padding:'12px 15px', display:'flex', alignItems:'center', gap:'10px', borderBottom:'1px solid #f0f0f0', position:'sticky', top:0, background:'white', zIndex:10}}>
        <div onClick={()=>router.push('/')} style={{display:'flex', alignItems:'center', gap:'6px', cursor:'pointer'}}>
          <div style={{width:'32px', height:'32px', background:'#0a0a23', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center'}}>🛍️</div>
          <span style={{fontWeight:'800', fontSize:'16px'}}>Real<span style={{color:'#2b6cff'}}>DAM</span></span>
        </div>
        <div style={{flex:1, background:'#f3f4f6', borderRadius:'20px', padding:'8px 14px', fontSize:'12px', marginLeft:'10px', whiteSpace:'nowrap', overflow:'hidden'}}>{q}</div>
        <button onClick={()=>router.push('/')} style={{background:'#2b6cff', color:'white', border:'none', padding:'8px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>Search</button>
      </div>

      {/* FIX 4: SORT AS OPTION - Chip ki tarah */}
      <div style={{padding:'10px 15px', display:'flex', alignItems:'center', gap:'10px'}}>
        <span style={{fontSize:'12px', color:'#6b7280'}}>Sort:</span>
        <button onClick={()=>setShowSort(!showSort)} style={{border:'1px solid #e5e7eb', background: showSort?'#0a0a23':'white', color: showSort?'white':'black', padding:'6px 12px', borderRadius:'20px', fontSize:'12px'}}>
          {showSort? '✓ Applied' : 'Add Filter'}
        </button>
        {showSort && <>
          <button onClick={()=>setSort('low')} style={{background: sort==='low'?'#2b6cff':'#f3f4f6', color: sort==='low'?'white':'black', border:'none', padding:'6px 12px', borderRadius:'20px', fontSize:'12px'}}>Low to High</button>
          <button onClick={()=>setSort('high')} style={{background: sort==='high'?'#2b6cff':'#f3f4f6', color: sort==='high'?'white':'black', border:'none', padding:'6px 12px', borderRadius:'20px', fontSize:'12px'}}>High to Low</button>
        </>}
      </div>

      {loading? <Skeleton /> : (
        <div>
          {sorted.map((p,i)=>{
            const isCheapest = i===0;
            return(
              <div key={i} style={{margin:'12px 15px', background:'white', border: isCheapest?'2px solid #00c950':'1px solid #eef2f7', borderRadius:'16px', padding:'12px', position:'relative', boxShadow: isCheapest?'0 4px 15px rgba(0,201,80,0.15)':'0 2px 8px rgba(0,0,0,0.04)'}}>

                {/* FIX 2: GREEN BOX HAR MODEL KE LIYE - Sabse saste pe */}
                {isCheapest && <div style={{position:'absolute', top:'-9px', left:'12px', background:'#00c950', color:'white', fontSize:'10px', fontWeight:'800', padding:'4px 10px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'4px'}}>✓ CHEAPEST - TRUE PRICE</div>}

                <div style={{display:'flex', gap:'12px', marginTop: isCheapest?'10px':'0'}}>
                  <img src={p.image} alt="" style={{width:'68px', height:'68px', borderRadius:'12px', objectFit:'cover', background:'#f9fafb'}} />
                  <div style={{flex:1}}>
                    <p style={{fontSize:'13px', margin:'0 0 4px', lineHeight:'1.3', color:'#111'}}>{p.title}</p>
