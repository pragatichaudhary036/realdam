import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [q, setQ] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  const goSearch = (term) => {
    const query = term || q;
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B1220', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
      <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '110px', height: '110px', background: '#111C32', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>🛒</div>
        <h1 style={{ fontSize: '52px', fontWeight: '900', marginTop: '20px', color: 'white' }}>Real-<span style={{ color: '#3B82F6' }}>DAM</span></h1>
        <p style={{ color: '#94A3B8', fontSize: '18px', marginTop: '10px', textAlign: 'center' }}>Sabse Sasta Nahi, <b style={{ color: 'white' }}>TRUE Final Price</b></p>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', marginTop: '36px', background: 'white', borderRadius: '18px', padding: '6px', display: 'flex' }}>
        <span style={{ padding: '12px 0 0 14px' }}>🔍</span>
        <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && goSearch()} placeholder="Product search karo - iPhone..." style={{ flex: 1, border: 'none', outline: 'none', paddingLeft: '10px', fontSize: '16px' }} />
        <button onClick={()=>goSearch()} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontWeight: 'bold' }}>Search</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap', maxWidth: '500px' }}>
        {["iPhone 15","Nike Shoes","Smart Watch","Headphones"].map((t)=>(
          <button key={t} onClick={()=>goSearch(t)} style={{ background: '#162040', border: '1px solid #1E2D52', color: '#CBD5E1', padding: '10px 18px', borderRadius: '24px', fontSize: '14px' }}>{t}</button>
        ))}
      </div>

      {showInstall && (
        <button onClick={handleInstall} style={{ marginTop: '40px', background: '#3B82F6', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '28px', fontWeight: 'bold', fontSize: '15px' }}>⬇️ Install App</button>
      )}

      <div style={{ background: '#111C32', marginTop: '60px', padding: '22px', borderRadius: '22px', color: 'white', maxWidth: '500px', width: '100%' }}>
        <div style={{ fontSize: '26px' }}>⚡️</div>
        <div style={{ fontWeight: '800', marginTop: '8px', fontSize: '18px' }}>Instant TRUE Price</div>
        <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>No extra charges, final checkout price</div>
      </div>
    </div>
  );
}
