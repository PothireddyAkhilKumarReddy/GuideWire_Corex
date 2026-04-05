import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Claims({ coords, results, userId, subscription, setSubscription, setCurrentView, setIsLoggedIn, setRole, setClaimHistory, setHonorScore, setWalletBalance }) {
  const [claimForm, setClaimForm] = useState({ name: '', mobile: '', city: 'Hyderabad', location: '', reason: '', description: '' })
  const [claimResult, setClaimResult] = useState(null)
  const [claimLoading, setClaimLoading] = useState(false)

  const handleSubmitClaim = async () => {
    if (!subscription) return;
    if (!claimForm.name || claimForm.name.trim().length < 2) { setClaimResult({ status: 'error', message: 'Please enter your full name.' }); return; }
    if (!claimForm.mobile || !/^[6-9]\d{9}$/.test(claimForm.mobile)) { setClaimResult({ status: 'error', message: 'Please enter a valid 10-digit mobile number.' }); return; }
    if (!claimForm.city || claimForm.city.trim().length < 2) { setClaimResult({ status: 'error', message: 'Please enter your city.' }); return; }
    if (!claimForm.reason) { setClaimResult({ status: 'error', message: 'Please select a reason for your claim.' }); return; }

    setClaimLoading(true);
    setClaimResult(null);
    try {
      const payload = {
        user_id: userId || 8829,
        city: claimForm.city,
        latitude: coords.lat || 17.3850,
        longitude: coords.lon || 78.4867,
        claim_reason: claimForm.reason
      };
      const response = await fetch(`${API_BASE}/api/risk/calculate-risk`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await response.json();
      const payout = subscription.coverage;
      
      const claimRes = await fetch(`${API_BASE}/api/claims/trigger-claim`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user_id: userId || 8829, risk_level: data.risk_level, payout_amount: payout, reason: claimForm.reason, city: claimForm.city, xai_reason: data.xai_reason || null })
      });
      const claimData = await claimRes.json();
      
      const parsedStatus = claimData.status === 'Rejected' ? 'rejected' : (claimData.status.includes('Fraud') ? 'investigating' : 'approved');
      
      if (claimData.honor_score !== undefined) {
        setHonorScore(claimData.honor_score);
      }
      if (claimData.wallet_balance !== undefined && setWalletBalance) {
        setWalletBalance(claimData.wallet_balance);
      }
      
      const newClaim = { id: `CLM-${claimData.claim_id || Date.now()}`, date: new Date().toLocaleDateString('en-IN'), reason: claimForm.reason, city: claimForm.city, location: claimForm.location, payout: claimData.payout, status: parsedStatus, riskScore: data.risk_level, xaiReason: data.xai_reason || 'Standard Operating Conditions' };
      setClaimHistory(prev => [newClaim, ...prev]);

      if (claimData.subscription_consumed) {
         setSubscription(null);
      }
      
      if (data.risk_level === 'Geofence Mismatch') {
         setClaimResult({ status: 'rejected', riskScore: 'Geo-Spoof', message: `Fraud alert: Your submitted city "${claimForm.city}" does not match your active hardware GPS coordinates (detected near ${data.telemetry?.city || 'another zone'}). Claim immediately blocked.` });
      } else if (!data.claim_eligible || parsedStatus === 'rejected') {
         const reasonText = data.xai_reason ? ` AI Context: ${data.xai_reason}.` : '';
         setClaimResult({ status: 'rejected', riskScore: data.risk_level, message: `Claim not eligible. Risk level (${data.risk_level}) is below the threshold.${reasonText}` });
      } else if (parsedStatus === 'investigating') {
         setClaimResult({ status: 'rejected', riskScore: data.risk_level, message: `Claim halted for fraud review. Trust Score: ${claimData.trust_score}` });
      } else {
         const reasonText = data.xai_reason ? ` Verification Match: ${data.xai_reason}.` : '';
         setClaimResult({ status: 'approved', payout: claimData.payout, riskScore: data.risk_level, message: `Claim approved! ₹${claimData.payout} credited to your wallet.${reasonText}` });
      }
    } catch (e) {
      console.error(e);
      setClaimResult({ status: 'error', message: 'API Offline or Internal Server Error. Our infrastructure failed to process your payload. Please try again.' });
    }
    setClaimLoading(false);
  }

  useEffect(() => {
    setClaimForm(prev => ({
      ...prev,
      city: (prev.city === 'Hyderabad' || prev.city === '') && results?.telemetry?.city ? results.telemetry.city : prev.city,
      location: !prev.location && coords && coords.lat ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : prev.location
    }));
  }, [coords, results, setClaimForm]);
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
           <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'50px 30px', textAlign:'center', border:'1px solid #e2e8f0', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
             <div style={{fontSize:'60px', marginBottom:'20px'}}>🔒</div>
             <h2 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', margin:'0 0 10px 0'}}>No Active Subscription</h2>
             <p style={{color:'#64748b', fontSize:'14px', lineHeight:'1.6', margin:'0 0 30px 0'}}>You need an active insurance plan to file claims. Choose a plan that suits your needs.</p>
             <button style={{background:'#021676', color:'white', border:'none', padding:'16px 32px', borderRadius:'14px', fontSize:'15px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 25px rgba(2, 22, 118, 0.2)'}} onClick={() => setCurrentView('plans')}>Browse Plans →</button>
           </div>
         ) : (
           <>
             {/* Claim Form */}
             <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'30px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)', marginBottom:'20px'}}>
               
               <div style={{background:'#fffbeb', borderLeft:'4px solid #f59e0b', padding:'15px', borderRadius:'12px', marginBottom:'25px'}}>
                 <div style={{fontSize:'12px', fontWeight:'800', color:'#b45309', marginBottom:'5px'}}>MANUAL OVERRIDE SYSTEM</div>
                 <div style={{fontSize:'11px', color:'#92400e'}}>Did the Zero-Touch Dashboard scanner miss your micro-climate disruption? You can file a manual fallback claim here for ML evaluation.</div>
               </div>

               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
                 <h3 style={{margin:0, fontSize:'18px', fontWeight:'800', color:'#0f172a'}}>Claim Details</h3>
                 <span style={{background:'#dcfce7', color:'#166534', padding:'6px 12px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px'}}>{subscription.plan} PLAN</span>
               </div>

               <div style={{display:'grid', gap:'18px'}}>
                 <div>
                   <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>FULL NAME</label>
                   <input type="text" value={claimForm.name} onChange={(e) => setClaimForm({...claimForm, name: e.target.value})} placeholder="Enter your full name" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                 </div>
                 <div>
                   <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>MOBILE NUMBER</label>
                   <input type="tel" value={claimForm.mobile} onChange={(e) => setClaimForm({...claimForm, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="Enter 10-digit mobile number" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                 </div>
                  <div className="flex-col-mobile" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                   <div>
                     <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>CITY</label>
                     <input type="text" value={claimForm.city} onChange={(e) => setClaimForm({...claimForm, city: e.target.value})} placeholder="Hyderabad" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                   </div>
                   <div>
                     <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px'}}>CURRENT LOCATION (GPS Tracked) 📍</label>
                     <input type="text" value={claimForm.location} onChange={(e) => setClaimForm({...claimForm, location: e.target.value})} placeholder="e.g., Banjara Hills" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
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
                     <option value="Road Block">🚧 Major Route Blockage</option>
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
               
               <div style={{marginTop:'25px', padding:'15px', background:'#f8fafc', borderRadius:'16px', border:'1px solid #e2e8f0'}}>
                  <h4 style={{margin:'0 0 8px 0', fontSize:'11px', fontWeight:'800', display:'flex', alignItems:'center', gap:'6px', color:'#64748b'}}><span style={{color:'#ef4444'}}>⚠️</span> POLICY CONDITIONS & EXCLUSIONS</h4>
                  <p style={{margin:'0', fontSize:'11px', lineHeight:'1.6', color:'#64748b'}}>Parametric payouts are algorithmically verified bounds and implicitly EXCLUDE: <strong style={{color:'#0f172a'}}>Self-inflicted disruptions</strong> (voluntary work cessation), <strong style={{color:'#0f172a'}}>Anticipated seasonal baselines</strong>, <strong style={{color:'#0f172a'}}>Pre-existing economic gaps</strong>, and <strong style={{color:'#0f172a'}}>Geofencing manipulation</strong>. All telemetry is adversarial-checked against cell tower validation & device-trust fingerprints.</p>
               </div>
             </div>

             {/* Claim Result */}
             {claimResult && claimResult.status !== 'error' && (
               <div className="hover-card" style={{background: claimResult.status === 'approved' ? '#f0fdf4' : '#fef2f2', borderRadius:'32px', padding:'30px', border: `1px solid ${claimResult.status === 'approved' ? '#bbf7d0' : '#fecaca'}`, boxShadow:'0 20px 40px rgba(0,0,0,0.04)', marginBottom:'20px', textAlign:'center'}}>
                 <div style={{fontSize:'48px', marginBottom:'15px'}}>{claimResult.status === 'approved' ? '✅' : '❌'}</div>
                 <h3 style={{fontSize:'24px', fontWeight:'900', color: claimResult.status === 'approved' ? '#166534' : '#dc2626', margin:'0 0 10px 0'}}>{claimResult.status === 'approved' ? 'Claim Approved!' : 'Claim Rejected'}</h3>
                 {claimResult.payout && <div style={{fontSize:'36px', fontWeight:'900', color:'#166534', margin:'10px 0'}}>₹{claimResult.payout}</div>}
                 <p style={{color:'#64748b', fontSize:'14px', lineHeight:'1.6', margin:'10px 0 0 0'}}>{claimResult.message}</p>
                 <div style={{marginTop:'15px', display:'inline-block', padding:'6px 14px', borderRadius:'20px', background: claimResult.status === 'approved' ? '#dcfce7' : '#fee2e2', fontSize:'11px', fontWeight:'800', letterSpacing:'1px', color: claimResult.status === 'approved' ? '#166534' : '#dc2626'}}>RISK: {claimResult.riskScore}</div>
               </div>
             )}

           </>
         )}
      </div>
    </div>
  )
}
