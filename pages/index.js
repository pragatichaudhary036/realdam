import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFor = async (term) => {
    const query = term || q;
    if (!query) return;
    setQ(query);
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
          <span style={{ fontWeight: '900', fontSize: '22px' }}>RealDAM</span>
        </div>
        <span style={{ background: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TRUE Price Finder</span>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '20px 20px 10px' }}>
        <div style={{ width: '84px', height: '84px', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: '24px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(30,58,138,0.3)', fontSize: '36px' }}>🛍️</div>
        <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '18px 0 0', letterSpacing: '-1px' }}>Real<span style={{ color: '#2563eb' }}>DAM</span></h1>
        <p style={{ color: '#475569', marginTop: '8px', fontSize: '18px', lineHeight: '1.3' }}>Sabse Sasta Nahi, <b style={{ color: '#0f172a' }}>TRUE Final Price</b><br/>Dikhate Hai</p>
      </div>

      {/* Search */}
      <div style={{ padding: '20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', border: '2px solid #e2e8f0', borderRadius: '18px', padding: '8px', display: 'flex', gap: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px' }}>
            <span>🔍</span>
            <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && searchFor()} placeholder="Product search karo - iPhone..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }} />
          </div>
          <button onClick={()=>searchFor()} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', fontSize: '15px' }}>Search</button>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '8px', justify
