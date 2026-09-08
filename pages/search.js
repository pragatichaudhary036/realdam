import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    if (q) setInput(q);
    if (!q) return;
    const fetchData = async () => {
      setLoading(true);
      setResults([]);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    };
    fetchData();
  }, [q]);

  const doSearch = () => {
    if (!input.trim()) return;
    router.push(`/search?q=${encodeURIComponent(input)}`);
  };

  const sorted = [...results].sort((a,b)=>{
    if(sortBy==="low") return a.price - b.price;
    if(sortBy==="high") return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0E152A', fontFamily: 'system-ui, sans-serif', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, background: '#0E152A', zIndex: 10 }}>
        <div style={{ width: '38px', height: '38px', background: '#131E36', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
        <b style={{ fontSize: '26px', color: 'white', fontWeight: '800' }}>Real<span style={{ color: '#2F6BFF' }}>DAM</span></b>
      </div>

      {/* Search Bar like screenshot */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '5px 6px' }}>
          <span style={{ paddingLeft: '12px', fontSize: '18px' }}>🔍</span>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} placeholder="Search products..." style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 8px', fontSize: '15px' }} />
          <span style={{ paddingRight: '12px', fontSize: '18px' }}>🎙️</span>
        </div>
      </div>

      {/* Sort by - exact like screenshot */}
      <div style={{ padding: '10px 16px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button onClick={()=>setOpenSort(!openSort)} style={{ background: 'transparent', border: '1px solid #2A3A5E', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Sort by: {sortBy === 'relevance'? 'Relevance' : sortBy === 'low'? 'Low to High' : 'High to Low'} <span style={{ fontSize: '12px' }}>⌄</span>
          </button>
          {openSort && (
            <div style={{ position: 'absolute', top: '36px', left: 0, background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', zIndex: 20, width: '160px' }}>
              <div onClick={()=>{setSortBy('relevance'); setOpenSort(false)}} style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>Relevance</div>
              <div onClick={()=>{setSortBy('low'); setOpenSort(false)}} style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>Low to High</div>
              <div onClick={()=>{setSortBy('high'); setOpenSort(false)}} style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>High to Low</div>
            </div>
          )}
        </div>
      </div>

      {/* Results - Cards like screenshot */}
      <div style={{ padding: '8px 16px', display: 'grid', gap: '14px', maxWidth: '500px', margin: '0 auto' }}>
        {loading && [1,2,3].map(i=>(
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', opacity: 0.7 }}>
            <div style={{ width: '70px', height: '70px', background: '#F1F5F9', borderRadius: '10px' }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ height: '14px', background: '#F1F5F9', borderRadius: '6px', width: '80%' }}></div>
              <div style={{ height: '14px', background: '#F1F5F9', borderRadius: '6px', width: '30%', marginTop: '12px' }}></div>
            </div>
          </div>
        ))}

        {sorted.map((item,i)=>(
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <img src={item.thumbnail} style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', lineHeight: '1.3' }}>{item.title?.slice(0,50)}</div>
              <div style={{ color: '#2F6BFF', fontWeight: '800', fontSize: '18px', marginTop: '6px' }}>{item.price_str}</div>
              <div style={{ marginTop: '8px', fontSize: '11px', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: '8px', display: 'inline-block', color: '#475569' }}>
                Cheapest on <b style={{ color: item.source.toLowerCase().includes('amazon')? '#FF9900' : '#2563EB' }}>{item.source}</b> {item.source.toLowerCase().includes('amazon')? '↗' : item.source.toLowerCase().includes('walmart')? '✳' : ''}
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>🚚 {item.delivery}</div>
            </div>
            <a href={item.product_link} target="_blank" style={{ textDecoration: 'none', color: '#0F172A', fontSize: '18px' }}>↗</a>
          </div>
        ))}
      </div>

      {!loading && results.length>0 && <p style={{ textAlign: 'center', color: '#5B6B8A', fontSize: '13px', marginTop: '20px' }}>Page 1 of {Math.ceil(results.length/10)} • {results.length} prices found</p>}
    </div>
  );
}
