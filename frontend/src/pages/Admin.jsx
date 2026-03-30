import Sidebar from '../components/Sidebar'

export default function Admin({ role, setIsLoggedIn, setCurrentView, setRole }) {
  return (
    <div className="app-layout">
      <Sidebar active="admin" role={role} setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} setRole={setRole} />
      <div className="main-area" style={{background:'#f8fafc', color:'#0f172a', overflowY:'auto'}}>
        <div className="dash-content" style={{gap:'20px', maxWidth:'600px', margin:'0 auto', padding:'20px', display:'flex', flexDirection:'column'}}>
           
           <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
              <div style={{fontSize:'10px', fontWeight:'700', letterSpacing:'1px', color:'#3b82f6', marginBottom:'10px'}}>TOTAL ECOSYSTEM PAYOUT AMOUNT</div>
              <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px'}}>
                 <h1 style={{fontSize:'48px', margin:0, color:'#0f172a'}}>₹1300</h1>
                 <span style={{background:'#eff6ff', color:'#3b82f6', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>↗ 12.4%</span>
              </div>
              <h1 style={{fontSize:'36px', margin:'0 0 30px 0', color:'#94a3b8'}}>Cr</h1>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>24H PAYOUTS</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>₹42.8 Cr</div>
                 </div>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>ACTIVE WORKERS</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>1,842</div>
                 </div>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>AVG. CLAIM TIME</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>1.4s</div>
                 </div>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>SYSTEM UPTIME</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>99.2%</div>
                 </div>
              </div>
           </div>

           <div className="hover-card" style={{background:'#021676', borderRadius:'24px', padding:'30px', color:'white', position:'relative', overflow:'hidden'}}>
              <div style={{position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize:'20px 20px', opacity:0.3}}></div>
              <div style={{fontSize:'10px', fontWeight:'700', letterSpacing:'1px', color:'rgba(255,255,255,0.6)', marginBottom:'5px', position:'relative'}}>NETWORK HEALTH</div>
              <h2 style={{fontSize:'28px', margin:'0 0 40px 0', position:'relative'}}>Optimal</h2>
              
              <div style={{display:'flex', justifyContent:'center', marginBottom:'40px', position:'relative'}}>
                 <div style={{width:'100px', height:'100px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                    <div style={{width:'70px', height:'70px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                       <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                 </div>
              </div>
              
              <button style={{width:'100%', padding:'15px', background:'white', color:'#021676', border:'none', borderRadius:'12px', fontWeight:'700', cursor:'pointer', position:'relative'}}>Generate Report</button>
           </div>

           <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                 <div>
                    <h3 style={{margin:'0 0 5px 0', color:'#0f172a', fontSize:'18px'}}>Fraud Detection Radar</h3>
                    <p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Real-time threat vector analysis</p>
                 </div>
                 <div style={{color:'#ef4444', fontSize:'24px'}}>⊗</div>
              </div>
              
              <div style={{height:'200px', border:'1px solid #e2e8f0', borderRadius:'50%', position:'relative', margin:'0 auto', width:'200px', marginBottom:'30px'}}>
                 <div style={{position:'absolute', top:'50%', width:'100%', height:'1px', background:'#e2e8f0'}}></div>
                 <div style={{position:'absolute', left:'50%', height:'100%', width:'1px', background:'#e2e8f0'}}></div>
                 <div style={{position:'absolute', top:'25%', left:'25%', width:'50%', height:'50%', borderRadius:'50%', border:'1px solid #e2e8f0'}}></div>
                 <div style={{position:'absolute', top:'30%', left:'30%', width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', boxShadow:'0 0 10px #ef4444'}}></div>
                 <div style={{position:'absolute', top:'60%', left:'70%', width:'6px', height:'6px', background:'#fca5a5', borderRadius:'50%'}}></div>
                 <div style={{position:'absolute', top:'45%', left:'80%', width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', boxShadow:'0 0 10px #ef4444'}}></div>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', textAlign:'center'}}>
                 <div><div style={{fontSize:'20px', fontWeight:'800', color:'#0f172a'}}>14</div><div style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8'}}>BLOCKED</div></div>
                 <div><div style={{fontSize:'20px', fontWeight:'800', color:'#0f172a'}}>03</div><div style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8'}}>ESCALATED</div></div>
                 <div><div style={{fontSize:'20px', fontWeight:'800', color:'#0f172a'}}>99.8%</div><div style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8'}}>PRECISION</div></div>
              </div>
           </div>

           <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px'}}>
                 <div>
                    <h3 style={{margin:'0 0 5px 0', color:'#0f172a', fontSize:'18px'}}>Regional Claims<br/>Density</h3>
                    <p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Claim volume by city</p>
                 </div>
                 <div style={{color:'#021676', fontSize:'24px'}}>🌍</div>
              </div>
              <div style={{background:'linear-gradient(to bottom, #4b5563, #1f2937)', height:'200px', borderRadius:'16px', position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end', padding:'15px'}}>
                 <div style={{position:'absolute', top:'20%', left:'20%', width:'20%', height:'20%', background:'rgba(255,255,255,0.1)', borderRadius:'50%'}}></div>
                 <div style={{position:'absolute', top:'50%', right:'30%', width:'30%', height:'30%', background:'rgba(255,255,255,0.05)', borderRadius:'50%'}}></div>
                 <div style={{background:'rgba(255,255,255,0.9)', padding:'10px 15px', borderRadius:'8px', backdropFilter:'blur(5px)'}}>
                    <div style={{fontSize:'9px', fontWeight:'700', color:'#3b82f6', marginBottom:'2px'}}>PEAK REGION</div>
                    <div style={{fontSize:'12px', fontWeight:'700', color:'#0f172a'}}>Hyderabad South</div>
                 </div>
              </div>
           </div>

           <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                  <h3 style={{margin:0, color:'#0f172a', fontSize:'18px'}}>Command<br/>Live Stream</h3>
                  <div style={{display:'flex', gap:'5px'}}>
                     <button style={{padding:'6px 12px', background:'#f1f5f9', border:'none', borderRadius:'20px', fontSize:'11px', fontWeight:'600', color:'#0f172a'}}>All Events</button>
                     <button style={{padding:'6px 12px', background:'#f1f5f9', border:'none', borderRadius:'20px', fontSize:'11px', fontWeight:'600', color:'#0f172a'}}>High Risk</button>
                  </div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'15px', paddingBottom:'10px', borderBottom:'1px solid #f1f5f9'}}>
                  <span>TIMESTAMP</span>
                  <span>WORKER ID</span>
               </div>
               
               <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:22:01.04</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0021</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:21:58.12</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0442</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:21:45.92</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0919</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:21:32.44</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0002</span>
                  </div>
               </div>
           </div>

           <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)', marginTop:'20px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <h3 style={{margin:0, color:'#0f172a', fontSize:'18px'}}>Anti-Spoofing & Fraud Review Queue</h3>
                  <div style={{background:'#fef2f2', color:'#ef4444', padding:'6px 12px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px'}}>2 PENDING REVIEW</div>
               </div>
               
               <p style={{fontSize:'12px', color:'#64748b', marginBottom:'25px'}}>Section 15.3.7: Claims flagged by the AI Anti-Spoofing engine (GPS mismatch, device anomalies) require manual human arbitration before PAYOUT AMOUNT release.</p>
               
               <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'20px'}}>
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#0f172a'}}>CLAIM: CLM-A992-TX</span>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#ef4444'}}>FRAUD SCORE: 94%</span>
                     </div>
                     <div style={{fontSize:'12px', color:'#64748b', marginBottom:'15px'}}>
                        <strong>Flag Reason:</strong> Speed velocity anomaly (120km/h) across high-traffic delivery block during rainfall. GPS Spoofing highly probable.
                     </div>
                     <div style={{display:'flex', gap:'10px'}}>
                        <button style={{flex:1, padding:'10px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Reject Claim</button>
                        <button style={{flex:1, padding:'10px', background:'white', color:'#0f172a', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Approve (Override AI)</button>
                     </div>
                  </div>
                  
                  <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'20px'}}>
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#0f172a'}}>CLAIM: CLM-B411-RQ</span>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#f59e0b'}}>FRAUD SCORE: 76%</span>
                     </div>
                     <div style={{fontSize:'12px', color:'#64748b', marginBottom:'15px'}}>
                        <strong>Flag Reason:</strong> Worker filed two claims in consecutive hours in separate zones (Zone A to Zone C impossible teleportation metrics).
                     </div>
                     <div style={{display:'flex', gap:'10px'}}>
                        <button style={{flex:1, padding:'10px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Reject Claim</button>
                        <button style={{flex:1, padding:'10px', background:'white', color:'#0f172a', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Approve (Override AI)</button>
                     </div>
                  </div>
               </div>
           </div>
           
        </div>
      </div>
    </div>
  )
}
