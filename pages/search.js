import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", padding: "20px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div onClick={() => router.push("/")} style={{ fontWeight: 800, fontSize: "18px", cursor: "pointer" }}>RealDAM</div>
          <button onClick={() => router.push("/")} style={{ border: "1px solid #ddd", background: "white", padding: "8px 14px", borderRadius: "8px", cursor: "pointer" }}>Home</button>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>
          TRUE Final Price for "{q}"
        </h2>

        {loading? (
          <p style={{ textAlign: "center", color: "#666", marginTop: "40px", fontSize: "16px" }}>
            🔍 Searching... Finding TRUE Price
          </p>
        ) : (
          <>
            <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginBottom: "24px" }}>
              {results.length} results found • Live Research
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {results.map((item, i) => (
                <div key={i} style={{ background: "white", borderRadius: "12px", padding: "12px", border: "1px solid #eee", display: "flex", flexDirection: "column" }}>
                  <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "160px", objectFit: "contain", marginBottom: "10px" }} />
                  <div style={{ fontSize: "13px", lineHeight: "1.4", height: "36px", overflow: "hidden", marginBottom: "8px" }}>{item.title}</div>

                  <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>
                    ₹{item.finalPrice || item.price}
                  </div>
                  <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600, marginBottom: "10px" }}>
                    ✓ TRUE Final Price
                  </div>

                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto", background: "#111", color: "white", textAlign: "center", padding: "10px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
                    View Deal
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
