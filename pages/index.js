import { useState } from 'react';
import { useRouter } from 'next/router';
export default function Home(){
  const [q,setQ]=useState('');
  const r=useRouter();
  const go=()=>{if(q.trim()) r.push('/search?q='+q)};
  return(
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1 style={{color:'#FF4D00'}}>RealDam</h1>
      <p>Find REAL price - MRP + hidden fees</p>
      <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="milk" style={{padding:12,border:'1px solid #ccc',borderRadius:8}} />
      <button onClick={go} style={{padding:12,marginLeft:10,background:'black',color:'white',borderRadius:8}}>Search</button>
    </div>
  )
}
