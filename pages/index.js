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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-1">RealDAM</h1>
        <p className="text-center text-xs mb-4">TRUE Price Finder</p>

        <div className="flex gap-2 mb-6">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search T-shirt, iPhone..." className="flex-1 border p-3 rounded-xl" />
          <button onClick={search} className="bg-black text-white px-6 rounded-xl">Search</button>
        </div>

        {loading && <p className="text-center">Searching...</p>}

        {cheapest && (
          <div className="bg-white border-2 border-green-500 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-green-600">CHEAPEST</p>
            <div className="flex gap-3 mt-2">
              <img src={cheapest.thumbnail} className="w-20 h-20 object-contain" />
              <div className="flex-1">
                <p className="font-bold text-sm">{cheapest.title}</p>
                <p className="text-lg font-bold">{cheapest.price_str}</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={cheapest.logo} className="w-5 h-5 rounded-full" />
                  <p className="text-xs">{cheapest.source} ✓</p>
                </div>
              </div>
            </div>
            <a href={cheapest.product_link} target="_blank" className="block bg-black text-white text-center mt-3 py-3 rounded-xl">Buy on {cheapest.source} →</a>
          </div>
        )}

        {results.slice(1).map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-3 mb-2 flex gap-3 border">
            <img src={item.thumbnail} className="w-16 h-16 object-contain" />
            <div className="flex-1">
              <p className="text-sm line-clamp-2">{item.title}</p>
              <p className="font-bold">{item.price_str}</p>
              <div className="flex items-center gap-1">
                <img src={item.logo} className="w-4 h-4 rounded-full" />
                <p className="text-xs text-gray-500">{item.source}</p>
              </div>
            </div>
            <a href={item.product_link} target="_blank" className="text-xs bg-gray-100 px-3 py-2 rounded-lg h-fit">View</a>
          </div>
        ))}
      </div>
    </div>
  );
}
