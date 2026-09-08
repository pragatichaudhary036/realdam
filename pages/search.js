import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || data.results || []);
        setLoading(false);
      });
  }, [q]);

  let sorted = [...products];
  if (sortBy === "price_low") sorted.sort((a, b) => a.totalPrice - b.totalPrice);
  if (sortBy === "price_high") sorted.sort((a, b) => b.totalPrice - a.totalPrice);

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh", padding: "16px", fontFamily: "Inter, sans-serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>
          Results for "{q}" - {sorted.length} items
        </h2>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpenSort(!openSort)}
            style={{ background: "#fff", border: "1px solid #ddd", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
          >
            Sort: {sortBy === "relevance" ? "Relevance" : sortBy === "price_low" ? "Low to High" : "High to Low"} ▼
          </button>
          {openSort && (
            <div style={{ position: "absolute", right: 0, top: 38, background: "#fff", border: "1px solid #ddd", borderRadius: 8, width: 170, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10 }}>
              <div onClick={() => { setSortBy("relevance"); setOpenSort(false); }} style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}>Relevance</div>
              <div onClick={() => { setSortBy("price_low"); setOpenSort(false); }} style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}>Price: Low to High</div>
              <div onClick={() => { setSortBy("price_high"); setOpenSort(false); }} style={{ padding: 10, cursor: "pointer" }}>Price: High to Low</div>
            </div>
          )}
        </div>
      </div>

      {loading && <p style={{ color: "#666" }}>Loading...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
        {sorted.map((p, i) => (
          <a key={i} href={p.product_link} target="_blank" rel="noreferrer" style={{ background: "#fff", borderRadius: 12, padding: 10, textDecoration: "none", color: "#000", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
            <img src={p.image || p.thumbnail} style={{ width: "100%", height: 140, objectFit: "contain", borderRadius: 8, background: "#fafafa" }} alt="" />
            <div style={{ fontSize: 13, marginTop: 8, height: 38, overflow: "hidden", lineHeight: "18px" }}>{p.title}</div>
            
            <div style={{ marginTop: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>₹{p.totalPrice}</span>
              {p.deliveryCharge > 0 && <span style={{ fontSize: 11, color: "#666", marginLeft: 6 }}>incl. delivery</span>}
            </div>

            <div style={{ fontSize: 11, color: "#888", textDecoration: p.deliveryCharge > 0 ? "line-through" : "none" }}>
              Price: ₹{p.price}
            </div>

            {p.isFreeDelivery ? (
              <div style={{ fontSize: 11, color: "#0a9e00", fontWeight: 600, marginTop: 4 }}>✓ Free Delivery</div>
            ) : (
              <div style={{ fontSize: 11, color: p.deliveryCharge > 0 ? "#d00" : "#666", marginTop: 4 }}>
                {p.deliveryCharge > 0 ? `+ ₹${p.deliveryCharge} Delivery` : "Delivery: Free above ₹500"}
              </div>
            )}

            <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{p.source}</div>
            <div style={{ marginTop: "auto", background: "#0f172a", color: "#fff", textAlign: "center", padding: "7px", borderRadius: 8, fontSize: 12, fontWeight: 600, marginTopTop: 10, marginTop: 10 }}>View on {p.source}</div>
