import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    if (q) setInput(q);
    if (!q) return;
    const fetchData = async () => {
      setLoading(true);
      setResults([]);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    };
    fetchData();
  }, [q]);

  const doSearch = () => {
    if (!input.trim()) return;
    router.push(`/search?q=${encodeURIComponent(input)}`);
  };

  const sorted = [...results].sort((a,b)=>{
    if(sortBy==="low") return a.price - b.price;
    if(sortBy==="high") return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0E152A', fontFamily: 'system-ui, sans-serif', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, background: '#0E152A', zIndex: 10 }}>
        <div style={{ width: '38px', height: '38px', background: '#131E36', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <b style={{ fontSize: '26px', color: 'white', fontWeight: '800' }}>R<span style={{ color: '#2F6BFF' }}>-DAM</span></b>
        </div>
      </div>

      {/* Search Bar like screenshot */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '5px 12px' }}>
          <span style={{ paddingLeft: '12px', fontSize: '18px' }}>🔍</span>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && doSearch()} placeholder="Search products..." style={{ flex: 1, border: 'none', outline: 'none', padding: '10px', fontSize: '15px' }} />
          <span style={{ paddingRight: '12px', fontSize: '18px', cursor: 'pointer' }} onClick={doSearch}>➡️</span>
        </div>
      </div>

      {/* Sort by - exact like screenshot */}
      <div style={{ padding: '10px 16px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button onClick={()=>setOpenSort(!openSort)} style={{ background: 'transparent', border: '1px solid #2A3A5A', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '13px' }}>
            Sort by: {sortBy === 'relevance'? 'Relevance' : sortBy === 'low'? 'Low to High' : 'High to Low'} <span style={{ marginLeft: '6px' }}>▼</span>
          </button>
          {openSort && (
            <div style={{ position: 'absolute', top: '36px', left
