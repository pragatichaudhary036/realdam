import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      });
  }, [q]);

  // Cheapest nikaalo
  const cheapestPrice = results.length ? Math.min(...results.map(r => r.finalPrice || 999999)) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 10 }}>
        <div onClick={() => router.push("/")} style={{ cursor: "pointer", fontWeight: 900, color: "#0f172a" }}>RealDAM</div>
        <div style={{ color: "#64748b", fontSize: "14px" }}>/ Search: <b style={{ color: "#0f172a" }}>{q}</b></div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 16px" }}>
        {loading && <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>🔍 TRUE Price dhoondh rahe hai...</div>}

        {!loading && results.length === 0 && <div style={{ textAlign: "center", padding: "60px" }}>Koi result nahi mila</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "16px" }}>
          {results.map((item, i) => {
            const isCheapest = item.finalPrice === cheapestPrice;
            const source = item.link?.includes("amazon") ? "Amazon" : item.link?.includes("flipkart") ? "Flipkart" : item.link?.includes("myntra") ? "Myntra" : "Store";

            return (
              <div key={i} style={{
                background: "white",
                borderRadius: "16px",
                border: isCheapest ? "2px solid #2563eb" : "1px solid #e2e8f0",
                overflow: "hidden",
                position: "relative",
                boxShadow: isCheapest ? "0 8px 25px rgba(37,99,235,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                {isCheapest && <div style={{ background: "#2563eb", color: "white", fontSize: "10px", fontWeight: 800, padding: "4px 8px", position: "absolute", top: "10px", left: "10px", borderRadius: "6px", zIndex: 2 }}>CHEAPEST ✓</div>}

                <div style={{ height: "200px", background: "#f8fafc", display: "grid", placeItems: "center", padding: "10px" }}>
                  <img src={item.thumbnail} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>

                <div style={{ padding: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700, marginBottom: "4px" }}>{source}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", height: "36px", overflow: "hidden" }}>{item.title?.slice(0, 60)}</div>
                  
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>₹{item.finalPrice}</span>
                    <span style={{ fontSize: "11px", color: "#64748b", textDecoration: "line-through" }}>{item.price}</span>
                  </div>

                  <a href={item.link} target="_blank" style={{ display: "block", textAlign: "center", marginTop: "10px", background: isCheapest ? "#0f172a" : "white", color: isCheapest ? "white" : "#0f172a", border: isCheapest ? "none" : "1px solid #e2e8f0", padding: "9px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                    {isCheapest ? "Best Deal - Buy" : `Buy on ${source}`} →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
