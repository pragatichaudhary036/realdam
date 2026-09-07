import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!q) return;

    const fetchData = async () => {
      setLoading(true);

      // 30 DAYS CACHE CHECK
      try {
        const cached = localStorage.getItem(`realdam_${q.toLowerCase()}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.expiry > Date.now()) {
            setResults(parsed.data);
            setLoading(false);
            return;
          }
        }
      } catch {}

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();

        let final = Array.isArray(data)? data : (data.products || data.results || data.data || []);

        // Delivery charge logic add kiya
        final = final.map(p => ({
         ...p,
          delivery: (p.price || 0) > 500? 0 : 49,
          finalPrice: (p.price || 0) + ((p.price || 0) > 500? 0 : 49)
        }));

        // Price se sort karke winner nikala
        final.sort((a,b) => (a.finalPrice || a.price) - (b.finalPrice || b.price));

        setResults(final);
        localStorage.setItem(`realdam_${q.toLowerCase()}`, JSON.stringify({ data: final, expiry: Date.now() + 30*24*60*60*1000 }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  return (
    <div style={{ background: '#0a0a23', minHeight: '100vh', color: 'white' }}>
      {/* LOGO SMALL - Second page pe chhota */}
      <div style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e1e3f', position: 'sticky', top: 0, background: '#0a0a23', zIndex: 10 }}>
        <h2 onClick={() => router.push('/')} style={{ fontSize: '20px', margin: 0, cursor: 'pointer' }}>
          <span style={{ color: '#00ff88' }}>R</span>ealDAM
        </h2>
        <div style={{ flex: 1, marginLeft: '10px', background: '#1e1e3f', borderRadius: '20px', padding: '8px 15px', fontSize: '13px', opacity: 0.8 }}>
          {q}
        </div>
        <button onClick={() => router.push('/')} style={{ background: '#00ff88', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>Search</button>
      </div>

      {loading? (
        <div style={{ padding: '15px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: '#1a1a3a', borderRadius: '12px', padding: '15px', marginBottom: '12px' }}>
              <div style={{ height: '14px', width: '30%', background: '#2a2a5a', borderRadius: '6px', marginBottom: '10px' }}></div>
              <div style={{ height: '10px', width: '80%', background: '#2a2a5a', borderRadius: '6px', marginBottom: '10px' }}></div>
              <div style={{ height: '36px', width: '100%', background: '#2a2a5a', borderRadius: '8px' }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ paddingBottom: '20px' }}>
          {results.map((item, idx) => {
            const isWinner = idx === 0;
            return (
              <div key={idx} style={{ margin: '12px', background: isWinner? '#112a1d' : '#1a1a3a', border: isWinner? '1.5px solid #00ff88' : '1px solid #22224a', borderRadius: '14px', padding: '14px', position: 'relative' }}>
                {isWinner && (
                  <div style={{ position: 'absolute', top: '-8px', left: '12px', background: '#00ff88', color: 'black', fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ background: 'white', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</span> WINNER - {(item.platform || item.store || 'BEST').toUpperCase()}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', marginTop: isWinner? '6px' : '0' }}>
                  <img src={item.image || item.thumbnail || ''} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', background: '#222' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', margin: '0 0 5px', lineHeight: '1.3' }}>{item.title || item.name}</p>
                    <p style={{ margin: 0, color: '#00ff88', fontWeight: 'bold' }}>₹{item.price}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '11px', opacity: 0.6 }}>Delivery: {item.delivery === 0? 'FREE Delivery' : `₹${item.delivery}`} • Total: ₹{item.finalPrice}</p>
                  </div>
                </div>
                <a href={item.link || item.url} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: '12px', background: isWinner? '#00ff88' : 'white', color: 'black', padding: '11px', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                  Go to {item.platform || 'Store'} Store ↗
                </a>
              </div>
            )
          })}
          {results.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>No results found</p>}
        </div>
      )}
    </div>
  );
}
