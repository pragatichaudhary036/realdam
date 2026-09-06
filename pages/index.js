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
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header Same as Screenshot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '46px', height: '46px', background: '#111a33', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: '22px' }}>🛍️</span>
            <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#2563eb', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', border: '2px solid white' }}>⇄</div>
          </div>
          <span style={{ fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px', color: '#111' }}>RealDAM</span>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>TRUE Price Finder</div>
      </div>

      {/* Center Icon Same as Screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px' }}>
        <div style={{ width: '96px', height: '96px', background: 'linear-gradient(180deg, #162252, #0f1a3a)', borderRadius: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(15,26,58,0.25)', position: 'relative' }}>
          <span style={{ fontSize: '44px' }}>🛍️</span>
          <div style={{ position: 'absolute', bottom: '12px', right: '8px', background: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #2563eb' }}>⇄</div>
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '20px 0 0', letterSpacing: '-1.5px', color: '#0f172a' }}>Real<span style={{ color: '#2563eb' }}>DAM</span></h1>
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '17px', marginTop: '10px', lineHeight: '1.4' }}>
          Sabse Sasta Nahi, <b style={{ color: '#0f172a' }}>TRUE Final Price</b><br/>Dikhate Hai
        </p>
      </div>

      {/* Search Bar Same */}
      <div style={{ padding: '28px 16px 0' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <span style={{ paddingLeft: '14px', fontSize: '18px', opacity: 0.7 }}>🔍</span>
          <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && searchFor()} placeholder="Product search karo - iPhone, Shoes..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', padding: '8px 4px' }} />
          <button onClick={()=>searchFor()} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '14px 26px', borderRadius: '16px', fontWeight: '700', fontSize: '15px' }}>Search</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
          {["iPhone 15","Nike Shoes","Smart Watch","Headphones"].map(t=>(
            <button key={t} onClick={()=>searchFor(t)} style={{ background: '#f8fafc', border: '1px solid #e8edf3', padding: '10px 18px', borderRadius: '24px', fontSize: '14px', color: '#334155', fontWeight: '500' }}>{t}</button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', marginTop: '24px', color: '#2563eb', fontWeight: '700' }}>Finding...</p>}

        <div style={{ maxWidth: '520px', margin: '18px auto 0', display: 'grid', gap: '10px' }}>
          {results.map((item,i)=>(
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', border: i===0 ? '2px solid #2563eb' : '1px solid #e2e8f0
