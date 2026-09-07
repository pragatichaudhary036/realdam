import { useState, useEffect } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState(null);
  const [showSort, setShowSort] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    setTimeout(() => setShowInstall(true), 1500);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setShowInstall(false);
    } else {
      alert("Upar 3 dot pe click karo > Add to Home Screen / Install App karo");
    }
  };

  const doSearch = async (e) => {
    if (e) e.preventDefault();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    const r = await fetch(`/api/search?q=${q}`);
    const d = await r.json();
    setItems(d.products || []);
    setLoading(false);
  };

  let sorted = [...items];
  if (sort === "low") sorted.sort((a, b) => a.totalPrice - b.totalPrice);
  if (sort === "high") sorted.sort((a, b) => b.totalPrice - a.totalPrice);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", color: "#0a2540" }}>
      <div style={{ background: "#0a2540", color: "#fff", padding: searched? "10px 16px" : "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ background: "#2563eb", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>R</div>
        <div><b>realdam</b><span style={{ fontSize: 11, opacity: 0.8, marginLeft: 6 }}>the true final price, sasta nhi real</span></div>
      </div>

      {!searched? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h1>realdam</h1>
          <form onSubmit={doSearch} style={{ border: "2px solid #0a2540", borderRadius: 30, display: "flex", padding: 4, maxWidth: 400, margin: "30px auto" }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." style={{ flex: 1, border: "none", outline: "none", padding: 10 }} />
            <button style={{ background: "#0a2540", color: "#fff", borderRadius: 20, padding: "10px 20px", border: "none" }}>Search</button>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={doSearch} style={{ border: "2px solid #0a2540", borderRadius: 30, display: "flex", padding: 4, margin: 12 }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, border: "none", outline: "none", padding: 10 }} />
            <button style={{ background: "#0a2540", color: "#fff", borderRadius: 20, padding: "10px 20px", border: "none" }}>Search</button>
          </form>
          <div style={{ padding: "0 12px", display: "flex", gap: 8 }}>
            <button onClick={() => setShowSort(!showSort)} style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid #0a2540" }}>Sort</button>
            {showSort && (
              <>
                <button onClick={() => { setSort("low"); setShowSort(false); }} style={{ padding: "6px 12px", borderRadius: 20, background: sort === "low"? "#0a2540" : "#fff", color: sort === "low"? "#fff" : "#000" }}>Low to High</button>
                <button onClick={() => { setSort("high"); setShowSort(false); }} style={{ padding: "6px 12px", borderRadius: 20, background: sort === "high"? "#0a2540" : "#fff", color: sort === "high"? "#fff" : "#000" }}>High to Low</button>
              </>
            )}
          </div>
          {loading? <div style={{ textAlign: "center", padding: 50 }}><div style={{ fontSize: 40 }}>🛒</div><p>Real Price Check Ho Raha Hai...</p></div> : <div style={{ padding: 12 }}>{sorted.map((p, i) => (<div key={i} style={{ border: i === 0? "2px solid #2563eb" : "1px solid #ddd", borderRadius: 12, padding: 10, marginBottom: 10, display: "flex", gap: 10 }}><img src={p.image} style={{ width: 60, height: 60, borderRadius: 8 }} alt=""/><div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{p.title}</div><div style={{ fontWeight: 700 }}>Rs {p.price} = Rs {p.totalPrice} Final</div>{i===0 && <span style={{ background: "#2563eb", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 8 }}>WINNER</span>}</div><button onClick={() => window.location.href = p.product_link} style={{ background: "#0a2540", color: "#fff", borderRadius: 16, padding: "8px 12px", height: 36, border: "none", fontSize: 11 }}>Buy on {p.platform}</button></div>))}</div>}
        </div>
      )}
      {showInstall && <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0a2540", color: "#fff", padding: 12, display: "flex", justifyContent: "space-between" }}><span>Install RealDAM</span><button onClick={handleInstall} style={{ background: "#fff", color: "#0a2540", borderRadius: 20, padding: "6px 12px", border: "none", fontWeight: 700 }}>Add to Home Screen</button></div>}
    </div>
  );
}
