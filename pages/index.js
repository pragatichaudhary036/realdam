import { useRouter } from 'next/router';
import { useState } from 'react';
export default function Home(){
  const router=useRouter(); const [q,setQ]=useState(''); const [cat,setCat]=useState('grocery');
  const go=(t)=>{ const query=t||q; if(!query) return; router.push(`/search?q=${encodeURIComponent(query)}&cat=${cat}`); };
  return(
    <div style={{fontFamily:'system-ui', minHeight:'100vh', background:'#fff'}}>
      <div style={{display:'flex', justifyContent:'space-between', padding:'12px 20px', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'#fff', zIndex:10}}>
        <div style={{display:'flex', gap:15, alignItems:'center'}}>
          <b><span style={{background:'#10b981',color:'#fff',padding:'4px 8px',borderRadius:8}}>₹</span> RealDAM</b>
          <button onClick={()=>setCat('grocery')} style={{border:'none', padding:'6px 14px', borderRadius:20, background:cat==='grocery'?'#000':'#f3f4f6', color:cat==='grocery'?'#fff':'#000', fontWeight:'bold'}}>Grocery - Zepto/Blinkit/Instamart</button>
          <button onClick={()=>setCat('normal')} style={{border:'none', padding:'6px 14px', borderRadius:20, background:cat==='normal'?'#000':'#f3f4f6', color:cat==='normal'?'#fff':'#000', fontWeight:'bold'}}>Normal - Amazon/Flipkart</button>
        </div>
      </div>
      <div style={{maxWidth:650, margin:'40px auto', padding:20, textAlign:'center'}}>
        <h1 style={{fontSize:32, fontWeight:900}}>Know the REAL Daam,<br/>Not Just MRP!</h1>
        <div style={{display:'flex', gap:8, marginTop:25, background:'#f9fafb', padding:8, borderRadius:30, border:'1px solid #eee'}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder={cat==='grocery'?'Search milk 500ml, atta 5kg...':'Search iphone 16, airpods...'} style={{flex:1, border:'none', background:'transparent', padding:'12px 15px', outline:'none'}}/>
          <button onClick={()=>go()} style={{background:'#10b981', color:'#fff', border:'none', padding:'12px 25px', borderRadius:25, fontWeight:'bold'}}>Search</button>
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:15, flexWrap:'wrap'}}>
          {(cat==='grocery'?['Amul Milk 500ml ₹34','Aashirvaad Atta 5kg ₹268','Bread ₹55','Oil 1L ₹156']:['iPhone 16 ₹79,900','AirPods Pro ₹26,900','Nike Shoes ₹5,999']).map(i=><button key={i} onClick={()=>go(i.split(' ₹')[0])} style={{padding:'6px 12px', borderRadius:20, border:'1px solid #ddd', background:'#fff', fontSize:12}}>{i}</button>)}
        </div>
      </div>
    </div>
  );
}
