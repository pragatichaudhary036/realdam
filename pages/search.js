import { useRouter } from 'next/router';

const DB = [
  { id:'iphone', name:'Apple iPhone 16 128GB', img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' },
  { id:'shoes', name:'Nike Air Max Shoes', img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id:'watch', name:'Samsung Galaxy Watch 6', img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { id:'airpods', name:'AirPods Pro 2nd Gen', img:'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400' },
];

export default function SearchPage(){
  const router = useRouter();
  const q = (router.query.q||'').toLowerCase();
  const list = DB.filter(p=> p.name.toLowerCase().includes(q) || q==='' );

  return (
    <div style={{maxWidth:800, margin:'0 auto', padding:20, fontFamily:'system-ui'}}>
      <div onClick={()=>router.push('/')} style={{fontWeight:900, cursor:'pointer'}}><span style={{background:'#10b981', color:'#fff', padding:'4px 8px', borderRadius:8}}>₹</span> RealDAM</div>
      <h2 style={{marginTop:20}}>Products for "{router.query.q}"</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:16}}>
        {list.map(p=>(
          <div key={p.id} onClick={()=>router.push(`/product/${p.id}?name=${encodeURIComponent(p.name)}&img=${encodeURIComponent(p.img)}`)} style={{border:'1px solid #eee', borderRadius:14, overflow:'hidden', cursor:'pointer'}}>
            <img src={p.img} style={{width:'100%', height:170, objectFit:'cover'}} />
            <div style={{padding:10, fontWeight:700, fontSize:14}}>{p.name}</div>
            <div style={{padding:'0 10px 10px', fontSize:12, color:'#fff', background:'#000', margin:'0 10px 10px', textAlign:'center', borderRadius:20}}>View Comparison →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
