import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('Nail extension');
  const [products, setProducts] = useState([
    { title: "Ecilak Full Cover Artificial Nails Set , Acrylic Nails Set, Nail", price: 95, platform: "Flipkart", image: "https://via.placeholder.com/80", link: "https://www.flipkart.com/search?q=nail+extension" },
    { title: "Bellahugzs Long Almond Glossy Nail Extensions With Free Glue Kit", price: 163, platform: "Flipkart", image: "https://via.placeholder.com/80", link: "https://www.flipkart.com/search?q=nail+extension" },
    { title: "SRJS Press On Nails for Women & Girls, Sets Reusable False Nail E", price: 165, platform: "Amazon.in", image: "https://via.placeholder.com/80", link: "https://www.amazon.in/s?k=nail+extension" },
    { title: "Glameurgirl Nail Extension Multicolor", price: 175, platform: "Flipkart", image: "https://via.placeholder.com/80", link: "https://www.flipkart.com/search?q=nail+extension" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if(e) e.preventDefault();
    if(!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      let final = data.products || data.results || data || [];
      if(Array.isArray(final) && final.length > 0){
        setProducts(final);
      }
    } catch(err){
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div style={{background:'white', minHeight:'100vh', fontFamily:'Inter, sans-serif'}}>
      {/* Header */}
      <div style={{padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:'38px', height:'38px', background:'#0a0a23', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>🛍️</div>
          <span style={{fontWeight:'800', fontSize:'20px', color:'#111'}}>RealDAM</span>
        </div>
        <span style={{background:'#f3f4f6', color:'#6b7280', padding:'6px 14px', borderRadius:'20px', fontSize:'12px'}}>TRUE Price</span>
      </div>

     
