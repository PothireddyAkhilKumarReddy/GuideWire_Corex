import BottomNav from '../components/BottomNav'
import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Plans({ isLoggedIn, setCurrentView, setIsLoggedIn, setRole, handleBuyPlan, PLANS }) {
  const [priceMultiplier, setPriceMultiplier] = useState(1.0);
  const [discountReason, setDiscountReason] = useState("Loading Risk Profile...");
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          console.log("Geolocation access denied or unavailable", err);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coords.lat && coords.lon) {
      const payload = {
        user_id: 0,
        city: 'Auto',
        claim_reason: 'Pricing Assessment',
        latitude: coords.lat,
        longitude: coords.lon
      };
      
      fetch(`${API_BASE}/api/risk/calculate-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.price_multiplier) {
           setPriceMultiplier(data.price_multiplier);
           setDiscountReason(data.discount_reason);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Pricing API Error:", e);
        setIsLoading(false);
      });
    }
  }, [coords]);

  // Utility to round and calculate the dynamic price
  const calculatePrice = (base) => {
    return Math.round(base * priceMultiplier);
  };

  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'900px', margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'40px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', cursor:'pointer'}} onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'landing')}>
            <div style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
              <span style={{background:'#021676', color:'white', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', fontSize:'12px'}}>⊞</span>
            </div>
            <div>
              <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>PLANS & PRICING</div>
              <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Choose Your Coverage</div>
            </div>
          </div>
          {!isLoggedIn && <button style={{background:'#021676', color:'white', border:'none', padding:'12px 24px', borderRadius:'12px', fontWeight:'800', cursor:'pointer', fontSize:'13px'}} onClick={() => setCurrentView('auth')}>Login</button>}
        </header>

        <div style={{textAlign:'center', marginBottom:'50px'}}>
          <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', margin:'0 0 10px 0'}}>Predictive Protection Pricing</h2>
          <p style={{fontSize:'16px', color:'#64748b', margin:0, lineHeight:'1.6'}}>Dynamic, risk-adjusted coverage for India's gig workforce.</p>
          <div style={{marginTop: '15px', display: 'inline-block', background: priceMultiplier < 1 ? '#dcfce7' : (priceMultiplier > 1 ? '#fee2e2' : '#f1f5f9'), padding: '10px 20px', borderRadius: '30px', border: `1px solid ${priceMultiplier < 1 ? '#22c55e' : (priceMultiplier > 1 ? '#ef4444' : '#cbd5e1')}`}}>
            <span style={{fontSize: '13px', fontWeight: '800', color: priceMultiplier < 1 ? '#15803d' : (priceMultiplier > 1 ? '#b91c1c' : '#475569')}}>🤖 AI PRICING ENGINE: {discountReason}</span>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'20px', marginBottom:'50px', opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s'}}>
          {/* Basic */}
          <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'35px 30px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', position:'relative'}}>
            <h3 style={{fontSize:'20px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Basic</h3>
            <div style={{fontSize:'42px', fontWeight:'900', color:'#0f172a', margin:'0 0 5px 0'}}>
              {priceMultiplier !== 1.0 && <span style={{fontSize:'22px', textDecoration:'line-through', color:'#cbd5e1', marginRight:'8px'}}>₹40</span>}
              ₹{calculatePrice(40)}<span style={{fontSize:'16px', fontWeight:'600', color:'#94a3b8'}}>/wk</span>
            </div>
            <p style={{fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', margin:'0 0 25px 0'}}>DYNAMIC BASE RATE</p>
            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'30px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Personal Accident Cover</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> WhatsApp Claim Support</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Hospital Cash Benefit</div>
            </div>
            <button style={{width:'100%', padding:'16px', background:'white', color:'#021676', border:'2px solid #e2e8f0', borderRadius:'14px', fontSize:'14px', fontWeight:'800', cursor:'pointer'}} onClick={() => isLoggedIn ? handleBuyPlan({...PLANS[0], premium: calculatePrice(40)}) : setCurrentView('auth')}>SELECT BASIC</button>
          </div>

          {/* Standard */}
          <div className="hover-card" style={{background:'#021676', borderRadius:'24px', padding:'35px 30px', color:'white', position:'relative', boxShadow:'0 20px 40px rgba(2, 22, 118, 0.2)', transform:'scale(1.02)'}}>
            <div style={{position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'#3b82f6', color:'white', padding:'6px 16px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px'}}>MOST PROTECTIVE</div>
            <h3 style={{fontSize:'20px', fontWeight:'800', margin:'0 0 8px 0'}}>Standard</h3>
            <div style={{fontSize:'48px', fontWeight:'900', margin:'0 0 5px 0'}}>
              {priceMultiplier !== 1.0 && <span style={{fontSize:'24px', textDecoration:'line-through', color:'rgba(255,255,255,0.4)', marginRight:'8px'}}>₹70</span>}
              ₹{calculatePrice(70)}<span style={{fontSize:'16px', fontWeight:'600', color:'rgba(255,255,255,0.6)'}}>/wk</span>
            </div>
            <p style={{fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.6)', letterSpacing:'1px', margin:'0 0 25px 0'}}>AI RECOMMENDED</p>
            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'30px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Medical Expense Reimbursement</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Disability Benefit Included</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Instant Parametric Approval</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Priority WhatsApp Support</div>
            </div>
            <button style={{width:'100%', padding:'16px', background:'white', color:'#021676', border:'none', borderRadius:'14px', fontSize:'14px', fontWeight:'800', cursor:'pointer'}} onClick={() => isLoggedIn ? handleBuyPlan({...PLANS[1], premium: calculatePrice(70)}) : setCurrentView('auth')}>GET PROTECTED</button>
          </div>

          {/* Premium */}
          <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'35px 30px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', position:'relative'}}>
            <h3 style={{fontSize:'20px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Premium</h3>
            <div style={{fontSize:'42px', fontWeight:'900', color:'#0f172a', margin:'0 0 5px 0'}}>
              {priceMultiplier !== 1.0 && <span style={{fontSize:'22px', textDecoration:'line-through', color:'#cbd5e1', marginRight:'8px'}}>₹100</span>}
              ₹{calculatePrice(100)}<span style={{fontSize:'16px', fontWeight:'600', color:'#94a3b8'}}>/wk</span>
            </div>
            <p style={{fontSize:'11px', fontWeight:'700', color:'#ef4444', letterSpacing:'1px', margin:'0 0 25px 0'}}>RISK-ADJUSTED STARTING RATE</p>
            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'30px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Unlimited Dynamic Coverage</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Dedicated WhatsApp Concierge</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> End-to-End Claim Support</div>
            </div>
            <button style={{width:'100%', padding:'16px', background:'white', color:'#021676', border:'2px solid #e2e8f0', borderRadius:'14px', fontSize:'14px', fontWeight:'800', cursor:'pointer'}} onClick={() => isLoggedIn ? handleBuyPlan({...PLANS[2], premium: calculatePrice(100)}) : setCurrentView('auth')}>CUSTOMIZE PREMIUM</button>
          </div>
        </div>

        {/* Feature Breakdown Table */}
        <div className="hover-card" style={{background:'white', borderRadius:'24px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', overflow:'hidden'}}>
          <h3 style={{fontSize:'20px', fontWeight:'800', color:'#0f172a', margin:'0 0 25px 0'}}>Feature Breakdown</h3>
          <div style={{overflowX:'auto'}}>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'15px 20px', background:'#f8fafc', borderRadius:'12px', marginBottom:'10px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#64748b'}}>
              <div>COVERAGE</div><div>BASIC</div><div style={{color:'#021676'}}>STANDARD</div><div>PREMIUM</div>
            </div>
            {[
              {name:'Personal Accident Cover', b:'✓', s:'✓', p:'✓'},
              {name:'Medical Reimbursement', b:'✕', s:'Up to ₹1L', p:'Unlimited'},
              {name:'Hospital Cash Benefit', b:'✓', s:'Included', p:'Priority'},
              {name:'WhatsApp Claims', b:'Standard', s:'Instant', p:'Concierge'},
              {name:'AI Parametric Engine', b:'1.0x', s:'1.5x', p:'Unlimited'},
            ].map((row, i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'15px 20px', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none', fontSize:'14px', alignItems:'center'}}>
                <div style={{color:'#0f172a', fontWeight:'600'}}>{row.name}</div>
                <div style={{color: row.b === '✓' ? '#22c55e' : (row.b === '✕' ? '#ef4444' : '#64748b')}}>{row.b}</div>
                <div style={{color: row.s === '✓' ? '#22c55e' : '#021676', fontWeight:'600'}}>{row.s}</div>
                <div style={{color: row.p === '✓' ? '#22c55e' : '#0f172a', fontWeight:'600'}}>{row.p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isLoggedIn && <BottomNav active="plans" setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
    </div>
  )
}
