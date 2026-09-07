import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleSearch = (e, text) => {
    if(e) e.preventDefault();
    const finalQ = text || query;
    if(!finalQ.trim()) return;
    router.push(`/search?q=${encodeURIComponent(finalQ)}`);
  };

  const suggestions = ["iPhone 15", "Nike Shoes", "Smart Watch", "Headphones"];

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '38px', height: '38px', background: '#0a0a23', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍️</div>
        <span style={{ fontWeight: '800', fontSize: '18px' }}>RealDAM</span>
        <span style={{ marginLeft: 'auto', background: '#f0f3ff', color: '#6b7280', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>TRUE Price Finder</span>
      </div>

      {/* Main Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
        <div style={{ width: '110px', height: '110px', background: '#0a0a23', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' }}>🛍️</div>
        <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '20px 0 0', letterSpacing: '-1px' }}>
          Real<span style={{ color: '#2b6cff' }}>DAM</span>
        </h1>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '16px', color: '#4b5563', lineHeight: '1.4' }}>
          Sabse Sasta Nahi, <b style={{ color: 'black' }}>TRUE Final Price</b><br/>Dikhate Hai
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginTop: '30px', width: '90%', maxWidth: '400px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '30px', padding: '5px 5px 5px 15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>🔍</span>
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Product search karo - iPhone"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', padding: '10px 0' }}
            />
            <button type="submit" style={{ background: '#2b6cff', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
          </div>
        </form>

        {/* Suggestions Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px', maxWidth: '320px' }}>
          {suggestions.map(item => (
            <button key={item} onClick={()=>handleSearch(null, item)} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>{item}</button>
          ))}
        </div>
      </div>

      {/* Install Button - Bottom me */}
      {showInstall && (
        <div style={{ position: 'fixed', bottom: '20px', left: '15px', right: '15px', background: '#0a0a23', color: 'white', padding: '14px 18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>📲 App Install Karo</span>
          <button onClick={()=>{deferredPrompt.prompt(); setShowInstall(false)}} style={{ background: '#2b6cff', color: 'white', border: 'none', padding: '7px 16px', borderRadius: '20px', fontWeight: 'bold' }}>Install</button>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-around', opacity: 0.4, fontSize: '22px' }}>
        <span>☰</span><span>⌂</span><span>↪</span>
      </div>
    </div>
  )
}
