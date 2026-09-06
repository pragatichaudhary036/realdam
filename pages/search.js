import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) setInput(q);
    if (!q) return;
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    };
    fetchData();
  }, [q]);

  const doSearch = () => {
    if (!input) return;
    router.push(`/search?q=${encodeURIComponent(input)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* CHOTA HEADER - Bas yahi change hai */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={()=>router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: '#0f172a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛍️</div>
          <b style={{ fontSize: '18px' }}>RealDAM</b>
        </div>
        <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px', color: '#64748b' }}>TRUE Price</span>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '4px', display: 'flex' }}>
          <span style={{ padding: '10px 0 0 10px', fontSize: '14px' }}>🔍</span>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} style={{ flex: 1, border: 'none', outline: 'none', paddingLeft: '8px', fontSize: '14px' }} />
          <button onClick={doSearch} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px' }}>Search</button>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '0 16px 20px', maxWidth: '600px', margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: '#2563eb', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>Finding best prices...</p>}
        <div style={{ display: 'grid', gap: '10px', marginTop: '8px' }}>
          {results.map((item, i) => (
            <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <img src={item.thumbnail} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '500', lineHeight: '1.3' }}>{item.title?.slice(0,65)}</div>
                <div style={{ fontWeight: '800', marginTop: '4px', fontSize: '14px' }}>{item.price_str}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{item.source}</div>
              </div>
              <a href={item.product_link} target="_blank" style={{ background: 'black', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '11px', textDecoration: 'none' }}>Buy</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
