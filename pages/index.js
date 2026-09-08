import { useState, useEffect } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('none');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  const search = async () => {
    if (!query) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  let display = [...products];
  if (sortBy === 'lowToHigh') display.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
  if (sortBy === 'highToLow') display.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', paddingBottom: '100px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontWeight: '800', fontSize: '32px', color: '#0a0a23' }}>RealDom - Real Price Comparison</h1>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="Search products..." style={{ flex: 1, padding: '12px 14px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }} />
        <button onClick={search} style={{ padding: '12px 24px', background: '#0a0a23', color: 'white', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Search</button>
      </div>

      {searched && (
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option value="none">Sort: None (Optional)</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
          <span style={{ color: '#666' }}>{display.length} trusted apps found</span>
        </div>
      )}

      {loading && <p style={{ textAlign: 'center' }}>Finding best prices...</p>}
      {!loading && searched && display.length === 0 && <p style={{ textAlign: 'center' }}>No products found. Try another word</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '15px' }}>
        {display.map((p, i) => (
          <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: '16px', padding: '12px', background: 'white' }}>
            <img src={p.image} alt="" style={{ width: '100%', height: '140px', objectFit: 'contain', background: '#f9f9f9', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '14px', height: '34px', overflow: 'hidden', margin: '10px 0 8px 0' }}>{p.title}</h3>
            {p.price !== null ? (
              <>
                <p style={{ margin: '2px 0', fontSize: '13px' }}>Price: ₹{p.price}</p>
                <p style={{ margin: '2px 0', fontSize: '13px' }}>Delivery: ₹{p.delivery || 0}</p>
                <p style={{ margin: '4px 0', fontWeight: '800', fontSize: '15px', color: '#0a0a23' }}>Total: ₹{p.totalPrice}</p>
              </>
            ) : (
              <p style={{ margin: '8px 0', color: '#2563eb', fontWeight: 'bold', fontSize: '13px' }}>Tap to see Real Price</p>
            )}
            <p style={{ color: 'green', fontWeight: 'bold', fontSize: '13px', margin: '8px 0' }}>On: {p.platform}</p>
            <a href={p.productLink || p.product_link} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: '#f5f5f5', padding: '8px', borderRadius: '8px', textDecoration: 'none', color: '#0a0a23', fontWeight: 'bold', fontSize: '13px' }}>View More</a>
          </div>
        ))}
      </div>

      {/* Add to Home Screen - Sabse Neeche */}
      {showInstall && (
        <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', background: 'white', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', textAlign: 'center', zIndex: 1000 }}>
          <button onClick={handleInstall} style={{ width: '100%', maxWidth: '400px', padding: '14px 20px', background: '#0a0a23', color: 'white', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer' }}>
            📲 Add to Home Screen
          </button>
        </div>
      )}
    </div>
  );
}
