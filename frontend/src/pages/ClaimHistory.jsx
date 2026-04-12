import React from 'react'

export default function ClaimHistory({ claimHistory, setCurrentView, setIsLoggedIn, setRole }) {
  return (
    <div style={{background: '#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
         <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
               <div style={{width:'44px', height:'44px', background:'rgba(255, 255, 255, 0.7)', backdropFilter:'blur(24px)', borderRadius:'14px', border:'1px solid rgba(255, 255, 255, 0.8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
                  <span style={{fontSize:'20px'}}>📜</span>
               </div>
               <div>
                  <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>HISTORY</div>
                  <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>My Claims Log</div>
               </div>
            </div>
         </header>

         {(!claimHistory || claimHistory.length === 0) ? (
           <div className="hover-card" style={{background:'rgba(255, 255, 255, 0.7)', backdropFilter:'blur(24px)', borderRadius:'32px', padding:'50px 30px', textAlign:'center', border:'1px solid rgba(255, 255, 255, 0.8)', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
             <div style={{fontSize:'60px', marginBottom:'20px'}}>📭</div>
             <h2 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', margin:'0 0 10px 0'}}>No Claims Found</h2>
             <p style={{color:'#64748b', fontSize:'14px', lineHeight:'1.6', margin:'0 0 30px 0'}}>You haven't filed any parametric claim requests yet.</p>
           </div>
         ) : (
           <div className="hover-card" style={{background:'rgba(255, 255, 255, 0.7)', backdropFilter:'blur(24px)', borderRadius:'32px', padding:'30px', border:'1px solid rgba(255, 255, 255, 0.8)', boxShadow:'0 10px 30px rgba(0,0,0,0.02)'}}>
             {claimHistory.map((claim, i) => (
               <div key={claim.id} style={{background:'#f8fafc', borderRadius:'20px', padding:'20px', border:'1px solid rgba(255, 255, 255, 0.8)', marginBottom: i < claimHistory.length - 1 ? '15px' : '0'}}>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                   <span style={{fontSize:'11px', color:'#64748b', fontWeight:'800', letterSpacing:'1px'}}>{claim.date}</span>
                   <span style={{background: claim.status === 'approved' ? '#dcfce7' : (claim.status === 'investigating' ? '#fef3c7' : '#fee2e2'), color: claim.status === 'approved' ? '#166534' : (claim.status === 'investigating' ? '#b45309' : '#dc2626'), padding:'4px 10px', borderRadius:'12px', fontSize:'10px', fontWeight:'800', textTransform:'uppercase'}}>{claim.status}</span>
                 </div>
                 <div style={{fontWeight:'800', fontSize:'15px', color:'#0f172a', marginBottom:'5px'}}>{claim.reason} — {claim.city}</div>
                 
                 {/* XAI Details Block */}
                 {claim.xaiReason && (
                   <div style={{marginTop:'8px', background:'rgba(255, 255, 255, 0.7)', backdropFilter:'blur(24px)', padding:'8px 12px', borderRadius:'10px', fontSize:'11.5px', color:'#64748b', lineHeight:'1.5', borderLeft: claim.status === 'approved' ? '3px solid #16a34a' : (claim.status === 'investigating' ? '3px solid #d97706' : '3px solid #dc2626')}}>
                     <span style={{fontWeight:'700', color: claim.status === 'approved' ? '#166534' : '#9f1239'}}>AI Context:</span> {claim.xaiReason}
                   </div>
                 )}
                 
                 <div style={{display:'flex', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px dashed #cbd5e1', marginTop:'10px'}}>
                   <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:'700', fontFamily:'monospace'}}>{claim.id}</div>
                   <div style={{fontWeight:'900', fontSize:'18px', color:'#021676'}}>₹{claim.payout}</div>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  )
}
