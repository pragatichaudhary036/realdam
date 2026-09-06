import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", flexDirection: "column", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>RealDAM</div>
        <div style={{ fontSize: "12px", background: "#111", color: "#fff", padding: "6px 12px", borderRadius: "20px" }}>TRUE Price Engine</div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", marginTop: "-80px" }}>
        
        <h1 style={{ fontSize: "56px", fontWeight: 800, margin: "0", letterSpacing: "-2px", textAlign: "center" }}>
          Real<span style={{ color: "#6366f1" }}>DAM</span>
        </h1>
        
        <p style={{ marginTop: "12px", fontSize: "18px", color: "#111", fontWeight: 500, letterSpacing: "-0.3px", textAlign: "center" }}>
          The <span style={{ background: "#111", color: "white", padding: "2px 8px", borderRadius: "6px" }}>TRUE</span> Final Price
        </p>
        <p style={{ marginTop: "8px", color: "#666", fontSize: "14px", textAlign: "center", maxWidth: "400px" }}>
          No hidden charges. No fake discounts. Just real comparison & research.
        </p>

        {/* Search Box */}
        <form onSubmit={search} style={{ marginTop: "32px", display: "flex", gap: "10px", width: "100%", maxWidth: "480px", background: "white", padding: "8px", borderRadius: "14px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search product, e.g. baby shoes"
            style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", padding: "10px 14px", borderRadius: "10px" }}
          />
          <button type="submit" style={{ background: "#111", color: "white", border: "none", padding: "12px 22px", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
            Search
          </button>
        </form>

        {/* Features */}
        <div style={{ marginTop: "40px", display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#333" }}>
            <span style={{ width: "28px", height: "28px", background: "#e0e7ff", color: "#4f46e5", borderRadius: "8px", display: "grid", placeItems: "center" }}>✓</span> REAL COMPARISON
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#333" }}>
            <span style={{ width: "28px", height: "28px", background: "#dcfce7", color: "#16a34a", borderRadius: "8px", display: "grid", placeItems: "center" }}>✓</span> DEEP RESEARCH
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#333" }}>
            <span style={{ width: "28px", height: "28px", background: "#fef3c7", color: "#d97706", borderRadius: "8px", display: "grid", placeItems: "center" }}>₹</span> TRUE FINAL PRICE
          </div>
        </div>
      </main>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: "12px", color: "#999" }}>
        © 2026 RealDAM — Built for smart shoppers
      </footer>
    </div>
  );
}
