import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Search(){
 const router = useRouter();
 const {q} = router.query;
 const [data,setData] = useState([]);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{
   if(!q) return;
   setLoading(true);
   fetch(`/api/search?q=${encodeURIComponent(q)}`)
  .then(r=>r.json())
  .then(d=>{setData(d.results||[]); setLoading(false)});
 },[q]);

 if(loading) return <div style={{padding:30,fontFamily:'sans-serif',textAlign:'center'}}>Loading TRUE price for {q}...<br/>Amazon + Flipkart se le rahe hai...</div>

 return (
  <div style={{padding:20,fontFamily:'sans-serif'}}>
    <h2 style={{textAlign:'center'}}>TRUE Final Price for "{q}"</h2>
    <p style={{color:'green',textAlign:'center'}}>Delivery + Platform fee included</p>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16,marginTop:20}}>
      {data.map((p,i)=>(
        <div key={i} style={{border:'1px solid #ddd',padding:12,borderRadius:12,background:'white'}}>
          <img src={p.thumbnail} style={{width:'100%',height:150,objectFit:'contain'}} />
          <div style={{fontSize:13,marginTop:8,height:36,overflow:'hidden'}}>{p.title?.slice(0,90)}</div>
          <div style={{marginTop:8}}>
            <b>{p.price}</b>
            <span style={{fontSize:12,background:p.source==='Amazon'?'#ff9900':'#2874f0',color:'white',padding:'2px 6px',borderRadius:4,marginLeft:6}}>{p.source}</span>
          </div>
          <div style={{fontSize:11,color:'#666',marginTop:4}}>Final: Rs.{p.finalPrice} (incl. delivery)</div>
          <a href={p.link} target="_blank" rel="noreferrer" style={{display:'block',marginTop:10,background:'black',color:'white',textAlign:'center',padding:'10px',borderRadius:8,textDecoration:'none',fontWeight:'bold'}}>Search on {p.source}</a>
        </div>
      ))}
    </div>
  </div>
 );
}
