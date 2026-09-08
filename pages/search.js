import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("low");

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
    if (!input) return;
    router.push(`/search?q=${encodeURIComponent(input)}`);
  };

  const sorted = [...results].sort((a,b)=>{
    if(sortBy==="low") return a.price - b.price;
    if(sortBy==="high") return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0B1220', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header - Theme */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0B1220', position: 'sticky', top: 0, zIndex: 10 }}>
        <div onClick={()=>router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', background: '#111C32', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛒</div>
          <b style={{ fontSize: '20px', color: 'white' }}>Real-<span style={{ color: '#3B82F6' }}>DAM</span></b>
        </div>
        <span style={{ fontSize: '11px', background: '#111C32', border: '1px solid #1E2D52', padding: '5px 10px', borderRadius: '12px', color: '#64748B' }}>TRUE Price</span>
      </div>

      {/* Search - White rounded like screenshot */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '4px', border: '1.5px solid #E2E8F0' }}>
          <span style={{ paddingLeft: '12px' }}>🔍</span>
          <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && doSearch()} placeholder="Search products, brands, prices..." style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 8px', fontSize: '14px' }} />
          <button onClick={doSearch} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold' }}>Go</button>
        </div>
      </div>

      {/* SORT - New */}
      <div style={{ padding: '0 16px 10px', maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '8px' }}>
        <button onClick={()=>setSortBy('low')} style={{ background: sortBy==='low' ? '#2563EB' : '#111C32', color: sortBy==='low' ? 'white' : '#94A3B8', border: '1px solid #1E2D52', padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Low to High ↑</button>
        <button onClick={()=>setSortBy('high')} style={{ background: sortBy==='high' ? '#2563EB' : '#111C32', color: sortBy==='high' ? 'white' : '#94A3B8', border: '1px solid #1E2D52', padding: '8px 14px', borderRadius: '20px', fontSize: '12px' }}>High to Low ↓</button>
        <button style={{ background: '#111C32', color: '#94A3B8', border: '1px solid #1E2D52', padding: '8px 14px', borderRadius: '20px', fontSize: '12px' }}>Discount %</button>
      </div>

      <div style={{ padding: '0 16px 20px', maxWidth: '600px', margin: '0 auto' }}>
        {loading && (
          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', marginTop: '10px' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid #E2E8F0', borderTop: '4px solid #2563EB', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '14px', color: '#2563EB', fontWeight: '800' }}>Finding best TRUE prices...</p>
              <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Checking Amazon, Flipkart, Myntra, Blinkit...</p>
            </div>
            {[1,2,3].map(i=>(
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '14px', display: 'flex', gap: '14px', marginTop: '10px', opacity: 0.6 }}>
                <div style={{ width: '60px', height: '60px', background: '#F1F5F9', borderRadius: '10px' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '12px', background: '#F1F5F9', borderRadius: '6px', width: '80%' }}></div>
                  <div style={{ height: '12px', background: '#F1F5F9', borderRadius: '6px', width: '30%', marginTop: '10px' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
          {sorted.map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #F1F5F9' }}>
              <img src={item.thumbnail} style={{ width: '64px', height: '64px', objectFit: 'contain', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F1F5F9' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', lineHeight: '1.3' }}>{item.title?.slice(0,55
