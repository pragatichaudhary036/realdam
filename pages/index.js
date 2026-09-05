import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const go = (t) => { const s = t || q; if(s) router.push(`/search?q=${encodeURIComponent(s)}`) };

  return (
    <div style={{fontFamily:'system-ui', background:'#fff', minHeight:'100vh'}}>
      {/* LOGO */}
      <div style={{padding:'16px', textAlign:'center', borderBottom:'1px solid #f2f2f2', fontWeight:900, fontSize:24}}>
        <span style={{background:'#10b981', color:'#fff', padding:'4px 10px', borderRadius:10, marginRight:8}}>₹</span>RealDAM
      </div>

      {/* SLOGAN + SEARCH */}
      <div style={{maxWidth:520, margin:'90px auto', padding:'0 20px', textAlign:'center'}}>
        <h1 style={{fontSize:36, fontWeight:900, lineHeight:1.1, margin:0}}>Compare Karo,<br/>Bachao Paise!</h1>
        <p style={{color:'#666', marginTop:12}}>Final Daam, No Hidden Fees. Clear Baat.</p>

        <div style={{display:'flex', border:'2px solid #000', borderRadius:999, overflow:'hidden', marginTop:28}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Search - iPhone, Shoes, Watch..." style={{flex:1, border:'none', outline:'none', padding:'18px 20px', fontSize:16}} />
          <button onClick={()=>go()} style={{background:'#000', color:'#fff', border:'none', padding:'0 28px', fontWeight:800, cursor:'pointer'}}>Search</button>
        </div>
      </div>
    </div>
  );
}
