import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ background: '#0a0a23', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', padding: '20px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', margin: 0 }}>
          <span style={{ color: '#00ff88' }}>R</span>ealDAM
        </h1>
        <p style={{ opacity: 0.6, marginTop: '8px', marginBottom: '30px' }}>Compare Prices - Find Best Deal</p>

        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '400px', display: 'flex', gap: '10px' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product..."
            style={{ flex: 1, padding: '16px 20px', borderRadius: '30px', border: 'none', background: '#1e1e3f', color: 'white', outline: 'none', fontSize: '15px' }}
          />
          <button type="submit" style={{ padding: '16px 26px', borderRadius: '30px', border: 'none', background: '#00ff88', fontWeight: 'bold', color: 'black', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </div>

      {showInstall && (
        <div style={{ position: 'fixed', bottom: '20px', left: '15px', right: '15px', background: '#1e1e3f', padding: '14px 18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2a2a5a' }}>
          <span style={{ fontSize: '14px' }}>📲 RealDAM App Install Karo</span>
          <button onClick={() => deferredPrompt?.prompt()} style={{ background: '#00ff88', border: 'none', padding: '7px 16px', borderRadius: '20px', fontWeight: 'bold' }}>Install</button>
        </div>
      )}
    </div>
  );
}
