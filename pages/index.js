import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const goSearch = (term) => {
    const query = term || q;
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '44px', height: '44px', background: '#0f172a', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
          <b style={{ fontSize: '22px' }}>RealDAM</b>
        </div>
        <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#64748b' }}>TRUE Price Finder</span>
      </div>

      <div style={{ textAlign: 'center', paddingTop: '30px' }}>
        <div style={{ width: '110px', height: '110px', background: '#0f172a', borderRadius: '28px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', boxShadow: '0 20px 40px rgba(15,23,42,0.25)' }}>🛍️</div>
        <h1 style={{ fontSize: '52px', fontWeight: '900', marginTop: '20px', letterSpacing: '-1px' }}>Real<span style={{ color: '#2563eb' }}>DAM</span></h1>
        <p style={{ color: '#475569', marginTop: '10px', fontSize: '18px', lineHeight: '1.4' }}>Sabse Sasta Nahi, <b style={{ color: 'black' }}>TRUE Final Price</b><br/>Dikhate Hai</p>
      </div>

      <div style={{ padding: '36px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '6px', display: 'flex' }}>
          <span style={{ padding: '12px 0 0 14px' }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter' && goSearch()} placeholder="Product search karo - iPhone..." style={{ flex: 1, border: 'none', outline: 'none', paddingLeft: '10px', fontSize: '15px' }} />
          <button onClick={()=>goSearch()} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontWeight: 'bold' }}>Search</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap', maxWidth: '500px', margin: '18px auto 0' }}>
          {["iPhone 15","Nike Shoes","Smart Watch","Headphones"].map(t=>(
            <button key={t} onClick={()=>goSearch(t)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '24px', fontSize: '14px' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ background: '#0f172a', margin: '60px 16px 20px', padding: '22px', borderRadius: '22px', color: 'white', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ fontSize: '26px' }}>⚡</div>
        <div style={{ fontWeight: '800', marginTop: '8px', fontSize: '18px' }}>Instant TRUE Price</div>
        <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>No extra charges, final checkout price</div>
      </div>
    </div>
  );
}
