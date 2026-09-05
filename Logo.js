export default function Logo({size=48}){
 return(
  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
   <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="60" width="15" height="30" rx="3" fill="#0ea5e9"/>
    <rect x="32" y="40" width="15" height="50" rx="3" fill="#22c55e"/>
    <rect x="54" y="20" width="15" height="70" rx="3" fill="#0ea5e9"/>
   </svg>
   <div style={{lineHeight:'0.9'}}>
    <div style={{fontSize:size*0.6,fontWeight:900}}>real<span style={{color:'#0ea5e9'}}>dam</span></div>
    <div style={{fontSize:size*0.22,letterSpacing:'3px',color:'#64748b'}}>THE TRUE FINAL PRICE</div>
   </div>
  </div>
 )
}
