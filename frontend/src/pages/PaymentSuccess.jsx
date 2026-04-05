import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function PaymentSuccess({ setSubscription, setCurrentView, setIsLoggedIn }) {
  const [status, setStatus] = useState('verifying');
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const plan = params.get('plan');
    const premium = params.get('premium');
    const coverage = params.get('coverage');

    if (sessionId) {
      fetch(`${API_BASE}/api/payment/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'paid') {
            setStatus('success');
            setPlanData({ plan: data.plan, premium: data.premium, coverage: data.coverage });
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            setSubscription({
              plan: data.plan,
              premium: data.premium,
              coverage: data.coverage,
              expiry: expiry.toLocaleDateString('en-IN'),
              activatedOn: new Date().toLocaleDateString('en-IN')
            });
          } else if (data.status === 'unpaid') {
            setStatus('unpaid');
          } else {
            setStatus('failed');
          }
        })
        .catch(() => setStatus('failed'));
    } else {
      setStatus('failed');
    }
  }, []);

  const handleReVerify = () => {
    setStatus('verifying');
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      fetch(`${API_BASE}/api/payment/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'paid') {
            setStatus('success');
            setPlanData({ plan: data.plan, premium: data.premium, coverage: data.coverage });
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            setSubscription({
              plan: data.plan,
              premium: data.premium,
              coverage: data.coverage,
              expiry: expiry.toLocaleDateString('en-IN'),
              activatedOn: new Date().toLocaleDateString('en-IN')
            });
          } else if (data.status === 'unpaid') {
            setStatus('unpaid');
          } else {
            setStatus('failed');
          }
        })
        .catch(() => setStatus('failed'));
    }
  };

  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Inter", sans-serif', padding:'20px'}}>
      <div style={{maxWidth:'480px', width:'100%', textAlign:'center'}}>
        
        {status === 'verifying' && (
          <div>
            <div style={{width:'60px', height:'60px', border:'4px solid #e2e8f0', borderTopColor:'#021676', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 25px auto'}}></div>
            <h2 style={{fontSize:'24px', fontWeight:'900', color:'#0f172a', marginBottom:'10px'}}>Verifying Payment...</h2>
            <p style={{color:'#64748b', fontSize:'14px'}}>Confirming your Stripe payment</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'unpaid' && (
          <div style={{background:'white', borderRadius:'24px', padding:'40px', border:'1px solid #e2e8f0', boxShadow:'0 20px 60px rgba(0,0,0,0.05)'}}>
            <div style={{width:'80px', height:'80px', background:'#fffbeb', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto'}}>
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h2 style={{fontSize:'24px', fontWeight:'900', color:'#0f172a', marginBottom:'12px'}}>Processing Delay</h2>
            <p style={{color:'#64748b', fontSize:'15px', lineHeight:'1.5', marginBottom:'32px'}}>Your payment is still being processed by Stripe. Sometimes it takes a few additional seconds for the status to update securely.</p>
            <button onClick={handleReVerify} style={{width:'100%', padding:'16px', background:'#021676', color:'white', fontSize:'16px', fontWeight:'700', borderRadius:'12px', border:'none', cursor:'pointer', marginBottom:'12px'}}>
              Check Status Again
            </button>
            <button onClick={() => setCurrentView('plans')} style={{width:'100%', padding:'16px', background:'#f8fafc', color:'#475569', fontSize:'16px', fontWeight:'700', borderRadius:'12px', border:'1px solid #e2e8f0', cursor:'pointer'}}>
              Back to Plans
            </button>
          </div>
        )}

        {status === 'success' && (
          <div style={{background:'white', borderRadius:'24px', padding:'50px 40px', border:'1px solid #e2e8f0', boxShadow:'0 20px 60px rgba(0,0,0,0.05)'}}>
            <div style={{width:'80px', height:'80px', background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 25px auto', fontSize:'36px'}}>✓</div>
            <h2 style={{fontSize:'28px', fontWeight:'900', color:'#0f172a', marginBottom:'10px'}}>Payment Successful!</h2>
            <p style={{color:'#64748b', fontSize:'15px', marginBottom:'30px'}}>Your insurance plan is now active</p>
            
            {planData && (
              <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', marginBottom:'30px', border:'1px solid #e2e8f0'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <span style={{fontSize:'13px', color:'#64748b', fontWeight:'700'}}>Plan</span>
                  <span style={{fontSize:'13px', fontWeight:'900', color:'#0f172a'}}>{planData.plan}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <span style={{fontSize:'13px', color:'#64748b', fontWeight:'700'}}>Premium</span>
                  <span style={{fontSize:'13px', fontWeight:'900', color:'#021676'}}>₹{planData.premium}/week</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span style={{fontSize:'13px', color:'#64748b', fontWeight:'700'}}>Coverage</span>
                  <span style={{fontSize:'13px', fontWeight:'900', color:'#10b981'}}>₹{planData.coverage}</span>
                </div>
              </div>
            )}
            
            <div style={{display:'flex', alignItems:'center', gap:'8px', justifyContent:'center', marginBottom:'25px'}}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" style={{height:'20px', opacity:0.5}} />
              <span style={{fontSize:'11px', color:'#94a3b8', fontWeight:'700'}}>Verified Payment</span>
            </div>
            
            <button onClick={() => setCurrentView('dashboard')} style={{width:'100%', padding:'16px', background:'#021676', color:'white', border:'none', borderRadius:'14px', fontWeight:'800', fontSize:'15px', cursor:'pointer'}}>
              Go to Dashboard →
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div style={{background:'white', borderRadius:'24px', padding:'50px 40px', border:'1px solid #e2e8f0'}}>
            <div style={{width:'80px', height:'80px', background:'#fef2f2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 25px auto', fontSize:'36px'}}>✕</div>
            <h2 style={{fontSize:'24px', fontWeight:'900', color:'#0f172a', marginBottom:'10px'}}>Payment Failed</h2>
            <p style={{color:'#64748b', fontSize:'14px', marginBottom:'30px'}}>Something went wrong. Please try again.</p>
            <button onClick={() => setCurrentView('plans')} style={{width:'100%', padding:'16px', background:'#021676', color:'white', border:'none', borderRadius:'14px', fontWeight:'800', fontSize:'15px', cursor:'pointer'}}>
              Back to Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
