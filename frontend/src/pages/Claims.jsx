import BottomNav from '../components/BottomNav'

export default function Claims({ subscription, setCurrentView, setIsLoggedIn, setRole, claimForm, setClaimForm, claimResult, setClaimResult, claimHistory, claimLoading, handleSubmitClaim }) {
  return (
    <div style={{background: '#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
         <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
               <div style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)', cursor:'pointer'}} onClick={() => setCurrentView('dashboard')}>
                  <span style={{fontSize:'20px'}}>←</span>
               </div>
               <div>
                  <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>CLAIMS</div>
                  <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>File a Claim</div>
               </div>
            </div>
         </header>

         {!subscription ? (
           <div style={{background:'white', borderRadius:'32px', padding:'50px 30px', textAlign:'center', border:'1px solid #e2e8f0', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
             <div style={{fontSize:'60px', marginBottom:'20px'}}>🔒</div>
             <h2 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', margin:'0 0 10px 0'}}>No Active Subscription</h2>
             <p style={{color:'#64748b', fontSize:'14px', lineHeight:'1.6', margin:'0 0 30px 0'}}>You need an active insurance plan to file claims. Choose a plan that suits your needs.</p>
             <button style={{background:'#021676', color:'white', border:'none', padding:'16px 32px', borderRadius:'14px', fontSize:'15px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 25px rgba(2, 22, 118, 0.2)'}} onClick={() => setCurrentView('plans')}>Browse Plans →</button>
           </div>
         ) : (
           <>
             {/* Claim Form */}
             <div style={{background:'white', borderRadius:'32px', padding:'30px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)', marginBottom:'20px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
                 <h3 style={{margin:0, fontSize:'18px', fontWeight:'800', color:'#0f172a'}}>Claim Details</h3>
                 <span style={{background:'#dcfce7', color:'#166534', padding:'6px 12px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px'}}>{subscription.plan} PLAN</span>
               </div>

               <div style={{display:'grid', gap:'18px'}}>
                 <div>
                   <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>FULL NAME</label>
                   <input type="text" value={claimForm.name} onChange={(e) => setClaimForm({...claimForm, name: e.target.value})} placeholder="Ravi Kumar" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                 </div>
                 <div>
                   <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>MOBILE NUMBER</label>
                   <input type="tel" value={claimForm.mobile} onChange={(e) => setClaimForm({...claimForm, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="9876543210" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                 </div>
                 <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                   <div>
                     <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>CITY</label>
                     <input type="text" value={claimForm.city} onChange={(e) => setClaimForm({...claimForm, city: e.target.value})} placeholder="Hyderabad" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                   </div>
                   <div>
                     <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>ZONE</label>
                     <select value={claimForm.zone} onChange={(e) => setClaimForm({...claimForm, zone: e.target.value})} style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}}>
                       <option value="Zone A">Zone A (High Risk)</option>
                       <option value="Zone B">Zone B (Mid Risk)</option>
                       <option value="Zone C">Zone C (Low Risk)</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>REASON FOR CLAIM</label>
                   <select value={claimForm.reason} onChange={(e) => setClaimForm({...claimForm, reason: e.target.value})} style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}}>
                     <option value="">Select a reason...</option>
                     <option value="Heavy Rain">🌧️ Heavy Rainfall</option>
                     <option value="Extreme Heat">🌡️ Extreme Heat</option>
                     <option value="Air Pollution">😷 Air Pollution (AQI {'>'} 300)</option>
                     <option value="Traffic Congestion">🚗 Severe Traffic Congestion</option>
                     <option value="Zone Closure">🚧 Zone Closure / Curfew</option>
                   </select>
                 </div>
                 <div>
                   <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>DESCRIPTION (OPTIONAL)</label>
                   <textarea value={claimForm.description} onChange={(e) => setClaimForm({...claimForm, description: e.target.value})} placeholder="Describe the disruption you faced..." rows={3} style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc', resize:'vertical', fontFamily:'inherit'}} />
                 </div>
               </div>

               {claimResult && claimResult.status === 'error' && (
                 <div style={{marginTop:'15px', padding:'12px 16px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px', color:'#dc2626', fontSize:'13px', fontWeight:'600'}}>{claimResult.message}</div>
               )}

               <button onClick={handleSubmitClaim} disabled={claimLoading} style={{width:'100%', marginTop:'25px', padding:'18px', background: claimLoading ? '#94a3b8' : '#021676', color:'white', border:'none', borderRadius:'16px', fontSize:'15px', fontWeight:'800', cursor: claimLoading ? 'not-allowed' : 'pointer', boxShadow:'0 15px 30px rgba(2, 22, 118, 0.2)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', letterSpacing:'1px'}}>
                 {claimLoading ? '⏳ PROCESSING CLAIM...' : '🛡️ SUBMIT CLAIM'}
               </button>
             </div>

             {/* Claim Result */}
             {claimResult && claimResult.status !== 'error' && (
               <div style={{background: claimResult.status === 'approved' ? '#f0fdf4' : '#fef2f2', borderRadius:'32px', padding:'30px', border: `1px solid ${claimResult.status === 'approved' ? '#bbf7d0' : '#fecaca'}`, boxShadow:'0 20px 40px rgba(0,0,0,0.04)', marginBottom:'20px', textAlign:'center'}}>
                 <div style={{fontSize:'48px', marginBottom:'15px'}}>{claimResult.status === 'approved' ? '✅' : '❌'}</div>
                 <h3 style={{fontSize:'24px', fontWeight:'900', color: claimResult.status === 'approved' ? '#166534' : '#dc2626', margin:'0 0 10px 0'}}>{claimResult.status === 'approved' ? 'Claim Approved!' : 'Claim Rejected'}</h3>
                 {claimResult.payout && <div style={{fontSize:'36px', fontWeight:'900', color:'#166534', margin:'10px 0'}}>₹{claimResult.payout}</div>}
                 <p style={{color:'#64748b', fontSize:'14px', lineHeight:'1.6', margin:'10px 0 0 0'}}>{claimResult.message}</p>
                 <div style={{marginTop:'15px', display:'inline-block', padding:'6px 14px', borderRadius:'20px', background: claimResult.status === 'approved' ? '#dcfce7' : '#fee2e2', fontSize:'11px', fontWeight:'800', letterSpacing:'1px', color: claimResult.status === 'approved' ? '#166534' : '#dc2626'}}>RISK: {claimResult.riskScore}</div>
               </div>
             )}

             {/* Claim History */}
             {claimHistory.length > 0 && (
               <div style={{background:'white', borderRadius:'32px', padding:'30px', border:'1px solid #f1f5f9', boxShadow:'0 10px 30px rgba(0,0,0,0.02)'}}>
                 <h3 style={{margin:'0 0 20px 0', fontSize:'16px', fontWeight:'800', color:'#0f172a'}}>Claim History</h3>
                 {claimHistory.map((claim, i) => (
                   <div key={claim.id} style={{background:'#f8fafc', borderRadius:'20px', padding:'20px', border:'1px solid #e2e8f0', marginBottom: i < claimHistory.length - 1 ? '12px' : '0'}}>
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                       <span style={{fontSize:'10px', color:'#64748b', fontWeight:'800', letterSpacing:'1px'}}>{claim.date}</span>
                       <span style={{background: claim.status === 'approved' ? '#dcfce7' : '#fee2e2', color: claim.status === 'approved' ? '#166534' : '#dc2626', padding:'4px 10px', borderRadius:'12px', fontSize:'10px', fontWeight:'800', textTransform:'uppercase'}}>{claim.status}</span>
                     </div>
                     <div style={{fontWeight:'800', fontSize:'14px', color:'#0f172a', marginBottom:'5px'}}>{claim.reason} — {claim.city}</div>
                     <div style={{display:'flex', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px dashed #cbd5e1'}}>
                       <div style={{fontSize:'11px', color:'#94a3b8', fontWeight:'700'}}>{claim.id}</div>
                       <div style={{fontWeight:'900', fontSize:'16px', color:'#021676'}}>₹{claim.payout}</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </>
         )}
      </div>
      <BottomNav active="claims" setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
    </div>
  )
}
