import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!q) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${q}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  const cheapest = results[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header - Blue Black White */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-black tracking-tight">RealDAM</h1>
          <p className="text-blue-200 text-xs mt-1 tracking-[0.3em]">TRUE PRICE FINDER</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 -mt-6">
        {/* Search Box - White */}
        <div className="bg-white shadow-xl shadow-blue-900/10 rounded-2xl p-3 flex gap-2 border border-slate-100">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search T-shirt, iPhone, Shoes..." className="flex-1 bg-slate-50 border-0 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
          <button onClick={search} className="bg-[#0f172a] hover:bg-black text-white px-7 rounded-xl font-bold text-sm transition">Search</button>
        </div>

        {loading && <p className="text-center mt-8 text-blue-600 animate-pulse font-bold">Finding best prices...</p>}

        {cheapest && (
          <div className="bg-white border border-blue-100 rounded-[24px] p-4 mt-6 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-br-xl tracking-widest">CHEAPEST</div>
            <div className="flex gap-4 mt-6">
              <img src={cheapest.thumbnail} className="w-24 h-24 object-contain bg-slate-50 rounded-xl p-1 border" />
              <div className="flex-1">
                <p className="font-bold text-[14px] leading-tight line-clamp-2">{cheapest.title}</p>
                <p className="text-2xl font-black text-[#0f172a] mt-1">{cheapest.price_str}</p>
                <div className="flex items-center gap-2 mt-2 bg-blue-50 w-fit px-2.5 py-1 rounded-full border border-blue-100">
                  <img src={cheapest.logo} className="w-4 h-4 rounded-full bg-white" />
                  <p className="text-[11px] font-bold text-blue-700">{cheapest.source} ✓ Verified</p>
                </div>
              </div>
            </div>
            <a href={cheapest.product_link} target="_blank" className="block bg-[#1e3a8a] hover:bg-[#0f172a] text-white text-center mt-4 py-3.5 rounded-xl font-bold text-sm transition">Buy on {cheapest.source} →</a>
          </div>
        )}

        <div className="mt-6 grid gap-2">
          {results.slice(1).map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex gap-3 border border-slate-100 hover:border-blue-200 transition">
              <img src={item.thumbnail} className="w-16 h-16 object-contain bg-slate-50 rounded-lg" />
              <div className="flex-1">
                <p className="text-[13px] font-medium line-clamp-2 leading-tight">{item.title}</p>
                <p className="font-black text-[#0f172a] mt-1">{item.price_str}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <img src={item.logo} className="w-3.5 h-3.5 rounded-full" />
                  <p className="text-[11px] text-slate-500 font-medium">{item.source}</p>
                </div>
              </div>
              <a href={item.product_link} target="_blank" className="text-[11px] bg-[#0f172a] text-white px-4 py-2 rounded-full h-fit font-bold">View</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
