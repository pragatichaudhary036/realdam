import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const search = () => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Top Bar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "42px", height: "42px", background: "#0f172a", borderRadius: "12px", display: "grid", placeItems: "center", position: "relative" }}>
            <span style={{ fontSize: "20px" }}>🛍️</span>
            <span style={{ position: "absolute", right: "-6px", top: "-6px", background: "#2563eb", color: "white", fontSize: "10px", fontWeight: 800, width: "18px", height: "18px", borderRadius: "50%", display: "grid", placeItems: "center" }}>⇄</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: "20px", letterSpacing: "-0.5px", color: "#0f172a" }}>RealDAM</span>
        </div>
        <div style={{ fontSize: "12px", color: "#64748b", background: "#f1f5f9", padding: "6px 12px", borderRadius: "20px" }}>
          TRUE Price Finder
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: "800px", margin: "40px auto 0", padding: "0 20px", textAlign: "center" }}>
        {/* Logo Big */}
        <div style={{ margin: "0 auto 18px", width: "72px", height: "72px", background: "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)", borderRadius: "20px", display: "grid", placeItems: "center", boxShadow: "0 12px 30px rgba(37,99,235,0.25)" }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: "36px" }}>🛍️</span>
            <span style={{ position: "absolute", right: "-10px", bottom: "-2px", background: "white", color: "#2563eb", fontSize: "14px", fontWeight: 900, width: "22px", height: "22px", borderRadius: "50%", display: "grid", placeItems: "center", border: "2px solid #2563eb" }}>⇄</span>
          </div>
        </div>

        <h1 style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-1.5px", color: "#0f172a", margin: "0 0 10px", lineHeight: 1.1 }}>
          Real<span style={{ color: "#2563eb" }}>DAM</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#475569", margin: "0 0 28px", fontWeight: 500 }}>
          Sabse Sasta Nahi, <span style={{ color: "#0f172a", fontWeight: 700 }}>TRUE Final Price</span> Dikhate Hai
        </p>

        {/* Search Bar */}
        <div style={{ background: "white", border: "2px solid #e2e8f0", borderRadius: "16px", padding: "6px", display: "flex", alignItems: "center", boxShadow: "0 8px 30px rgba(15,23,42,0.06)", maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ paddingLeft: "14px", color: "#94a3b8" }}>🔍</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Product search karo - iPhone, Shoes, Watch..."
            style={{ flex: 1, border: "none", outline: "none", padding: "14px 12px", fontSize: "15px", color: "#0f172a" }}
          />
          <button
            onClick={search}
            style={{ background: "#2563eb", color: "white", border: "none", padding: "12px 22px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          >
            Search
          </button>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginTop: "18px" }}>
          {["iPhone 15", "Nike Shoes", "Smart Watch", "Headphones"].map((t) => (
            <button key={t} onClick={() => router.push(`/search?q=${t}`)} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", color: "#334155", cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Features - Blue Black White */}
      <div style={{ maxWidth: "1000px", margin: "60px auto 0", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ background: "#0f172a", color: "white", borderRadius: "16px", padding: "20px" }}>
          <div style={{ fontSize: "22px", marginBottom: "8px" }}>⚡</div>
          <div style={{ fontWeight: 700, fontSize: "14px" }}>Instant TRUE Price</div>
          <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>No extra charges, final checkout price</div>
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "16px", padding: "20px" }}>
          <div style={{ fontSize: "22px", marginBottom: "8px" }}>🔍</div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e3a8a" }}>30-Day Cache</div>
          <div style={{ fontSize: "12px", color: "#3b82f6", marginTop: "4px" }}>1 search = 30 days saved</div>
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
          <div style={{ fontSize: "22px", marginBottom: "8px" }}>🛡️</div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>No Fake Discount</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Real deal, not inflated MRP</div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: "12px" }}>© 2025 RealDAM • Blue • Black • White</div>
    </div>
  );
}
