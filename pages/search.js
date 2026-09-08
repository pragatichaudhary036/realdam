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
        let list = data.products || data.results || [];
        setProducts(list);
        setLoading(false);
      })
     .catch(() => setLoading(false));
  }, [q]);

  let sorted = [...products];
  if (sortBy === "price_low") sorted.sort((a, b) => a.totalPrice - b.totalPrice);
  if (sortBy === "price_high") sorted.sort((a, b) => b.totalPrice - a.totalPrice);

  return (
    <div style={{ padding: "16px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "18px" }}>Results for "{q}" - {sorted.length} items</h2>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpenSort(!openSort)}
            style={{ padding: "8px 12px", border: "1px solid #ccc", background: "white", borderRadius: "6px" }}
          >
            Sort by: {sortBy === "relevance"? "Relevance" : sortBy === "price_low"? "Price Low" : "Price High"} ▼
          </button>
          {openSort && (
            <div style={{ position: "absolute", top: "36px", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "6px", zIndex: 10, width: "160px" }}>
              <div onClick={() => { setSortBy("relevance"); setOpenSort(false); }} style={{ padding: "10px", cursor: "pointer" }}>Relevance</div>
              <div onClick={() => { setSortBy("price_low"); setOpenSort(false); }} style={{ padding: "10px", cursor: "pointer" }}>Price: Low to High</div>
              <div onClick={() => { setSortBy("price_high"); setOpenSort(false); }} style={{ padding: "10px", cursor: "pointer" }}>Price: High to Low</div>
            </div>
          )}
        </div>
      </div>

      {loading? <p style={{ marginTop: "20px" }}>Loading...</p> : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginTop: "16px" }}>
        {sorted.map((p, i) => (
          <a key={i} href={p.product_link} target="_blank" rel="noopener noreferrer" style={{ background: "white", borderRadius: "10px", padding: "10px", textDecoration: "none", color: "black", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
            <img src={p.image || p.thumbnail} alt={p.title} style={{ width: "100%", height: "140px", objectFit: "contain"
