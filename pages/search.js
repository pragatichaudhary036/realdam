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
    <div style={{ minHeight: '100vh', background: '#0E152A', fontFamily: 'system-ui', paddingBottom: '20px' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, background: '#0E152A', zIndex: 10 }}>
        <div style={{ width: '38px', height: '38px', background: '#131E36', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
        <b style={{ fontSize: '26px', color: 'white', fontWeight: '800' }}>Real<span style={{ color: '#2F6BFF' }}>DAM</span></b>
      </div>

      <div style={{ padding: '8px 16px' }}>
        <div style={{ background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '5px 6px' }}>
          <span style={{ paddingLeft: '12px', fontSize: '18px' }}>🔍</span>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} placeholder="Search products..." style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 8px', fontSize: '15px' }} />
          <span style={{ paddingRight: '12px', fontSize: '18px' }}>🎙️</span>
        </div>
      </div>

      <div style={{ padding: '10px 16px' }}>
        <button onClick={()=>setOpenSort(!openSort)} style={{ background: 'transparent', border: '1px solid #2A3A5E', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
          Sort by: {sortBy} ⌄
        </button>
        {openSort && (
          <div style={{ background: 'white', borderRadius: '12px', marginTop: '8px', width: '160px', overflow: 'hidden' }}>
            <div onClick={()=>{setSortBy('relevance'); setOpenSort(false)}} style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>Relevance</div>
            <div onClick={()=>{setSortBy('low'); setOpenSort(false)}} style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>Low to High</div>
            <div onClick={()=>{setSortBy('high'); setOpenSort(false)}} style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>High to Low</div>
          </div>
        )}
      </div>

      <div style={{ padding: '8px 16px', display: 'grid', gap: '14px', maxWidth: '500px', margin: '0 auto' }}>
        {loading && [1,2,3].map(i=>(
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '16px', height: '90px', opacity: 0.7 }}></div>
        ))}
        {sorted.map((item,i)=>(
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '14px', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <img src={item.thumbnail} style={{ width: '68px', height: '68px', objectFit: 'contain' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', lineHeight: '1.3' }}>{item.title?.slice(0,60)}</div>
              <div style={{ color: '#2F6BFF', fontWeight: '900', fontSize: '18px', marginTop: '4px' }}>{item.price_str} {item.is_true_total && <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '400', textDecoration: 'line-through' }}>{item.base_price_str}</span>}</div>
              <div style={{ marginTop: '6px', fontSize: '11px', background: item.is_true_total? '#FFF1F2' : '#F1F5F9', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: '6px', display: 'inline-block', color: item.is_true_total? '#DC2626' : '#475569' }}>
                {item.is_true_total? `Cheapest on ${item.source} • ${item.base_price_str} + ₹${item.delivery_cost}` : `Cheapest on ${item.source}`}
              </div>
              <div style={{ fontSize: '10px', color: item.is_true_total? '#DC2626' : '#16A34A', marginTop: '4px', fontWeight: '600' }}>🚚 {item.delivery} {item.is_true_total? `= Total ${item.price_str}` : ''}</div>
            </div>
            <a href={item.product_link} target="_blank" style={{ textDecoration: 'none', fontSize: '18px' }}>↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}
