import { useState } from 'react';
import { useRouter } from 'next/router';
export default function Home() {
  const [q, setQ] = useState('');
  const router = useRouter();
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:50}}>RealDAM</h1>
      <p>TRUE final price - Amazon vs Flipkart</p>
      <form onSubmit={e=>{e.preventDefault(); if(q) router.push(`/search?q=${q}`)}} style={{marginTop:20}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="laptop, iphone..." style={{padding:12,width:300,borderRadius:8,border:'1px solid #ccc'}} />
        <button style={{padding:12,marginLeft:8,background:'black',color:'white',borderRadius:8}}>Search</button>
      </form>
    </div>
  );
} 
