import BottomNav from '../components/BottomNav'

export default function Dashboard({ subscription, setCurrentView, setIsLoggedIn, setRole, results, loadingRisk, handleCheckRisk }) {
  return (
    <div style={{background: '#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
         <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
               <div style={{width:'44px', height:'44px', background:'#white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
                  <span style={{background:'#021676', color:'white', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', fontSize:'12px'}}>⊞</span>
               </div>
               <div>
                  <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>YOUR DASHBOARD</div>
                  <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Welcome back, Ravi</div>
               </div>
            </div>
            <div onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }} style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', fontSize:'16px'}}>
               🚪
            </div>
         </header>

         <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'20px'}}>
            <div style={{background:'#021676', borderRadius:'24px', padding:'25px', color:'white', boxShadow:'0 15px 30px rgba(2, 22, 118, 0.2)', position:'relative', overflow:'hidden'}}>
               <div style={{position:'absolute', top:0, right:0, width:'100px', height:'100px', background:'rgba(255,255,255,0.1)', borderRadius:'50%', transform:'translate(30%, -30%)'}}></div>
               <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'rgba(255,255,255,0.7)', marginBottom:'10px'}}>{subscription ? 'YOUR PLAN' : 'NO ACTIVE PLAN'}</div>
               {subscription ? (
                 <div>
                   <div style={{fontSize:'24px', fontWeight:'900', letterSpacing:'-1px'}}>{subscription.plan}</div>
                   <div style={{fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'5px'}}>Coverage: ₹{subscription.coverage}</div>
                 </div>
               ) : (
                 <div style={{cursor:'pointer'}} onClick={() => setCurrentView('plans')}>
                   <div style={{fontSize:'16px', fontWeight:'800'}}>Buy a Plan</div>
                   <div style={{fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'5px'}}>Starting at ₹40/week →</div>
                 </div>
               )}
            </div>
            <div style={{background:'white', borderRadius:'24px', padding:'25px', border:'1px solid #e2e8f0', boxShadow:'0 10px 20px rgba(0,0,0,0.03)'}}>
               <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#64748b', marginBottom:'10px'}}>RISK COVERAGE</div>
               <div style={{fontSize:'20px', fontWeight:'900', color: subscription ? '#0f172a' : '#94a3b8', display:'flex', alignItems:'center', gap:'10px'}}>
                  {subscription ? 'ACTIVE' : 'INACTIVE'} <div style={{width:'10px', height:'10px', background: subscription ? '#22c55e' : '#ef4444', borderRadius:'50%', boxShadow: subscription ? '0 0 10px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)'}}></div>
               </div>
               {subscription && <div style={{fontSize:'11px', color:'#64748b', marginTop:'8px'}}>Expires: {subscription.expiry}</div>}
            </div>
         </div>

         <div style={{background:'white', borderRadius:'32px', padding:'25px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)', marginBottom:'20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
               <div style={{fontSize:'12px', fontWeight:'800', letterSpacing:'1px', color:'#64748b'}}>YOUR DELIVERY ZONE</div>
               <div style={{fontSize:'12px', fontWeight:'800', color:'#021676', background:'#eff6ff', padding:'6px 12px', borderRadius:'10px'}}>Zone B</div>
            </div>
            
            <div style={{height:'220px', background:'linear-gradient(145deg, #f8fafc, #f1f5f9)', borderRadius:'20px', border:'1px solid #e2e8f0', position:'relative', overflow:'hidden', backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%23e2e8f0\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\'/%3E%3C/svg%3E")'}}>
               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'120px', height:'120px', background:'rgba(59, 130, 246, 0.1)', borderRadius:'50%', animation:'pulse 2s infinite'}}></div>
               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'16px', height:'16px', background:'#3b82f6', borderRadius:'50%', border:'4px solid white', boxShadow:'0 0 20px rgba(59, 130, 246, 0.8)'}}></div>
               
               <div style={{position:'absolute', bottom:'15px', right:'15px', background:'white', padding:'8px 12px', borderRadius:'12px', fontSize:'10px', fontWeight:'800', color:'#0f172a', border:'1px solid #e2e8f0', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                  Hyderabad
               </div>
               
               <div style={{position:'absolute', top:'15px', left:'15px', background:'white', padding:'8px 12px', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                  <button className="btn-primary" style={{padding:'6px 12px', fontSize:'10px'}} onClick={handleCheckRisk}>{loadingRisk ? 'Scanning...' : 'Simulate Risk'}</button>
               </div>
            </div>
            
            {results.riskScore && (
              <div style={{marginTop:'20px', background:'#f8fafc', padding:'15px', borderRadius:'16px', border:'1px solid #e2e8f0'}}>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                    <span style={{fontSize:'12px', fontWeight:'700', color:'#64748b'}}>AI Risk Profile:</span>
                    <span style={{fontSize:'12px', fontWeight:'800', color:'#ef4444'}}>{results.riskScore}</span>
                 </div>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                    <span style={{fontSize:'12px', fontWeight:'700', color:'#64748b'}}>Calculated Premium:</span>
                    <span style={{fontSize:'12px', fontWeight:'800', color:'#021676'}}>{results.weeklyPremium}</span>
                 </div>
                 <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontSize:'12px', fontWeight:'700', color:'#64748b'}}>Claim Status:</span>
                    <span style={{fontSize:'12px', fontWeight:'800', color:'#22c55e'}}>{results.claimStatus}</span>
                 </div>
              </div>
            )}
         </div>

         <div style={{background:'white', borderRadius:'32px', padding:'30px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
            <h3 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 20px 0'}}>Live Weather & Traffic Data</h3>
            
            <div style={{display:'grid', gap:'15px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                     <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>💧</div>
                     <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Humidity</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'800', color:'#3b82f6'}}>82%</div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                     <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>🚗</div>
                     <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Traffic Delay</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'800', color:'#f59e0b'}}>14 mins</div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                     <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>🧠</div>
                     <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>AI Risk Level</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'800', color:'#ef4444'}}>High Risk</div>
               </div>
            </div>
         </div>
         
      </div>
      <BottomNav active="dashboard" setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
    </div>
  )
}
