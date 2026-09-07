import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('none');
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if(!query) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  let display = [...products];
  if (sortBy === 'lowToHigh') display.sort((a,b) => a.totalPrice - b.totalPrice);
  if (sortBy === 'highToLow') display.sort((a,b) => b.totalPrice - a.totalPrice);

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif'}}>
      <h1 style={{textAlign: 'center'}}>RealDam - Real Price Comparison</h1>
      
      <div style={{display:'flex', gap:'10px', margin:'20px 0'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search product e.g. shoes" style={{flex:1, padding:'12px', border:'1px solid #ccc', borderRadius:'8px'}} />
        <button onClick={search} style={{padding:'12px 20px', background:'black', color:'white', borderRadius:'8px'}}>Search</button>
      </div>

      <div style={{marginBottom:'15px'}}>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:'8px', borderRadius:'6px'}}>
          <option value="none">Sort: None (Optional)</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
        <span style={{marginLeft:'10px', color:'#666'}}>{display.length} products found (Real only, No Dummy)</span>
      </div>

      {loading && <p>Loading real products from trusted apps...</p>}

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'15px'}}>
        {display.map((p,i)=>(
          <div key={i} style={{border:'1px solid #eee', borderRadius:'12px', padding:'12px'}}>
            <img src={p.image} alt="" style={{width:'100%', height:'180px', objectFit:'contain'}} />
            <h3 style={{fontSize:'14px', height:'40px', overflow:'hidden'}}>{p.title}</h3>
            <p style={{margin:'5px 0'}}>Price: ₹{p.price}</p>
            <p style={{margin:'5px 0'}}>Delivery: ₹{p.delivery}</p>
            <p style={{margin:'5px 0', fontWeight:'bold'}}>Total: ₹{p.totalPrice}</p>
            <p style={{color:'green', fontWeight:'bold'}}>Cheapest on: {p.platform}</p>
            <a href={p.product_link} target="_blank" rel="noreferrer" style={{display:'block', textAlign:'center', background:'#ff9900', color:'black', padding:'8px', borderRadius:'6px', marginTop:'8px', textDecoration:'none'}}>View on {p.platform}</a>
          </div>
        ))}
      </div>
    </div>
  )
}
