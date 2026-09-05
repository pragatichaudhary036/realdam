export default function Logo({size=40}){
 return(
  <div style={{display:'flex',alignItems:'center',gap:'8px',fontWeight:900,fontSize:size*0.5}}>
   <div style={{width:size,height:size,background:'linear-gradient(135deg,#0ea5e9,#22c55e)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>₹</div>
   <span>RealDAM</span>
  </div>
 )
}
