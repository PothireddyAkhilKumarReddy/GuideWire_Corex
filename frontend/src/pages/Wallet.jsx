import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Wallet({ userId, setCurrentView, setIsLoggedIn, setRole, profileComplete, cachedWallet, setCachedWallet }) {
  const [data, setData] = useState(cachedWallet || null);
  const [loading, setLoading] = useState(!cachedWallet);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [success, setSuccess] = useState(null);

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/wallet/${userId}`);
      const json = await res.json();
      setData(json);
      if (setCachedWallet) setCachedWallet(json);
    } catch (e) {
      console.error('Wallet fetch error:', e);
    }
    setLoading(false);
  };

  useEffect(() => { if (userId && !cachedWallet) fetchWallet(); }, [userId]);

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > (data?.balance || 0)) return;
    setWithdrawing(true);
    try {
      const res = await fetch(`${API_BASE}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, amount: amt })
      });
      const json = await res.json();
      if (json.message) {
        setSuccess(`₹${amt.toFixed(0)} transferred to your bank account`);
        setShowWithdraw(false);
        setWithdrawAmount('');
        fetchWallet();
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (e) {
      console.error('Withdraw error:', e);
    }
    setWithdrawing(false);
  };

  if (loading) {
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Inter", sans-serif'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'40px', height:'40px', border:'4px solid #e2e8f0', borderTopColor:'#021676', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 20px auto'}}></div>
          <p style={{color:'#64748b', fontWeight:'600'}}>Loading Wallet...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!profileComplete) {
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
        <div style={{maxWidth:'600px', margin:'0 auto'}}>
          <header style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'30px'}}>
             <div style={{width:'44px', height:'44px', background:'linear-gradient(135deg, #b45309, #d97706)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 15px rgba(180,83,9,0.3)'}}>
                <span style={{fontSize:'20px'}}>🔒</span>
             </div>
             <div>
                <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>INSURGIG</div>
                <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>My Wallet</div>
             </div>
          </header>

          <div style={{background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'24px', padding:'40px 30px', textAlign:'center', boxShadow:'0 10px 30px rgba(180,83,9,0.05)'}}>
            <div style={{width:'60px', height:'60px', background:'#fef3c7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', margin:'0 auto 20px auto'}}>⚠️</div>
            <h3 style={{fontSize:'20px', fontWeight:'800', color:'#b45309', margin:'0 0 12px 0'}}>Complete Profile To Enable Wallet</h3>
            <p style={{fontSize:'14px', color:'#d97706', margin:'0 0 25px 0', lineHeight:'1.5'}}>We require verified payout details and identity confirmation to activate your digital wallet.</p>
            
            <div style={{background:'#fef3c7', borderRadius:'12px', padding:'15px', marginBottom:'25px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', fontWeight:'800', color:'#b45309', marginBottom:'8px'}}>
                <span>PROFILE COMPLIANCE</span>
                <span>0% READY</span>
              </div>
              <div style={{height:'6px', background:'rgba(180,83,9,0.1)', borderRadius:'3px', overflow:'hidden'}}>
                <div style={{width:'0%', height:'100%', background:'#b45309'}}></div>
              </div>
            </div>

            <button onClick={() => setCurrentView('profile-setup')} style={{padding:'16px 32px', background:'#b45309', color:'white', borderRadius:'14px', fontSize:'15px', fontWeight:'800', border:'none', cursor:'pointer', width:'100%'}}>
              Start Verification →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const balance = data?.balance || 0;

  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        
        {/* Header */}
        <header style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'30px'}}>
          <div style={{width:'44px', height:'44px', background:'linear-gradient(135deg, #021676, #3b82f6)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 15px rgba(2,22,118,0.3)'}}>
            <span style={{fontSize:'20px'}}>💰</span>
          </div>
          <div>
            <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>INSURGIG</div>
            <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>My Wallet</div>
          </div>
        </header>

        {/* Success Toast */}
        {success && (
          <div style={{background:'#10b981', color:'white', padding:'14px 20px', borderRadius:'14px', marginBottom:'20px', fontWeight:'700', fontSize:'14px', display:'flex', alignItems:'center', gap:'10px', animation:'fadeInUp 0.3s ease'}}>
            <span>✓</span> {success}
          </div>
        )}

        {/* Balance Card */}
        <div style={{background:'linear-gradient(135deg, #021676, #1e40af)', borderRadius:'24px', padding:'35px 30px', marginBottom:'25px', color:'white', position:'relative', overflow:'hidden', boxShadow:'0 20px 40px rgba(2,22,118,0.3)'}}>
          <div style={{position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.08)'}}></div>
          <div style={{position:'absolute', bottom:'-20px', left:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:'rgba(255,255,255,0.05)'}}></div>
          <div style={{fontSize:'12px', fontWeight:'700', letterSpacing:'2px', opacity:0.7, marginBottom:'8px'}}>AVAILABLE BALANCE</div>
          <div style={{fontSize:'42px', fontWeight:'900', marginBottom:'5px'}}>₹{balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
          <div style={{fontSize:'12px', opacity:0.6}}>InsurGig Wallet • Instant Payouts</div>
          
          <div style={{display:'flex', gap:'12px', marginTop:'25px'}}>
            <button onClick={() => setShowWithdraw(!showWithdraw)} style={{flex:1, padding:'12px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'white', fontWeight:'700', fontSize:'13px', backdropFilter:'blur(10px)'}}>
              🏦 Transfer to Bank
            </button>
            <button onClick={() => setCurrentView('history')} style={{flex:1, padding:'12px', borderRadius:'12px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.8)', fontWeight:'700', fontSize:'13px'}}>
              📜 View Claims
            </button>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div style={{background:'white', borderRadius:'20px', padding:'25px', border:'1px solid #e2e8f0', marginBottom:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.06)'}}>
            <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'15px'}}>WITHDRAW TO BANK</div>
            <input type="number" value={withdrawAmount} onChange={e => {
              const val = parseFloat(e.target.value);
              if (e.target.value === '') { setWithdrawAmount(''); return; }
              if (val < 0) { setWithdrawAmount('0'); return; }
              if (val > balance) { setWithdrawAmount(String(balance)); return; }
              setWithdrawAmount(e.target.value);
            }} placeholder={balance > 0 ? `Max ₹${balance}` : 'No balance available'} min={0} max={balance} disabled={balance <= 0}
              style={{width:'100%', padding:'14px 16px', borderRadius:'12px', border:'2px solid #e2e8f0', fontSize:'18px', fontWeight:'700', boxSizing:'border-box', outline:'none', marginBottom:'12px', opacity: balance <= 0 ? 0.5 : 1}} />
            <div style={{display:'flex', gap:'8px', marginBottom:'15px'}}>
              {[...new Set([50, 100, balance].filter(v => v > 0 && v <= balance))].map(v => (
                <button key={v} onClick={() => setWithdrawAmount(String(v))} style={{flex:1, padding:'8px', borderRadius:'8px', background:'#f1f5f9', border:'1px solid #e2e8f0', fontSize:'12px', fontWeight:'700', color:'#0f172a', cursor:'pointer'}}>
                  {v === balance ? '₹All' : `₹${v}`}
                </button>
              ))}
            </div>
            <button onClick={handleWithdraw} disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) > balance}
              style={{width:'100%', padding:'14px', borderRadius:'12px', background:'#021676', color:'white', border:'none', fontWeight:'700', fontSize:'14px', opacity: withdrawAmount && parseFloat(withdrawAmount) <= balance ? 1 : 0.4}}>
              {withdrawing ? '⏳ Processing...' : '✓ Confirm Transfer'}
            </button>
          </div>
        )}

        {/* Transactions */}
        <div style={{background:'white', borderRadius:'24px', padding:'25px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.02)'}}>
          <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'20px'}}>TRANSACTION HISTORY</div>
          
          {data?.transactions?.length > 0 ? (
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {data.transactions.map(txn => (
                <div key={txn.id} style={{display:'flex', alignItems:'center', gap:'12px', padding:'14px', background:'#f8fafc', borderRadius:'14px'}}>
                  <div style={{width:'40px', height:'40px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', background: txn.type === 'credit' ? '#dcfce7' : '#fef2f2'}}>
                    {txn.type === 'credit' ? '💚' : '🏦'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>{txn.description}</div>
                    <div style={{fontSize:'11px', color:'#94a3b8', marginTop:'2px'}}>{txn.date}</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'900', color: txn.type === 'credit' ? '#10b981' : '#ef4444'}}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{textAlign:'center', padding:'40px 0', color:'#94a3b8'}}>
              <div style={{fontSize:'40px', marginBottom:'10px'}}>💸</div>
              <div style={{fontWeight:'700'}}>No transactions yet</div>
              <div style={{fontSize:'13px', marginTop:'5px'}}>Claim payouts will appear here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
