export default function PaymentModal({ selectedPlan, paymentStep, paymentMethod, setPaymentMethod, setShowPaymentModal, handlePaymentSubmit }) {
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px'}}>
      <div style={{background:'rgba(255, 255, 255, 0.7)', backdropFilter:'blur(24px)', borderRadius:'32px', padding:'40px', maxWidth:'440px', width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,0.15)', position:'relative'}}>
        
        {paymentStep === 'select' && (
          <>
            <button onClick={() => setShowPaymentModal(false)} style={{position:'absolute', top:'20px', right:'20px', background:'#f1f5f9', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
            
            <div style={{textAlign:'center', marginBottom:'30px'}}>
              <div style={{width:'56px', height:'56px', background:'#021676', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px auto', color:'white', fontSize:'24px'}}>💳</div>
              <h2 style={{fontSize:'24px', fontWeight:'900', color:'#0f172a', margin:'0 0 5px 0'}}>Complete Payment</h2>
              <p style={{color:'#64748b', fontSize:'14px', margin:0}}>{selectedPlan.name} Plan — ₹{selectedPlan.premium}/week</p>
            </div>

            <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', marginBottom:'25px', border:'1px solid rgba(255, 255, 255, 0.8)'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{fontSize:'13px', color:'#64748b', fontWeight:'600'}}>Plan</span>
                <span style={{fontSize:'13px', fontWeight:'800', color:'#0f172a'}}>{selectedPlan.name}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{fontSize:'13px', color:'#64748b', fontWeight:'600'}}>Coverage</span>
                <span style={{fontSize:'13px', fontWeight:'800', color:'#0f172a'}}>₹{selectedPlan.coverage}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{fontSize:'13px', color:'#64748b', fontWeight:'600'}}>Duration</span>
                <span style={{fontSize:'13px', fontWeight:'800', color:'#0f172a'}}>7 days</span>
              </div>
              <div style={{borderTop:'1px dashed #cbd5e1', paddingTop:'10px', display:'flex', justifyContent:'space-between'}}>
                <span style={{fontSize:'15px', fontWeight:'800', color:'#0f172a'}}>Total</span>
                <span style={{fontSize:'20px', fontWeight:'900', color:'#021676'}}>₹{selectedPlan.premium}</span>
              </div>
            </div>

            <div style={{marginBottom:'25px'}}>
              <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'12px'}}>PAYMENT METHOD</label>
              <div style={{display:'flex', gap:'10px'}}>
                {[{id:'card', label:'💳 Card', desc:'Debit/Credit'}, {id:'upi', label:'📱 UPI', desc:'GPay/PhonePe'}, {id:'wallet', label:'👛 Wallet', desc:'Paytm/Amazon'}].map(m => (
                  <div key={m.id} onClick={() => setPaymentMethod(m.id)} style={{flex:1, padding:'15px 10px', borderRadius:'14px', border: paymentMethod === m.id ? '2px solid #021676' : '1px solid #e2e8f0', background: paymentMethod === m.id ? '#eff6ff' : 'white', cursor:'pointer', textAlign:'center', transition:'all 0.2s ease'}}>
                    <div style={{fontSize:'20px', marginBottom:'5px'}}>{m.label.split(' ')[0]}</div>
                    <div style={{fontSize:'11px', fontWeight:'700', color: paymentMethod === m.id ? '#021676' : '#64748b'}}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div style={{display:'grid', gap:'15px', marginBottom:'25px'}}>
                <input type="text" placeholder="Card Number" defaultValue="4111 1111 1111 1111" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid rgba(255, 255, 255, 0.8)', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                  <input type="text" placeholder="MM/YY" defaultValue="12/28" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid rgba(255, 255, 255, 0.8)', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                  <input type="text" placeholder="CVV" defaultValue="123" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid rgba(255, 255, 255, 0.8)', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div style={{marginBottom:'25px'}}>
                <input type="text" placeholder="Enter UPI ID" defaultValue="worker@paytm" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid rgba(255, 255, 255, 0.8)', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
              </div>
            )}

            <button onClick={handlePaymentSubmit} style={{width:'100%', padding:'18px', background:'#021676', color:'white', border:'none', borderRadius:'16px', fontSize:'16px', fontWeight:'800', cursor:'pointer', boxShadow:'0 15px 30px rgba(2, 22, 118, 0.2)', letterSpacing:'1px'}}>
              PAY ₹{selectedPlan.premium} ⚡
            </button>
            <p style={{textAlign:'center', fontSize:'11px', color:'#94a3b8', marginTop:'15px'}}>🔒 Secured by InsurGig AI Payment Gateway (Demo Mode)</p>
          </>
        )}

        {paymentStep === 'processing' && (
          <div style={{textAlign:'center', padding:'40px 0'}}>
            <div style={{width:'80px', height:'80px', border:'4px solid #e2e8f0', borderTop:'4px solid #021676', borderRadius:'50%', margin:'0 auto 25px auto', animation:'spin 1s linear infinite'}}></div>
            <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', margin:'0 0 10px 0'}}>Processing Payment</h3>
            <p style={{color:'#64748b', fontSize:'14px', margin:0}}>Verifying your {paymentMethod === 'card' ? 'card' : paymentMethod === 'upi' ? 'UPI' : 'wallet'} payment...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {paymentStep === 'success' && (
          <div style={{textAlign:'center', padding:'30px 0'}}>
            <div style={{width:'80px', height:'80px', background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto', fontSize:'40px'}}>✅</div>
            <h3 style={{fontSize:'24px', fontWeight:'900', color:'#166534', margin:'0 0 10px 0'}}>Payment Successful!</h3>
            <p style={{color:'#64748b', fontSize:'14px', margin:'0 0 10px 0'}}>{selectedPlan.name} Plan activated for 7 days.</p>
            <div style={{fontSize:'28px', fontWeight:'900', color:'#021676'}}>₹{selectedPlan.premium}</div>
            <p style={{color:'#94a3b8', fontSize:'12px', marginTop:'15px'}}>Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}
