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

  const cheapestPrice = results.length ? Math.min(...results.map(r => r.finalPrice || r.priceValue || 999999)) : 0;

  const getAppName = (item) => {
    const link = (item.link || "").toLowerCase();
    if (link.includes("amazon")) return "Amazon";
    if (link.includes("flipkart")) return "Flipkart";
    if (link.includes("myntra")) return "Myntra";
    if (item.source) return item.source;
    return "Best Store";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 10 }}>
        <div onClick={() => router.push("/")} style={{ cursor: "pointer", fontWeight: 900, color: "#0f172a" }}>RealDAM</div>
        <div style={{ color: "#64748b", fontSize: "14px" }}>/ Search: <b style={{ color: "#0f172a" }}>{q}</b></div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 16px" }}>
        {loading && <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>🔍 TRUE Price dhoondh rahe hai...</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "16px" }}>
          {results.map((item, i) => {
            const appName = getAppName(item);
            const price = item.finalPrice || item.priceValue || item.price;
            const isCheapest = price === cheapestPrice;

            return (
              <div key={i} style={{
                background: "white",
                borderRadius: "16px",
                border: isCheapest ? "2px solid #22c55e" : "1px solid #e2e8f0",
                overflow: "hidden",
                position: "relative",
                boxShadow: isCheapest ? "0 8px 25px rgba(34,197,94,0.2)" : "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                {/* WINNING TAG - GREEN BOX */}
                {isCheapest && (
                  <div style={{ 
                    background: "#22c55e", 
                    color: "white", 
                    fontSize: "11px", 
                    fontWeight: 800, 
                    padding: "5px 10px", 
                    position: "absolute", 
                    top: "10px", 
                    left: "10px", 
                    borderRadius: "8px", 
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    🏆 {appName} - Sabse Sasta Hai
                  </div>
                )}

                <div style={{ height: "200px", background: "#f8fafc", display: "grid", placeItems: "center", padding: "10px" }}>
                  <img src={item.thumbnail} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>

                <div style={{ padding: "12px" }}>
                  {/* App Name Small */}
                  <div style={{ 
                    fontSize: "11px", 
                    color: isCheapest ? "#22c55e" : "#2563eb", 
                    fontWeight: 800, 
                    marginBottom: "4px",
                    textTransform: "uppercase"
                  }}>
                    {appName}
                  </div>
                  
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", height: "36px", overflow: "hidden" }}>{item.title?.slice(0, 60)}</div>
                  
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>₹{price}</span>
                  </div>

                  {/* GREEN BOX BUTTON FOR WINNER */}
                  <a href={item.link} target="_blank" style={{ 
                    display: "block", 
                    textAlign: "center", 
                    marginTop: "10px", 
                    background: isCheapest ? "#22c55e" : "#0f172a", 
                    color: "white", 
                    border: "none", 
                    padding: "10px", 
                    borderRadius: "10px", 
                    fontSize: "13px", 
                    fontWeight: 700, 
                    textDecoration: "none" 
                  }}>
                    {isCheapest ? `Best Deal on ${appName} - Buy` : `Buy on ${appName}`} →
                  </a>

                  {isCheapest && (
                    <div style={{
                      marginTop: "8px",
                      background: "#f0fdf4",
                      border: "1px dashed #22c55e",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "11px",
                      color: "#15803d",
                      fontWeight: 600,
                      textAlign: "center"
                    }}>
                      ✓ Winning App: {appName} sabse sasta de raha hai
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
