export default function Landing({ setCurrentView }) {
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

      <section style={{maxWidth:'1200px', margin:'60px auto', padding:'40px 20px', position:'relative', zIndex:10, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:'50px', alignItems:'center'}}>
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
           
           <p style={{fontSize:'18px', color:'#64748b', maxWidth:'480px', margin:'0 0 40px 0', lineHeight:'1.6'}}>
             Convert unpredictability into guaranteed income. InsurGig detects rainfall, pollution, and severe traffic in real-time, instantly triggering compensation directly to your wallet — with zero paperwork.
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
           <div style={{position:'absolute', top:'10%', left:'5%', width:'280px', background:'white', borderRadius:'24px', padding:'25px', boxShadow:'0 20px 50px rgba(0,0,0,0.08)', border:'1px solid #f1f5f9', transform:'rotate(-4deg)', zIndex:2, animation:'float 6s ease-in-out infinite'}}>
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
           <div style={{position:'absolute', top:'20%', right:'5%', width:'320px', background:'#021676', borderRadius:'32px', padding:'30px', boxShadow:'0 30px 60px rgba(2, 22, 118, 0.3)', border:'1px solid rgba(255,255,255,0.1)', zIndex:3, backgroundImage:'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 100%)', transform:'rotate(2deg)'}}>
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
           <div style={{position:'absolute', bottom:'10%', left:'15%', width:'300px', background:'rgba(255, 255, 255, 0.9)', backdropFilter:'blur(20px)', borderRadius:'24px', padding:'25px', boxShadow:'0 25px 50px rgba(0,0,0,0.06)', border:'1px solid white', zIndex:4, transform:'rotate(-1deg)'}}>
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

      {/* Trust & Features Section */}
      <section id="features" style={{maxWidth:'1200px', margin:'100px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10}}>
         <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'30px'}}>
            <div style={{background:'white', borderRadius:'32px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.02)'}}>
               <div style={{width:'50px', height:'50px', background:'#eff6ff', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#3b82f6', fontSize:'24px', marginBottom:'25px'}}>🛡️</div>
               <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>Affordable Coverage</h3>
               <p style={{fontSize:'15px', color:'#64748b', lineHeight:'1.6', margin:0}}>Starts at ₹40/week. Access Personal Accident cover, medical expense reimbursement, and hospital cash benefits alongside parametric payouts.</p>
            </div>
            
            <div style={{background:'white', borderRadius:'32px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.02)'}}>
               <div style={{width:'50px', height:'50px', background:'#f0fdf4', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#22c55e', fontSize:'24px', marginBottom:'25px'}}>📞</div>
               <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>WhatsApp Claims</h3>
               <p style={{fontSize:'15px', color:'#64748b', lineHeight:'1.6', margin:0}}>Submit accident or medical claims instantly via WhatsApp. Zero paperwork. Get AI-accelerated settlements processed in record time.</p>
            </div>
            
            <div style={{background:'white', borderRadius:'32px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.02)'}}>
               <div style={{width:'50px', height:'50px', background:'#fef2f2', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444', fontSize:'24px', marginBottom:'25px'}}>⚡</div>
               <h3 style={{fontSize:'22px', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>AI-Parametric Truth</h3>
               <p style={{fontSize:'15px', color:'#64748b', lineHeight:'1.6', margin:0}}>Say goodbye to manual adjustors for gig disruptions. We use live API feeds for Weather and Traffic. When risk parameters hit the threshold, funding moves.</p>
            </div>
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
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>Compensation is processed and sent directly to your wallet — zero paperwork required.</p>
            </div>
         </div>
      </section>

      <section style={{maxWidth:'1200px', margin:'80px auto 0 auto', padding:'0 20px', position:'relative', zIndex:10, textAlign:'center'}}>
         <h2 style={{fontSize:'clamp(28px, 4vw, 36px)', fontWeight:'900', color:'#0f172a', marginBottom:'15px'}}>Who We Serve</h2>
         <p style={{fontSize:'16px', color:'#64748b', maxWidth:'500px', margin:'0 auto 40px auto', lineHeight:'1.6'}}>Built for India's gig delivery workforce across all major platforms.</p>
         <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'20px'}}>
            {['Swiggy', 'Zomato', 'Blinkit', 'Zepto', 'UberEats', 'BigBasket'].map(p => (
               <div key={p} style={{background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'20px 35px', fontSize:'16px', fontWeight:'700', color:'#0f172a', boxShadow:'0 4px 15px rgba(0,0,0,0.03)'}}>{p}</div>
            ))}
         </div>
      </section>

      <section style={{maxWidth:'800px', margin:'100px auto 40px auto', padding:'60px 20px', background:'#021676', borderRadius:'40px', textAlign:'center', color:'white', position:'relative', overflow:'hidden', boxShadow:'0 30px 60px rgba(2, 22, 118, 0.2)'}}>
         <div style={{position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize:'20px 20px', opacity:0.3}}></div>
         <h2 style={{fontSize:'clamp(32px, 5vw, 42px)', fontWeight:'900', margin:'0 0 20px 0', position:'relative'}}>Ready to Protect Your Income?</h2>
         <p style={{fontSize:'16px', color:'rgba(255,255,255,0.8)', margin:'0 auto 40px auto', maxWidth:'400px', position:'relative', lineHeight:'1.6'}}>Join thousands of gig workers across India who never worry about income loss again.</p>
         <button style={{background:'white', color:'#021676', border:'none', padding:'20px 40px', borderRadius:'16px', fontSize:'16px', fontWeight:'800', cursor:'pointer', position:'relative'}} onClick={() => setCurrentView('auth')}>Get Started Free</button>
      </section>
      
    </div>
  )
}
