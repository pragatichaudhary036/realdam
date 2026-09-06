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

  // Group same model
  const getAppName = (link, source) => {
    const l = (link || "").toLowerCase();
    if (l.includes("amazon")) return "Amazon";
    if (l.includes("flipkart")) return "Flipkart";
    if (l.includes("croma")) return "Croma";
    if (l.includes("reliance")) return "Reliance";
    if (source) return source;
    return "Store";
  };

  // Group by title (same model)
  const grouped = {};
  results.forEach(item => {
    const key = item.title?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40) || Math.random();
    // Simple grouping - same first 40 chars
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
     ...item,
      appName: getAppName(item.link, item.source),
      priceVal: item.finalPrice || item.priceValue || 999999
    });
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "12px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <span onClick={() => router.push("/")} style={{ cursor: "pointer", fontWeight: 900 }}>RealDAM</span>
        <span style={{ color: "#64748b", fontSize: "14px", marginLeft: "10px" }}>/ {q}</span>
      </div>

      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 16px" }}>
        {loading && <div style={{ textAlign: "center", padding: "60px" }}>TRUE Price dhoondh rahe hai...</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {Object.values(grouped).map((group, idx) => {
            const sorted = [...group].sort((a, b) => a.priceVal - b.priceVal);
            const cheapest = sorted[0];
            const mainProduct = group[0];

            return (
              <div key={idx} style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ height: "220px", background: "#f8fafc", display: "grid", placeItems: "center", padding: "10px" }}>
                  <img src={mainProduct.thumbnail} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>

                <div style={{ padding: "12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, height: "36px", overflow: "hidden" }}>{mainProduct.title?.slice(0, 70)}</div>
                  <div style={{ fontSize: "18px", fontWeight: 900, marginTop: "8px" }}>₹{cheapest.priceVal}</div>

                  {/* YAHI HAI MAIN FEATURE - Kis app pe kitna */}
                  <div style={{ marginTop: "10px", background: "#f8fafc", borderRadius: "10px", padding: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>Kahan sabse sasta?</div>
                    {sorted.slice(0, 4).map((offer, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", fontSize: "12px", borderBottom: j < sorted.length -1? "1px solid #f1f5f9" : "none" }}>
                        <span style={{ fontWeight: offer.appName === cheapest.appName? 800 : 500, color: offer.appName === cheapest.appName? "#16a34a" : "#334155" }}>
                          {offer.appName} {offer.appName === cheapest.appName && "✓"}
                        </span>
                        <span style={{ fontWeight: 700, color: offer.appName === cheapest.appName? "#16a34a" : "#0f172a" }}>₹{offer.priceVal}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: "6px", background: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: 700, padding: "5px", borderRadius: "6px", textAlign: "center" }}>
                      👉 {cheapest.appName} pe sabse sasta hai
                    </div>
                  </div>

                  <a href={cheapest.link} target="_blank" style={{ display: "block", textAlign: "center", marginTop: "10px", background: "#22c55e", color: "white", padding: "10px", borderRadius: "10px", fontWeight: 700, textDecoration: "none", fontSize: "13px" }}>
                    Buy on {cheapest.appName} →
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
