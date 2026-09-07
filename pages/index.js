import { useState, useEffect } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [secondPage, setSecondPage] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  // PWA Install Logic
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
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowInstall(false);
    }
  };

  // 30 DAYS CACHE + 100 SEARCHES LOGIC (SAFE)
  const getCache = () => {
    try {
      const cache = JSON.parse(localStorage.getItem('realdam_cache') || '{}');
      return cache;
    } catch { return {} }
  };

  const saveCache = (q, data) => {
    const cache = getCache();
    cache[q.toLowerCase()] = {
      data: data,
      expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 din
    };
    localStorage.setItem('realdam_cache', JSON.stringify(cache));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cache = getCache();
    const cachedItem = cache[query.toLowerCase()];

    // Agar 30 din ke andar hai to API waste nahi karenge
    if (cachedItem && cachedItem.expiry > Date.now()) {
      setResults(cachedItem.data);
      setSecondPage(true);
      return;
    }

    setLoading(true);
    setSecondPage(true);

    try {
      // Teri purani API same rahegi
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      // Delivery charge add logic
      if(data && data.products){
        data.products = data.products.map(p => ({
          ...p,
          delivery: p.price > 500 ? 0 : 49,
          finalPrice: p.price + (p.price > 500 ? 0 : 49)
        }));
      }

      setResults(data);
      saveCache(query, data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loader (Medium - Professional)
  const Skeleton = () => (
    <div style={{ padding: '20px' }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ background: '#1a1a3a', borderRadius: '12px', padding: '15px', marginBottom: '15px', animation: 'pulse 1.5s infinite' }}>
          <div style={{ height: '20px', width: '60%', background: '#2a2a4a', borderRadius: '8px', marginBottom: '10px' }}></div>
          <div style={{ height: '15px', width: '90%', background: '#2a2a4a', borderRadius: '8px', marginBottom: '10px' }}></div>
          <div style={{ height: '40px', width: '100%', background: '#2a2a4a', borderRadius: '8px' }}></div>
        </div>
      ))}
      <style>{`@keyframes pulse { 0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`}</style>
    </div>
  );

  return (
    <div style={{ background: '#0a0a23', minHeight: '100vh', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* HEADER - LOGO SIZE DIFFERENT FOR 2 PAGES */}
      <div style={{ textAlign: 'center', padding: secondPage ? '15px 0 5px' : '40px 0 20px' }}>
        <h1 style={{ 
          fontSize: secondPage ? '22px' : '38px', 
          fontWeight: '800', 
          margin: 0,
          transition: '0.3s all ease'
        }}>
          <span style={{ color: '#00ff88' }}>R</span>ealDAM
        </h1>
        {!secondPage && <p style={{ opacity: 0.6, marginTop: '5px' }}>Compare Prices - Find Best Deal</p>}
      </div>

      {/* SEARCH BOX */}
      <form onSubmit={handleSearch} style={{ padding: '0 20px', display: 'flex', gap: '10px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product..."
          style={{ flex: 1, padding: '15px', borderRadius: '25px', border: 'none', outline: 'none', background: '#1e1e3f', color: 'white' }}
        />
        <button type="submit" style={{ padding: '15px 25px', borderRadius: '25px', border: 'none', background: '#00ff88', fontWeight: 'bold', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {/* SECOND PAGE RESULTS */}
      {secondPage && (
        <div style={{ marginTop: '20px' }}>
          {loading ? <Skeleton /> : (
            results?.products?.map((item, idx) => {
              const isWinner = idx === 0; // First one is winner
              return (
                <div key={idx} style={{ 
                  margin: '15px', 
                  background: isWinner ? '#102a1a' : '#1a1a3a', 
                  border: isWinner ? '2px solid #00ff88' : '1px solid #2a2a4a',
                  borderRadius: '15px', 
                  padding: '15px',
                  position: 'relative'
                }}>
                  {isWinner && (
                    <div style={{ position: 'absolute', top: '-10px', left: '15px', background: '#00ff88', color: 'black', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ background: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>✓</span> WINNER - {item.platform?.toUpperCase()}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '15px', marginTop: isWinner ? '10px' : '0' }}>
                    <img src={item.image} alt="" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', margin: '0 0 5px' }}>{item.title}</h3>
                      <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#00ff88' }}>₹{item.price}</p>
                      <p style={{ margin: '2px 0', fontSize: '12px', opacity: 0.7 }}>
                        Delivery: {item.delivery === 0 ? 'FREE' : `₹${item.delivery}`} | Total: ₹{item.finalPrice || item.price}
                      </p>
                      <p style={{ margin: '5px 0 0', fontSize: '12px', opacity: 0.6 }}>{item.platform}</p>
                    </div>
                  </div>

                  {/* DIRECT STORE LINK - NOT GOOGLE */}
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      display: 'block', 
                      textAlign: 'center', 
                      marginTop: '12px', 
                      background: isWinner ? '#00ff88' : 'white', 
                      color: 'black', 
                      padding: '12px', 
                      borderRadius: '25px', 
                      textDecoration: 'none', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Go to {item.platform} Store ↗
                  </a>
                </div>
              )
            })
          )}
          {!loading && !results?.products && <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>No results found</p>}
        </div>
      )}

      {/* PWA INSTALL BUTTON (Fixed Bottom) */}
      {showInstall && (
        <div style={{ position: 'fixed', bottom: '20px', left: '10px', right: '10px', background: '#1a1a3a', color: 'white', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '1px solid #2a2a4a' }}>
          <span>📲 RealDAM App Install Karo</span>
          <button onClick={handleInstall} style={{ background: '#00ff88', color: '#000', border: 'none', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold' }}>
            Install
          </button>
        </div>
      )}
    </div>
  );
}
