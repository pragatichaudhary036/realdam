import { useState } from 'react'
import Logo from '../components/Logo'

export default function Home(){
 const [q,setQ]=useState('')
 const go=()=>{
  if(!q) return;
  const low=q.toLowerCase()
  const fast=['milk','bread','atta','egg','curd','chips','cold','water','amul','mother','lays','coke']
  const isFast=fast.some(w=>low.includes(w))
  const mrp=low.includes('milk')?60:low.includes('bread')?40:20
  const cat=isFast?'fast':'normal'
  window.location.href=`/search?q=${encodeURIComponent(q)}&mrp=${mrp}&cat=${cat}`
 }
 return(
  <div style={{fontFamily:'system-ui',padding:'20px',maxWidth:'600px',margin:'0 auto'}}>
   <Logo size={48}/>
   <h1 style={{marginTop:'30px',fontSize:'32px',fontWeight:900}}>RealDAM</h1>
   <p style={{color:'#64748b'}}>Search ANY product. We show REAL final price with all hidden fees.</p>
   <div style={{marginTop:'20px',display:'flex',gap:'10px'}}>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex: Amul Milk 500ml" style={{flex:1,padding:'16px',borderRadius:'12px',border:'1px solid #e2e8f0',fontSize:'16px'}}/>
    <button onClick={go} style={{padding:'16px 24px',background:'black',color:'white',borderRadius:'12px',fontWeight:'bold'}}>Search</button>
   </div>
   <div style={{marginTop:'20px',background:'#f8fafc',padding:'15px',borderRadius:'12px'}}>
    <b>How we calculate:</b> Blinkit: ₹40 delivery + Handling + Surge. Zepto: Fee from screenshots. No more ₹20 to ₹96 shock!
   </div>
  </div>
 )
}
