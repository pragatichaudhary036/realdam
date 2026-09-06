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
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} onClick={()=>router.push('/')}>
          <div style={{ width: '44px', height: '44px', background: '#0f172a', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>
          <b style={{ fontSize: '22px' }}>RealDAM</b>
        </div>
        <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#64748b' }}>TRUE Price Finder</span>
      </div>

      <div style={{ textAlign: 'center', paddingTop: '10px' }}>
        <div style={{ width: '90px', height: '90px', background: '#0f172a', borderRadius: '24px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px' }}>🛍️</div>
        <h1 style={{ fontSize: '42px', fontWeight: '900', marginTop: '14px' }}>Real<span style={{ color: '#2563eb' }}>DAM</span></h1>
        <p style={{ color: '#475569', marginTop: '6px' }}>Sabse Sasta Nahi, <b style={{ color: 'black' }}>TRUE Final Price</b><br/>Dikhate Hai</p>
      </div>

      <div style={{ padding: '22px 16px 10px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '6px', display: 'flex' }}>
          <span style={{ padding: '12px 0 0 14px' }}>🔍</span>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} style={{ flex: 1, border: 'none', outline: 'none', paddingLeft: '10px', fontSize: '15px' }} />
          <button onClick={doSearch} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '14px', fontWeight: 'bold' }}>Search</button>
        </div>
      </div>

      <div style={{ padding: '10px 16px', maxWidth: '600px', margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: '#2563eb', fontWeight: 'bold', marginTop: '20px' }}>Finding best prices...</p>}
        <div style={{ display: 'grid', gap: '12px', marginTop: '10px' }}>
          {results.map((item, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px', display: 'flex', gap: '12px' }}>
              <img src={item.thumbnail} style={{ width: '70px', height: '70px', objectFit: 'contain', background: '#f8fafc', borderRadius: '10px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{item.title?.slice(0,70)}</div>
                <div style={{ fontWeight: '800', marginTop: '6px' }}>{item.price_str}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{item.source}</div>
              </div>
              <a href={item.product_link} target="_blank" style={{ background: 'black', color: 'white', padding: '10px 14px', borderRadius: '20px', fontSize: '12px', height: 'fit-content', textDecoration: 'none' }}>Buy</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
