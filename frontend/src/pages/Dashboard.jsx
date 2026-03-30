import BottomNav from '../components/BottomNav'

export default function Dashboard({ coords, userName, claimHistory, subscription, setCurrentView, setIsLoggedIn, setRole, results, loadingRisk, handleCheckRisk, handleZeroTouchOracle, oracleStatus, setOracleStatus, honorScore = 100 }) {
  const scoreColor = honorScore >= 75 ? '#22c55e' : honorScore >= 50 ? '#f59e0b' : '#ef4444';
  const scoreLabel = honorScore >= 75 ? 'Excellent' : honorScore >= 50 ? 'Fair' : 'At Risk';
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (honorScore / 100) * circumference;
  return (
    <div style={{background:'linear-gradient(180deg, #f0f4f8 0%, #f8fafc 100%)', minHeight:'100vh', padding:'30px 40px 120px 40px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
         <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
               <div style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
                  <span style={{background:'#021676', color:'white', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', fontSize:'12px'}}>⊞</span>
               </div>
               <div>
                  <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>YOUR DASHBOARD</div>
                  <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Welcome back, {userName || 'Worker'}</div>
               </div>
            </div>
            <div onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }} style={{padding:'8px 16px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'14px', fontWeight:'700', color:'#ef4444', gap:'8px'}}>
               Logout 🚪
            </div>
         </header>

         {/* === TWO-COLUMN DESKTOP GRID === */}
         <div className="dash-desktop-grid" style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:'25px', alignItems:'start'}}>

            {/* LEFT COLUMN — Main Content */}
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

               {/* Location Map */}
               <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'25px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                     <div style={{fontSize:'12px', fontWeight:'800', letterSpacing:'1px', color:'#64748b'}}>CURRENT LOCATION</div>
                     <div style={{fontSize:'12px', fontWeight:'800', color:'#021676', background:'#eff6ff', padding:'6px 12px', borderRadius:'10px'}}>{coords && coords.lat ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : 'Scanning...'}</div>
                  </div>
                  
                  <div style={{height:'200px', background:'linear-gradient(145deg, #f8fafc, #f1f5f9)', borderRadius:'20px', border:'1px solid #e2e8f0', position:'relative', overflow:'hidden', backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%23e2e8f0\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\'/%3E%3C/svg%3E")'}}>
                     <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'120px', height:'120px', background:'rgba(59, 130, 246, 0.1)', borderRadius:'50%', animation:'pulse 2s infinite'}}></div>
                     <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'16px', height:'16px', background:'#3b82f6', borderRadius:'50%', border:'4px solid white', boxShadow:'0 0 20px rgba(59, 130, 246, 0.8)'}}></div>
                     <div style={{position:'absolute', bottom:'15px', right:'15px', background:'white', padding:'8px 12px', borderRadius:'12px', fontSize:'10px', fontWeight:'800', color:'#0f172a', border:'1px solid #e2e8f0', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                        {results?.telemetry?.city || 'Locating User'}
                     </div>
                     <div style={{position:'absolute', top:'15px', left:'15px', background:'white', padding:'10px 14px', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 5px 15px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', gap:'5px'}}>
                        <span style={{fontSize:'9px', fontWeight:'700', color:'#64748b', textTransform:'uppercase'}}>Scans Live Weather & Traffic Data</span>
                        <button className="btn-primary" style={{padding:'6px 12px', fontSize:'10px', width:'100%'}} onClick={handleCheckRisk}>{loadingRisk ? 'Scanning...' : 'Refresh Risk Score'}</button>
                     </div>
                  </div>
                  
                  {results.riskScore && (
                    <div style={{marginTop:'20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
                       <div style={{background:'#f8fafc', padding:'12px', borderRadius:'14px', border:'1px solid #e2e8f0', textAlign:'center'}}>
                          <div style={{fontSize:'10px', fontWeight:'700', color:'#64748b', marginBottom:'4px'}}>AI Risk</div>
                          <div style={{fontSize:'16px', fontWeight:'900', color:'#ef4444'}}>{results.riskScore}</div>
                       </div>
                       <div style={{background:'#f8fafc', padding:'12px', borderRadius:'14px', border:'1px solid #e2e8f0', textAlign:'center'}}>
                          <div style={{fontSize:'10px', fontWeight:'700', color:'#64748b', marginBottom:'4px'}}>Premium</div>
                          <div style={{fontSize:'16px', fontWeight:'900', color:'#021676'}}>{results.weeklyPremium}</div>
                       </div>
                       <div style={{background:'#f8fafc', padding:'12px', borderRadius:'14px', border:'1px solid #e2e8f0', textAlign:'center'}}>
                          <div style={{fontSize:'10px', fontWeight:'700', color:'#64748b', marginBottom:'4px'}}>Status</div>
                          <div style={{fontSize:'16px', fontWeight:'900', color:'#22c55e'}}>{results.claimStatus}</div>
                       </div>
                    </div>
                  )}
               </div>

               {/* Live Weather & Traffic Data */}
               <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'30px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
                  <h3 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 20px 0'}}>Live Weather & Traffic Data</h3>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                           <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>💧</div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Rainfall</div>
                        </div>
                        <div style={{fontSize:'15px', fontWeight:'800', color:'#3b82f6'}}>{results?.telemetry?.rain || '0 mm'}</div>
                     </div>
                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                           <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>🚗</div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Traffic</div>
                        </div>
                        <div style={{fontSize:'15px', fontWeight:'800', color:'#f59e0b'}}>{results?.telemetry?.traffic || 'Normal'}</div>
                     </div>
                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                           <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>🧠</div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Risk Level</div>
                        </div>
                        <div style={{fontSize:'15px', fontWeight:'800', color: results?.riskScore === 'High' ? '#ef4444' : results?.riskScore === 'Medium' ? '#f59e0b' : '#22c55e'}}>{results?.riskScore || 'Low Risk'}</div>
                     </div>
                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                           <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>📊</div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Confidence</div>
                        </div>
                        <div style={{fontSize:'15px', fontWeight:'800', color:'#10b981'}}>96.4%</div>
                     </div>
                  </div>
               </div>

               {/* Zero-Touch Auto-Claim */}
               <div className="hover-card" style={{background:'linear-gradient(135deg, #021676 0%, #0624a6 100%)', borderRadius:'32px', padding:'30px', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 40px rgba(2, 22, 118, 0.2)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                     <h3 style={{fontSize:'18px', fontWeight:'800', color:'white', margin:0}}>Zero-Touch Auto-Claim</h3>
                     <div style={{fontSize:'10px', background:'rgba(59,130,246,0.2)', color:'#60a5fa', padding:'4px 8px', borderRadius:'10px', fontWeight:'800', letterSpacing:'1px'}}>LIVE SENSORS: 5</div>
                  </div>
                  <p style={{fontSize:'13px', color:'#94a3b8', margin:'0 0 20px 0', lineHeight:'1.5'}}>
                     Smart Contracts monitor 5 public APIs. When parameters breach the threshold, funds auto-transfer.
                  </p>
                  
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'25px'}}>
                     <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'12px', fontSize:'11px', color:'#cbd5e1', fontWeight:'600', border:'1px solid rgba(255,255,255,0.1)', textAlign:'center'}}>🌧️ Rain</div>
                     <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'12px', fontSize:'11px', color:'#cbd5e1', fontWeight:'600', border:'1px solid rgba(255,255,255,0.1)', textAlign:'center'}}>🔥 Heat</div>
                     <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'12px', fontSize:'11px', color:'#cbd5e1', fontWeight:'600', border:'1px solid rgba(255,255,255,0.1)', textAlign:'center'}}>🏭 AQI</div>
                     <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'12px', fontSize:'11px', color:'#cbd5e1', fontWeight:'600', border:'1px solid rgba(255,255,255,0.1)', textAlign:'center'}}>🚦 Traffic</div>
                     <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'12px', fontSize:'11px', color:'#cbd5e1', fontWeight:'600', border:'1px solid rgba(255,255,255,0.1)', textAlign:'center', gridColumn:'span 2'}}>📉 Demand Drop</div>
                  </div>
                  
                  {oracleStatus === 'scanning' ? (
                      <button style={{width:'100%', padding:'16px', background:'#3b82f6', color:'white', border:'none', borderRadius:'16px', fontSize:'14px', fontWeight:'800', opacity: 0.7}}>📡 Scanning APIs...</button>
                  ) : oracleStatus === 'triggered' ? (
                      <div style={{background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', padding:'15px', borderRadius:'16px', textAlign:'center'}}>
                         <div style={{color:'#10b981', fontWeight:'800', fontSize:'14px', marginBottom:'4px'}}>⚡ Smart Contract Triggered!</div>
                         <div style={{fontSize:'12px', color:'#a7f3d0'}}>Disruption detected natively. Payout routed directly to original payment method.</div>
                         <button onClick={() => setOracleStatus(null)} style={{marginTop:'10px', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'8px', fontSize:'10px', cursor:'pointer'}}>Reset Scanner</button>
                      </div>
                  ) : oracleStatus === 'safe' ? (
                      <div style={{background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', padding:'15px', borderRadius:'16px', textAlign:'center'}}>
                         <div style={{fontSize:'14px', fontWeight:'800', color:'#60a5fa', marginBottom:'5px'}}>✅ System Status: Green</div>
                         <div style={{fontSize:'12px', color:'#93c5fd'}}>No critical disruptions detected across 5 active arrays.</div>
                         <button onClick={() => setOracleStatus(null)} style={{marginTop:'10px', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'8px', fontSize:'10px', cursor:'pointer'}}>Reset Scanner</button>
                      </div>
                  ) : oracleStatus === 'error' ? (
                      <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', padding:'15px', borderRadius:'16px', textAlign:'center'}}>
                         <div style={{fontSize:'14px', fontWeight:'800', color:'#f87171'}}>Connection Refused</div>
                         <button onClick={() => setOracleStatus(null)} style={{marginTop:'10px', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'8px', fontSize:'10px', cursor:'pointer'}}>Reset Scanner</button>
                      </div>
                  ) : (
                      <button 
                        onClick={handleZeroTouchOracle} 
                        disabled={!subscription}
                        style={{width:'100%', padding:'16px', background: subscription ? '#3b82f6' : '#cbd5e1', color:'white', border:'none', borderRadius:'16px', fontSize:'14px', fontWeight:'800', cursor: subscription ? 'pointer' : 'not-allowed', boxShadow: subscription ? '0 10px 20px rgba(59,130,246,0.3)' : 'none'}}
                      >
                        {subscription ? '📡 Force Automated Scan' : 'Purchase Policy First'}
                      </button>
                  )}
               </div>
            </div>

            {/* RIGHT COLUMN — Sidebar */}
            <div style={{display:'flex', flexDirection:'column', gap:'20px', position:'sticky', top:'30px'}}>

               {/* Plan Card */}
               <div className="hover-card" style={{background:'#021676', borderRadius:'24px', padding:'25px', color:'white', boxShadow:'0 15px 30px rgba(2, 22, 118, 0.2)', position:'relative', overflow:'hidden'}}>
                  <div style={{position:'absolute', top:0, right:0, width:'100px', height:'100px', background:'rgba(255,255,255,0.1)', borderRadius:'50%', transform:'translate(30%, -30%)'}}></div>
                  <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'rgba(255,255,255,0.7)', marginBottom:'10px'}}>{subscription ? 'YOUR PLAN' : 'NO ACTIVE PLAN'}</div>
                  {subscription ? (
                    <div>
                      <div style={{fontSize:'28px', fontWeight:'900', letterSpacing:'-1px'}}>{subscription.plan}</div>
                      <div style={{fontSize:'13px', color:'rgba(255,255,255,0.6)', marginTop:'5px'}}>Coverage: ₹{subscription.coverage}</div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'15px', paddingTop:'15px', borderTop:'1px solid rgba(255,255,255,0.15)'}}>
                         <div>
                            <div style={{fontSize:'9px', fontWeight:'700', color:'rgba(255,255,255,0.5)', letterSpacing:'1px'}}>STATUS</div>
                            <div style={{fontSize:'13px', fontWeight:'800', color:'#4ade80', display:'flex', alignItems:'center', gap:'6px', marginTop:'3px'}}><div style={{width:'8px', height:'8px', background:'#4ade80', borderRadius:'50%', boxShadow:'0 0 8px #4ade80'}}></div> ACTIVE</div>
                         </div>
                         <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'9px', fontWeight:'700', color:'rgba(255,255,255,0.5)', letterSpacing:'1px'}}>EXPIRES</div>
                            <div style={{fontSize:'13px', fontWeight:'800', color:'rgba(255,255,255,0.8)', marginTop:'3px'}}>{subscription.expiry}</div>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{cursor:'pointer'}} onClick={() => setCurrentView('plans')}>
                      <div style={{fontSize:'18px', fontWeight:'800'}}>Buy a Plan</div>
                      <div style={{fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'5px'}}>Starting at ₹40/week →</div>
                    </div>
                  )}
               </div>

               {/* Honor Score Widget */}
               <div className="hover-card" style={{background:'white', borderRadius:'28px', padding:'25px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)', textAlign:'center'}}>
                  <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#64748b', marginBottom:'15px'}}>HONOR SCORE</div>
                  <div style={{position:'relative', width:'130px', height:'130px', margin:'0 auto 15px auto'}}>
                     <svg width="130" height="130" viewBox="0 0 130 130" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="65" cy="65" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                        <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
                           strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                           style={{transition:'stroke-dashoffset 1s ease, stroke 0.5s ease'}} />
                     </svg>
                     <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}>
                        <div style={{fontSize:'32px', fontWeight:'900', color:'#0f172a', lineHeight:1}}>{honorScore}</div>
                        <div style={{fontSize:'9px', fontWeight:'800', color:scoreColor, letterSpacing:'1px', marginTop:'4px'}}>{scoreLabel.toUpperCase()}</div>
                     </div>
                  </div>
                  <div style={{fontSize:'14px', fontWeight:'800', color:'#0f172a', marginBottom:'6px'}}>Worker Reputation</div>
                  <p style={{fontSize:'11px', color:'#94a3b8', lineHeight:'1.5', margin:0}}>Honest claims raise your score. False claims or spoofing lower it.</p>
                  {honorScore < 50 && (
                     <div style={{marginTop:'10px', padding:'8px 12px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', fontSize:'11px', fontWeight:'700', color:'#dc2626'}}>⚠️ Low score may restrict claims</div>
                  )}
               </div>

               {/* Quick Actions */}
               <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'20px', border:'1px solid #f1f5f9', boxShadow:'0 10px 20px rgba(0,0,0,0.02)'}}>
                  <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#64748b', marginBottom:'15px'}}>QUICK ACTIONS</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                     <div className="hover-card" onClick={() => setCurrentView('claims')} style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 15px', background:'#f8fafc', borderRadius:'14px', cursor:'pointer', border:'1px solid #e2e8f0', transition:'all 0.2s'}}>
                        <div style={{width:'32px', height:'32px', background:'#eff6ff', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>🛡️</div>
                        <div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>File a Claim</div>
                           <div style={{fontSize:'10px', color:'#94a3b8'}}>Manual override system</div>
                        </div>
                        <div style={{marginLeft:'auto', fontSize:'14px', color:'#cbd5e1'}}>→</div>
                     </div>
                     <div className="hover-card" onClick={() => setCurrentView('history')} style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 15px', background:'#f8fafc', borderRadius:'14px', cursor:'pointer', border:'1px solid #e2e8f0', transition:'all 0.2s'}}>
                        <div style={{width:'32px', height:'32px', background:'#f0fdf4', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>📜</div>
                        <div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>Claim History</div>
                           <div style={{fontSize:'10px', color:'#94a3b8'}}>{claimHistory.length} records</div>
                        </div>
                        <div style={{marginLeft:'auto', fontSize:'14px', color:'#cbd5e1'}}>→</div>
                     </div>
                     <div className="hover-card" onClick={() => setCurrentView('plans')} style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 15px', background:'#f8fafc', borderRadius:'14px', cursor:'pointer', border:'1px solid #e2e8f0', transition:'all 0.2s'}}>
                        <div style={{width:'32px', height:'32px', background:'#fef2f2', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>💎</div>
                        <div>
                           <div style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>Manage Plan</div>
                           <div style={{fontSize:'10px', color:'#94a3b8'}}>View & upgrade</div>
                        </div>
                        <div style={{marginLeft:'auto', fontSize:'14px', color:'#cbd5e1'}}>→</div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
          
      </div>
      <BottomNav active="dashboard" setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
    </div>
  )
}
