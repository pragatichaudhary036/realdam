import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [q, setQ] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const doSearch = () => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0E152A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>

      {/* Logo */}
      <div style={{ width: '140px', height: '140px', background: '#131E36', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', marginBottom: '24px' }}>
        <div style={{ fontSize: '70px' }}>🛍️</div>
      </div>

      <h1 style={{ fontSize: '56px', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-1px' }}>Real<span style={{ color: '#2F6BFF' }}>DAM</span></h1>
      <p style={{ color: '#8A9BB5', fontSize: '15px', marginTop: '8px' }}>The True Final Price - Sasta Nahi, Real</p>

      <div style={{ width: '100%', maxWidth: '360px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '4px 6px', marginTop: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <span style={{ paddingLeft: '12px', fontSize: '20px', color: '#2F6BFF' }}>🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} placeholder="Search products, brands, prices..." style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 10px', fontSize: '14px', background: 'transparent' }} />
      </div>

      {showInstall && (
        <button onClick={installApp} style={{ marginTop: '20px', background: '#2F6BFF', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold' }}>⬇️ Install App</button>
      )}
    </div>
  );
}
