import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!q) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${q}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Arial' }}>
      <div style={{ background: 'linear-gradient(90deg, #0f172a, #1e3a8a)', color: 'white', padding: '25px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>RealDAM</h1>
        <p style={{ margin: '5px 0 0', fontSize: '10px', letterSpacing: '4px', color: '#93c5fd' }}>TRUE PRICE FINDER</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '-20px auto 0', padding: '15px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '12px', display: 'flex', gap: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search T-shirt, iPhone..." style={{ flex: 1, border: '1px solid #e2e8f0', background: '#f8fafc', padding: '12px', borderRadius: '10px', outline: 'none' }} />
          <button onClick={search} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0 24px', borderRadius: '10px', fontWeight: 'bold' }}>Search</button>
        </div>

        {loading && <p style={{ textAlign: 'center', marginTop: '20px', color: '#2563eb', fontWeight: 'bold' }}>Finding best prices...</p>}

        <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
          {results.map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '12px', display: 'flex', gap: '12px', border: i===0 ? '2px solid #2563eb' : '1px solid #e2e8f0', position: 'relative' }}>
              {i===0 && <span style={{ position: 'absolute', top: 0, left: 0, background: '#2563eb', color: 'white', fontSize: '9px', fontWeight: '900', padding: '4px 10px', borderRadius: '16px 0 10px 0' }}>CHEAPEST</span>}
              <img src={item.thumbnail} style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f8fafc', borderRadius: '10px', marginTop: i===0 ? '15px' : '0' }} />
              <div style={{ flex: 1, marginTop: i===0 ? '15px' : '0' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                <p style={{ margin: '4px 0', fontSize: '18px', fontWeight: '900' }}>{item.price_str}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={item.logo} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold' }}>{item.source} ✓</span>
                </div>
              </div>
              <a href={item.product_link} target="_blank" style={{ background: '#0f172a', color: 'white', textDecoration: 'none', padding: '8px 14px', borderRadius: '20px', fontSize: '11px', height: 'fit-content', fontWeight: 'bold' }}>Buy</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
