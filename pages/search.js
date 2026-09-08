import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${q}`)
     .then(r => r.json())
     .then(d => {
        setProducts(d.products || d.results || []);
        setLoading(false);
      });
  }, [q]);

  return (
    <div style={{ padding: 16 }}>
      <h3>Results for {q} - {products.length}</h3>
      {loading && <p>Loading...</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {products.map((p, i) => (
          <a key={i} href={p.product_link} target="_blank" style={{ border: "1px solid #ddd", padding: 8, textDecoration: "none", color: "#000" }}>
            <img src={p.image} alt="" style={{ width: "100%", height: 120, objectFit: "contain" }} />
            <div>{p.title?.slice(0, 40)}</div>
            <div style={{ fontWeight: "bold" }}>Rs {p.totalPrice || p.price}</div>
            <div>{p.source}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
