import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const DEMO_CITIES = [
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Vijayawada', lat: 16.5062, lon: 80.6480 },
];

export default function Landing({ setCurrentView }) {
  const [demoCity, setDemoCity] = useState('');
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const runDemo = async (city) => {
    setDemoCity(city.name);
    setDemoLoading(true);
    setDemoResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/risk/calculate-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 0, city: city.name, latitude: city.lat, longitude: city.lon })
      });
      const data = await res.json();
      setDemoResult(data);
    } catch (err) {
      setDemoResult({ error: true });
    }
    setDemoLoading(false);
  };

  return (
    <div style={{background: '#f8fafc', color:'#0f172a', minHeight:'100vh', paddingBottom:'80px', fontFamily:'"Inter", sans-serif', overflowX:'hidden'}}>
      
      {/* Background Blobs */}
      <div style={{position:'absolute', top:'-10%', left:'-10%', width:'500px', height:'500px', background:'rgba(59, 130, 246, 0.15)', filter:'blur(100px)', borderRadius:'50%', zIndex:0}}></div>
      <div style={{position:'absolute', top:'20%', right:'-5%', width:'400px', height:'400px', background:'rgba(2, 22, 118, 0.1)', filter:'blur(120px)', borderRadius:'50%', zIndex:0}}></div>

      <nav style={{display:'flex', justifyContent:'space-between', padding:'20px', alignItems:'center', maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'18px', fontWeight:'900', cursor:'pointer', color:'#021676'}} onClick={() => { setCurrentView('landing'); }}>
           <span style={{background:'#021676', color:'white', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px'}}>⊞</span> InsurGig AI
        </div>
        <div style={{display:'flex', gap:'15px'}}>
           <button style={{background:'white', color:'#021676', border:'1px solid #e2e8f0', padding:'10px 20px', borderRadius:'12px', fontWeight:'800', cursor:'pointer', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}} onClick={() => setCurrentView('plans')}>Pricing</button>
           <button style={{background:'#021676', color:'white', border:'none', padding:'10px 20px', borderRadius:'12px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(2, 22, 118, 0.2)'}} onClick={() => setCurrentView('auth')}>Login</button>
        </div>
      </nav>

      <section className="flow-grid" style={{maxWidth:'1200px', margin:'60px auto', padding:'40px 20px', position:'relative', zIndex:10, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'50px', alignItems:'center'}}>
        {/* Left Side: Hero Text */}
        <div style={{textAlign:'left'}}>
           <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(59, 130, 246, 0.1)', color:'#3b82f6', padding:'8px 16px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', letterSpacing:'1px', marginBottom:'30px', border:'1px solid rgba(59, 130, 246, 0.2)'}}>
              <span className="dot" style={{background:'#3b82f6', width:'8px', height:'8px', borderRadius:'50%', boxShadow:'0 0 10px #3b82f6'}}></span> PROTECTING GIG WORKERS ACROSS INDIA
           </div>
           
           <h1 style={{fontSize:'clamp(46px, 6vw, 64px)', lineHeight:'1.1', fontWeight:'900', letterSpacing:'-2px', margin:'0 0 25px 0', color:'#0f172a'}}>
              The <span style={{color:'#021676'}}>AI-Parametric</span><br/>
              Safety Net For<br/>
              <span style={{background:'linear-gradient(90deg, #3b82f6, #021676)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Gig Workers.</span>
           </h1>
           
           <p style={{fontSize:'18px', lineHeight:'1.8', color:'#64748b', marginBottom:'40px', maxWidth:'600px', margin:'0 auto', paddingBottom:'20px'}}>
             Convert unpredictability into guaranteed income. InsurGig detects rainfall, pollution, and severe traffic in real-time, instantly triggering compensation directly to your original payment mode — with zero paperwork.
           </p>
           
           <div style={{display:'flex', gap:'15px', flexWrap:'wrap'}}>
              <button style={{background:'#021676', color:'white', border:'none', padding:'18px 36px', borderRadius:'16px', fontSize:'16px', fontWeight:'800', cursor:'pointer', boxShadow:'0 15px 30px rgba(2, 22, 118, 0.25)', display:'flex', alignItems:'center', gap:'10px'}} onClick={() => setCurrentView('auth')}>
                 Get Started <span style={{fontSize:'18px', lineHeight:0}}>➔</span>
              </button>
              <button style={{background:'white', color:'#0f172a', border:'1px solid #e2e8f0', padding:'18px 36px', borderRadius:'16px', fontSize:'16px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(0,0,0,0.03)'}} onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>
                 How It Works
              </button>
           </div>
           
           <div style={{marginTop:'50px', display:'flex', alignItems:'center', gap:'20px', fontSize:'13px', fontWeight:'700', color:'#64748b'}}>
              <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                 <span style={{color:'#10b981', fontSize:'16px'}}>✔</span> 1.2M+ Payouts
              </div>
              <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                 <span style={{color:'#10b981', fontSize:'16px'}}>✔</span> Sub-Second Settlement
              </div>
           </div>
        </div>

        {/* Right Side: Hero Visual Cluster */}
        <div style={{position:'relative', height:'500px', display:'flex', alignItems:'center', justifyContent:'center'}}>
           {/* Card 1: Risk Coverage */}
           <div className="floating-card-1 hover-card" style={{position:'absolute', top:'10%', left:'5%', width:'280px', background:'white', borderRadius:'24px', padding:'25px', boxShadow:'0 20px 50px rgba(0,0,0,0.08)', border:'1px solid #f1f5f9', transform:'rotate(-4deg)', zIndex:2, animation:'float 6s ease-in-out infinite'}}>
              <div style={{fontSize:'10px', color:'#64748b', fontWeight:'800', letterSpacing:'1px', marginBottom:'15px'}}>LIVE LOCATION RISK</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <div>
                    <div style={{fontSize:'24px', fontWeight:'900', color:'#0f172a'}}>Madhapur</div>
                    <div style={{fontSize:'12px', color:'#ef4444', fontWeight:'700'}}>Heavy Rainfall 🌧️</div>
                 </div>
                 <div style={{width:'50px', height:'50px', background:'#fef2f2', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444', fontSize:'20px', fontWeight:'900'}}>94</div>
              </div>
           </div>

           {/* Card 2: PAYOUT AMOUNT (Center Main) */}
           <div className="floating-card-2 hover-card" style={{position:'absolute', top:'20%', right:'5%', width:'320px', background:'#021676', borderRadius:'32px', padding:'30px', boxShadow:'0 30px 60px rgba(2, 22, 118, 0.3)', border:'1px solid rgba(255,255,255,0.1)', zIndex:3, backgroundImage:'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 100%)', transform:'rotate(2deg)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                 <div style={{fontSize:'10px', color:'rgba(255,255,255,0.7)', fontWeight:'800', letterSpacing:'1px'}}>NETWORK PAYOUT AMOUNT</div>
                 <div style={{background:'rgba(34, 197, 94, 0.2)', color:'#4ade80', padding:'4px 10px', borderRadius:'10px', fontSize:'10px', fontWeight:'800'}}>+12.4%</div>
              </div>
              <div style={{fontSize:'42px', fontWeight:'900', color:'white', marginBottom:'25px'}}>₹35 Cr</div>
              <div style={{width:'100%', height:'4px', background:'rgba(255,255,255,0.1)', borderRadius:'2px'}}><div style={{width:'74%', height:'100%', background:'#4ade80', borderRadius:'2px', boxShadow:'0 0 10px rgba(34, 197, 94, 0.5)'}}></div></div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'10px', fontWeight:'600'}}>
                 <span>RESERVE HEALTH</span>
                 <span>74% LIQUID</span>
              </div>
           </div>

           {/* Card 3: Payout */}
           <div className="floating-card-3 hover-card" style={{position:'absolute', bottom:'10%', left:'15%', width:'300px', background:'rgba(255, 255, 255, 0.9)', backdropFilter:'blur(20px)', borderRadius:'24px', padding:'25px', boxShadow:'0 25px 50px rgba(0,0,0,0.06)', border:'1px solid white', zIndex:4, transform:'rotate(-1deg)'}}>
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                 <div style={{width:'48px', height:'48px', background:'#dcfce7', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', color:'#16a34a', fontSize:'20px'}}>💸</div>
                 <div>
                    <div style={{fontSize:'13px', color:'#0f172a', fontWeight:'800'}}>Payout Triggered</div>
                    <div style={{fontSize:'11px', color:'#64748b', fontWeight:'600'}}>Loss of Income (Traffic) • 1s ago</div>
                 </div>
                 <div style={{marginLeft:'auto', fontSize:'16px', fontWeight:'900', color:'#16a34a'}}>+₹350</div>
              </div>
           </div>
        </div>
      </section>

      {/* Animated Stats Counter */}
      <section style={{maxWidth:'1100px', margin:'0 auto', padding:'0 20px', position:'relative', zIndex:10}}>
         <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'20px', background:'white', borderRadius:'24px', padding:'40px 30px', boxShadow:'0 20px 50px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9'}}>
            <div style={{textAlign:'center'}}>
               <div style={{fontSize:'36px', fontWeight:'900', color:'#021676', marginBottom:'8px'}}>35,000+</div>
               <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b', letterSpacing:'0.5px'}}>Workers Protected</div>
            </div>
            <div style={{textAlign:'center', borderLeft:'1px solid #e2e8f0'}}>
               <div style={{fontSize:'36px', fontWeight:'900', color:'#10b981', marginBottom:'8px'}}>₹2.5 Cr</div>
               <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b', letterSpacing:'0.5px'}}>Payouts Processed</div>
            </div>
            <div style={{textAlign:'center', borderLeft:'1px solid #e2e8f0'}}>
               <div style={{fontSize:'36px', fontWeight:'900', color:'#3b82f6', marginBottom:'8px'}}>96.4%</div>
               <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b', letterSpacing:'0.5px'}}>ML Confidence</div>
            </div>
            <div style={{textAlign:'center', borderLeft:'1px solid #e2e8f0'}}>
               <div style={{fontSize:'36px', fontWeight:'900', color:'#8b5cf6', marginBottom:'8px'}}>3</div>
               <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b', letterSpacing:'0.5px'}}>Live Public APIs</div>
            </div>
         </div>
      </section>

      {/* Trust & Features Section */}
      <section id="features" style={{maxWidth:'1200px', margin:'100px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10}}>
         <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'30px'}}>
            <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.02)'}}>
               <div style={{width:'50px', height:'50px', background:'#eff6ff', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#3b82f6', fontSize:'24px', marginBottom:'25px'}}>🛡️</div>
               <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>Affordable Coverage</h3>
               <p style={{fontSize:'15px', color:'#64748b', lineHeight:'1.6', margin:0}}>Starts at ₹40/week. Access Personal Accident cover, medical expense reimbursement, and hospital cash benefits alongside parametric payouts.</p>
            </div>
            
            <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.02)'}}>
               <div style={{width:'50px', height:'50px', background:'#f0fdf4', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#22c55e', fontSize:'24px', marginBottom:'25px'}}>📞</div>
               <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>WhatsApp Claims</h3>
               <p style={{fontSize:'15px', color:'#64748b', lineHeight:'1.6', margin:0}}>Submit accident or medical claims instantly via WhatsApp. Zero paperwork. Get AI-accelerated settlements processed in record time.</p>
            </div>
            
            <div className="hover-card" style={{background:'white', borderRadius:'32px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.02)'}}>
               <div style={{width:'50px', height:'50px', background:'#fef2f2', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444', fontSize:'24px', marginBottom:'25px'}}>⚡</div>
               <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>AI-Parametric Truth</h3>
               <p style={{fontSize:'15px', color:'#64748b', lineHeight:'1.6', margin:0}}>Say goodbye to manual adjustors for gig disruptions. We use live API feeds for Weather and Traffic. When risk parameters hit the threshold, funding moves.</p>
            </div>
         </div>
      </section>

      {/* 6 Events Trigger Grid Component */}
      <section style={{background: '#f8fafc', padding: '100px 20px 0 20px'}}>
         <div style={{maxWidth:'1200px', margin:'0 auto', textAlign:'center'}}>
            <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>6 Events That Trigger Automatic Payouts</h2>
            <p style={{fontSize:'16px', color:'#64748b', maxWidth:'600px', margin:'0 auto 50px auto', lineHeight:'1.6'}}>When any threshold is breached in your zone, a claim fires instantly</p>
            
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px', textAlign:'left'}}>
               {/* 1. Heavy Rain */}
               <div className="hover-card" style={{background:'white', borderRadius:'16px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)', display:'flex', gap:'20px', alignItems:'flex-start'}}>
                  <div style={{fontSize:'28px', color:'#3b82f6'}}>🌧️</div>
                  <div>
                     <h4 style={{fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Heavy Rain</h4>
                     <p style={{fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5'}}>Rainfall {">"} 35mm/hr or IMD Red Alert</p>
                  </div>
               </div>

               {/* 2. Extreme Heat */}
               <div className="hover-card" style={{background:'white', borderRadius:'16px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)', display:'flex', gap:'20px', alignItems:'flex-start'}}>
                  <div style={{fontSize:'28px', color:'#ef4444'}}>⚠️</div>
                  <div>
                     <h4 style={{fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Extreme Heat</h4>
                     <p style={{fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5'}}>Temperature {">"} 44°C + heat index {">"} 54°C</p>
                  </div>
               </div>

               {/* 3. Severe AQI */}
               <div className="hover-card" style={{background:'white', borderRadius:'16px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)', display:'flex', gap:'20px', alignItems:'flex-start'}}>
                  <div style={{fontSize:'28px', color:'#8b5cf6'}}>💨</div>
                  <div>
                     <h4 style={{fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Severe AQI</h4>
                     <p style={{fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5'}}>Air Quality Index {">"} 300 (Very Poor)</p>
                  </div>
               </div>

               {/* 4. Compound Event */}
               <div className="hover-card" style={{background:'white', borderRadius:'16px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)', display:'flex', gap:'20px', alignItems:'flex-start'}}>
                  <div style={{fontSize:'28px', color:'#3b82f6'}}>⚡</div>
                  <div>
                     <h4 style={{fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Compound Event</h4>
                     <p style={{fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5'}}>Rain {">"} 20mm/hr AND AQI {">"} 200 together</p>
                  </div>
               </div>

               {/* 5. Flood Alert */}
               <div className="hover-card" style={{background:'white', borderRadius:'16px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)', display:'flex', gap:'20px', alignItems:'flex-start'}}>
                  <div style={{fontSize:'28px', color:'#0ea5e9'}}>🌊</div>
                  <div>
                     <h4 style={{fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Flood Alert</h4>
                     <p style={{fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5'}}>IMD flood bulletin active in pin-code zone</p>
                  </div>
               </div>

               {/* 6. Strike / Curfew */}
               <div className="hover-card" style={{background:'white', borderRadius:'16px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)', display:'flex', gap:'20px', alignItems:'flex-start'}}>
                  <div style={{fontSize:'28px', color:'#f59e0b'}}>👥</div>
                  <div>
                     <h4 style={{fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Strike / Curfew</h4>
                     <p style={{fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5'}}>70%+ worker GPS inactivity confirmed</p>
                  </div>
               </div>
            </div>
            
            <p style={{fontSize:'12px', color:'#ea580c', margin:'40px 0 0 0', fontWeight:'700', letterSpacing:'0.5px'}}>
               ⭐ Compound triggers are unique to InsurGig AI — no other platform detects stacked disruptions.
            </p>
         </div>
      </section>

      <section id="howitworks" style={{maxWidth:'1200px', margin:'100px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10, textAlign:'center'}}>
         <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>How It Works</h2>
         <p style={{fontSize:'16px', color:'#64748b', maxWidth:'500px', margin:'0 auto 50px auto', lineHeight:'1.6'}}>From registration to automatic payout — in 4 simple steps.</p>
         <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'30px', textAlign:'center'}}>
            <div style={{padding:'30px'}}>
               <div style={{width:'60px', height:'60px', background:'#eff6ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto', fontSize:'24px', fontWeight:'900', color:'#021676'}}>1</div>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', marginBottom:'10px'}}>Work Anywhere</h4>
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>Sign up and work dynamically from any location across the city.</p>
            </div>
            <div style={{padding:'30px'}}>
               <div style={{width:'60px', height:'60px', background:'#f0fdf4', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto', fontSize:'24px', fontWeight:'900', color:'#16a34a'}}>2</div>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', marginBottom:'10px'}}>AI Monitors Conditions</h4>
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>Our AI fetches real-time rainfall, temperature, AQI, and traffic data for your exact location.</p>
            </div>
            <div style={{padding:'30px'}}>
               <div style={{width:'60px', height:'60px', background:'#fef2f2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto', fontSize:'24px', fontWeight:'900', color:'#ef4444'}}>3</div>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', marginBottom:'10px'}}>Threshold Breach = Claim</h4>
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>{'When disruption exceeds the threshold (e.g., rainfall > 50mm), a claim triggers automatically.'}</p>
            </div>
            <div style={{padding:'30px'}}>
               <div style={{width:'60px', height:'60px', background:'#f5f3ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto', fontSize:'24px', fontWeight:'900', color:'#7c3aed'}}>4</div>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', marginBottom:'10px'}}>Instant Payout</h4>
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>Compensation is processed and sent directly to your original payment mode — zero paperwork required.</p>
            </div>
         </div>
      </section>

      <section style={{maxWidth:'1200px', margin:'80px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10, textAlign:'center'}}>
         <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>Who We Serve</h2>
         <p style={{fontSize:'16px', color:'#64748b', maxWidth:'500px', margin:'0 auto 40px auto', lineHeight:'1.6'}}>Built for India's gig delivery workforce across all major platforms.</p>
         <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'20px'}}>
            {['Swiggy', 'Zomato', 'Blinkit', 'Zepto', 'UberEats', 'BigBasket'].map(p => (
               <div key={p} className="hover-card" style={{background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'20px 35px', fontSize:'16px', fontWeight:'700', color:'#0f172a', boxShadow:'0 4px 15px rgba(0,0,0,0.03)'}}>{p}</div>
            ))}
         </div>
      </section>

      {/* ===== TRY THE AI LIVE — Interactive Public Demo ===== */}
      <section id="livedemo" style={{maxWidth:'1000px', margin:'100px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10}}>
         <div style={{textAlign:'center', marginBottom:'50px'}}>
            <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(16, 185, 129, 0.1)', color:'#10b981', padding:'8px 16px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', letterSpacing:'1px', marginBottom:'20px', border:'1px solid rgba(16, 185, 129, 0.2)'}}>
               <span style={{background:'#10b981', width:'8px', height:'8px', borderRadius:'50%', boxShadow:'0 0 10px #10b981'}}></span> LIVE DEMO — NO LOGIN REQUIRED
            </div>
            <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>Try the AI Engine Live</h2>
            <p style={{fontSize:'16px', color:'#64748b', maxWidth:'600px', margin:'0 auto', lineHeight:'1.6'}}>Select any Indian city and watch the ML model pull real weather, pollution, and traffic data to calculate a live risk score and dynamic premium.</p>
         </div>

         {/* City Selection Grid */}
         <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'12px', marginBottom:'40px'}}>
            {DEMO_CITIES.map(city => (
               <button key={city.name} onClick={() => runDemo(city)} style={{
                  background: demoCity === city.name ? '#021676' : 'white',
                  color: demoCity === city.name ? 'white' : '#0f172a',
                  border: '1px solid ' + (demoCity === city.name ? '#021676' : '#e2e8f0'),
                  padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: demoCity === city.name ? '0 10px 20px rgba(2,22,118,0.2)' : '0 4px 10px rgba(0,0,0,0.02)'
               }}>{city.name}</button>
            ))}
         </div>

         {/* Loading State */}
         {demoLoading && (
            <div style={{textAlign:'center', padding:'60px 20px'}}>
               <div style={{width:'40px', height:'40px', border:'4px solid #e2e8f0', borderTopColor:'#021676', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 20px auto'}}></div>
               <p style={{fontSize:'14px', color:'#64748b', fontWeight:'600'}}>Pinging OpenWeather, AQI & TomTom Traffic APIs for {demoCity}...</p>
               <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
         )}

         {/* Results Card */}
         {demoResult && !demoResult.error && !demoLoading && (
            <div style={{background:'white', borderRadius:'24px', padding:'40px', boxShadow:'0 20px 50px rgba(0,0,0,0.08)', border:'1px solid #f1f5f9', position:'relative', overflow:'hidden'}}>
               {/* Gradient accent bar */}
               <div style={{position:'absolute', top:0, left:0, right:0, height:'4px', background:'linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6)'}}></div>
               
               <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'30px', flexWrap:'wrap', gap:'15px'}}>
                  <div>
                     <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'8px'}}>AI RISK ANALYSIS FOR</div>
                     <div style={{fontSize:'28px', fontWeight:'900', color:'#0f172a'}}>{demoCity}</div>
                  </div>
                  <div style={{display:'flex', gap:'10px'}}>
                     <div style={{background: demoResult.risk_level === 'High' ? '#fef2f2' : demoResult.risk_level === 'Medium' ? '#fffbeb' : '#f0fdf4', color: demoResult.risk_level === 'High' ? '#ef4444' : demoResult.risk_level === 'Medium' ? '#f59e0b' : '#10b981', padding:'10px 20px', borderRadius:'12px', fontSize:'14px', fontWeight:'800'}}>
                        {demoResult.risk_level} Risk
                     </div>
                     <div style={{background:'#eff6ff', color:'#3b82f6', padding:'10px 20px', borderRadius:'12px', fontSize:'14px', fontWeight:'800'}}>
                        Score: {demoResult.risk_score}
                     </div>
                  </div>
               </div>

               {/* Telemetry Grid */}
               <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'15px', marginBottom:'30px'}}>
                  <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', textAlign:'center'}}>
                     <div style={{fontSize:'12px', fontWeight:'700', color:'#64748b', marginBottom:'8px'}}>🌧️ Rainfall</div>
                     <div style={{fontSize:'22px', fontWeight:'900', color:'#3b82f6'}}>{demoResult.telemetry?.rain || '0.0 mm'}</div>
                  </div>
                  <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', textAlign:'center'}}>
                     <div style={{fontSize:'12px', fontWeight:'700', color:'#64748b', marginBottom:'8px'}}>🚗 Traffic</div>
                     <div style={{fontSize:'22px', fontWeight:'900', color:'#ef4444'}}>{demoResult.telemetry?.traffic || '0.0 / 10'}</div>
                  </div>
                  <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', textAlign:'center'}}>
                     <div style={{fontSize:'12px', fontWeight:'700', color:'#64748b', marginBottom:'8px'}}>💰 Premium</div>
                     <div style={{fontSize:'22px', fontWeight:'900', color:'#10b981'}}>₹{demoResult.recommended_premium}</div>
                  </div>
                  <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', textAlign:'center'}}>
                     <div style={{fontSize:'12px', fontWeight:'700', color:'#64748b', marginBottom:'8px'}}>📊 Discount</div>
                     <div style={{fontSize:'22px', fontWeight:'900', color:'#8b5cf6'}}>{demoResult.discount_reason}</div>
                  </div>
               </div>

               {/* XAI Reason */}
               <div style={{background:'#f0fdf4', borderRadius:'16px', padding:'20px', border:'1px solid #dcfce7'}}>
                  <div style={{fontSize:'12px', fontWeight:'800', color:'#16a34a', letterSpacing:'1px', marginBottom:'8px'}}>🧠 EXPLAINABLE AI REASONING</div>
                  <p style={{fontSize:'15px', color:'#0f172a', fontWeight:'600', margin:0, lineHeight:'1.6'}}>{demoResult.xai_reason}</p>
               </div>
            </div>
         )}

         {/* Error State */}
         {demoResult && demoResult.error && !demoLoading && (
            <div style={{textAlign:'center', padding:'40px', background:'#fef2f2', borderRadius:'16px'}}>
               <p style={{color:'#ef4444', fontWeight:'700'}}>Could not reach the API server. The backend may be waking up — please try again in 30 seconds.</p>
            </div>
         )}
      </section>

      {/* Highly Specific Hackathon FAQ Section */}
      <section style={{maxWidth:'900px', margin:'100px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10}}>
         <div style={{textAlign:'center', marginBottom:'50px'}}>
            <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>Frequently Asked Questions</h2>
            <p style={{fontSize:'16px', color:'#64748b', maxWidth:'600px', margin:'0 auto', lineHeight:'1.6'}}>The core mechanics behind our Parametric ML Engine.</p>
         </div>
         
         <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            {/* FAQ 1 */}
            <div className="hover-card" style={{background:'white', borderRadius:'20px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)'}}>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 12px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color:'#3b82f6'}}>Q.</span> How does the AI differentiate between normal rain and a parametric claim?
               </h4>
               <p style={{fontSize:'15px', color:'#64748b', margin:0, lineHeight:'1.6', paddingLeft:'30px'}}>
                  Our Machine Learning model doesn't just look at rainfall thresholds—it stacks telemetry. We run live OpenWeather and TomTom Traffic API feeds through a SciKit-Learn Random Forest algorithm. If 20mm/hr of rain causes a massive drop in free-flow traffic speed, that complex "compound risk" triggers the payout automatically.
               </p>
            </div>

            {/* FAQ 2 */}
            <div className="hover-card" style={{background:'white', borderRadius:'20px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)'}}>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 12px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color:'#ef4444'}}>Q.</span> What happens if a gig worker spoofs their GPS location?
               </h4>
               <p style={{fontSize:'15px', color:'#64748b', margin:0, lineHeight:'1.6', paddingLeft:'30px'}}>
                  We built a strict "Honor Score" anomaly detection system. Our Python backend cross-references the reported physical geofence against the live API 'actual_city' strings. GPS Spoofing instantly kills the claim probability matrix and permanently flags the account for fraud to protect the capital pool.
               </p>
            </div>

            {/* FAQ 3 */}
            <div className="hover-card" style={{background:'white', borderRadius:'20px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)'}}>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 12px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color:'#10b981'}}>Q.</span> Do workers need to log into the app to file paperwork during a disaster?
               </h4>
               <p style={{fontSize:'15px', color:'#64748b', margin:0, lineHeight:'1.6', paddingLeft:'30px'}}>
                  No. The core definition of Parametric Insurance is "zero-touch workflow". Because we monitor the environmental thresholds algorithmically on our Neon PostgreSQL backend, the funds are mathematically scheduled the exact moment the threshold is breached in the worker's delivery zone.
               </p>
            </div>

            {/* FAQ 4 */}
            <div className="hover-card" style={{background:'white', borderRadius:'20px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 4px 15px rgba(0,0,0,0.02)'}}>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 12px 0', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{color:'#8b5cf6'}}>Q.</span> What if the worker didn't actually lose income today, but the weather was bad?
               </h4>
               <p style={{fontSize:'15px', color:'#64748b', margin:0, lineHeight:'1.6', paddingLeft:'30px'}}>
                  Parametric insurance pays out based exclusively on the <strong style={{color:'#0f172a'}}>event</strong>, not the individual damage assessment. If the flood API threshold is hit in Zone A, every single active gig worker deployed in Zone A receives the capital disbursement unconditionally. No human adjustors required.
               </p>
            </div>
         </div>
      </section>

      <section style={{maxWidth:'800px', margin:'100px auto 40px auto', padding:'60px 20px', background:'#021676', borderRadius:'40px', textAlign:'center', color:'white', position:'relative', overflow:'hidden', boxShadow:'0 30px 60px rgba(2, 22, 118, 0.2)'}}>
         <div style={{position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize:'20px 20px', opacity:0.3}}></div>
         <h2 style={{fontSize:'clamp(32px, 5vw, 42px)', fontWeight:'900', margin:'0 0 20px 0', position:'relative'}}>Ready to Protect Your Income?</h2>
         <p style={{fontSize:'16px', color:'rgba(255,255,255,0.8)', margin:'0 auto 40px auto', maxWidth:'400px', position:'relative', lineHeight:'1.6'}}>Join thousands of gig workers across India who never worry about income loss again.</p>
         <button style={{background:'white', color:'#021676', border:'none', padding:'20px 40px', borderRadius:'16px', fontSize:'16px', fontWeight:'800', cursor:'pointer', position:'relative'}} onClick={() => setCurrentView('auth')}>Get Started Free</button>
      </section>
      
      {/* Footer */}
      <footer style={{borderTop:'1px solid #e2e8f0', padding:'60px 20px 40px 20px', marginTop:'60px', color:'#64748b', fontSize:'14px'}}>
         <div style={{maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:'40px'}}>
            <div style={{maxWidth:'300px'}}>
               <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'20px', fontWeight:'900', color:'#021676', marginBottom:'20px'}}>
                  <span style={{background:'#021676', color:'white', width:'28px', height:'28px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', fontSize:'14px'}}>⊞</span> InsurGig AI
               </div>
               <p style={{lineHeight:'1.6', margin:0}}>The first AI-parametric micro-insurance platform designed specifically for the Indian gig economy.</p>
            </div>
            <div style={{display:'flex', gap:'60px', flexWrap:'wrap'}}>
               <div>
                  <h4 style={{color:'#0f172a', fontWeight:'800', marginBottom:'20px', fontSize:'16px'}}>Product</h4>
                  <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                     <span style={{cursor:'pointer'}} className="hover-link" onClick={() => setCurrentView('plans')}>Coverage Plans</span>
                     <span style={{cursor:'pointer'}} className="hover-link" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>Parametric Engine</span>
                     <span style={{cursor:'pointer'}} className="hover-link">Developer API Docs</span>
                  </div>
               </div>
               <div>
                  <h4 style={{color:'#0f172a', fontWeight:'800', marginBottom:'20px', fontSize:'16px'}}>Company</h4>
                  <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                     <span style={{cursor:'pointer'}} className="hover-link">About Team CoreX</span>
                     <span style={{cursor:'pointer'}} className="hover-link">Careers</span>
                     <span style={{cursor:'pointer'}} className="hover-link">Press & Media</span>
                  </div>
               </div>
               <div>
                  <h4 style={{color:'#0f172a', fontWeight:'800', marginBottom:'20px', fontSize:'16px'}}>Legal</h4>
                  <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                     <span style={{cursor:'pointer'}} className="hover-link">Privacy Policy</span>
                     <span style={{cursor:'pointer'}} className="hover-link">Terms of Service</span>
                     <span style={{cursor:'pointer'}} className="hover-link">IRDAI Disclosure</span>
                  </div>
               </div>
            </div>
         </div>
         <div style={{maxWidth:'1200px', margin:'60px auto 0 auto', paddingTop:'30px', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'20px'}}>
            <span>© 2026 CoreX Technologies. All rights reserved.</span>
            <span>Built exclusively for Guidewire DEVTrails Hackathon</span>
         </div>
      </footer>
      
    </div>
  )
}
