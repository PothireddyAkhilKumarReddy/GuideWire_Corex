import { useState, useEffect } from 'react'

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'landing';
  });

  useEffect(() => {
    if (currentView) window.location.hash = currentView;
  }, [currentView]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentView(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [role, setRole] = useState('worker')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const protectedRoutes = ['dashboard', 'claims', 'map', 'admin'];
    if (!isLoggedIn && protectedRoutes.includes(currentView)) {
      window.location.hash = 'auth';
      setCurrentView('auth');
    }
  }, [currentView, isLoggedIn]);
  
  // Legacy Demo Logic
  const [formData, setFormData] = useState({ name: '', city: '', zone: 'Zone A' })
  const [results, setResults] = useState({ riskScore: null, weeklyPremium: null, claimStatus: null })
  const [loadingRisk, setLoadingRisk] = useState(false)

  const handleCheckRisk = () => {
    setLoadingRisk(true)
    const data = { risk: "High", premium: 90, claim: "Triggered" }
    setTimeout(() => {
      setResults({ riskScore: data.risk, weeklyPremium: `₹${data.premium}`, claimStatus: data.claim })
      setLoadingRisk(false)
    }, 500)
  }

  const Sidebar = ({ active }) => (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }} style={{cursor:'pointer'}}>
        InsurGig AI
      </div>
      <div className="worker-card">
        <div className="worker-avatar">{role === 'admin' ? '🛡️' : '👤'}</div>
        <div>
          <div style={{fontSize:'12px', fontWeight:'700'}}>{role === 'admin' ? 'Main Admin Node' : 'Worker ID: 8829'}</div>
          <div className="status active" style={{padding:'2px 8px', fontSize:'10px', marginTop:'4px', background:'transparent', border:'none'}}>
            <span className="dot dot-green"></span> {role === 'admin' ? 'Root Access' : 'Protected'}
          </div>
        </div>
      </div>
      <div className="nav-menu">
        {role === 'worker' && <div className={`nav-item ${active === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>❖ Overview</div>}
        <div className={`nav-item ${active === 'claims' ? 'active' : ''}`} onClick={() => setCurrentView('claims')}>📊 Claims AI</div>
        <div className={`nav-item ${active === 'map' ? 'active' : ''}`} onClick={() => setCurrentView('map')}>🗺️ Risk Map</div>
        {role === 'worker' && <div className={`nav-item ${active === 'plans' ? 'active' : ''}`} onClick={() => setCurrentView('plans')}>💳 Plans</div>}
        {role === 'admin' && <div className={`nav-item ${active === 'admin' ? 'active' : ''}`} onClick={() => setCurrentView('admin')}>🛡️ Admin</div>}
      </div>
      <div style={{marginTop: 'auto'}}>
        {role === 'worker' && <button className="btn-primary" style={{width:'100%'}} onClick={() => setCurrentView('plans')}>Upgrade Plan</button>}
      </div>
    </div>
  )

  const renderLanding = () => (
    <div style={{background: 'var(--bg-dark)'}}>
      <nav className="top-nav">
        <div className="nav-brand" style={{cursor:'pointer'}} onClick={() => { setCurrentView('landing'); setRole('worker'); }}>InsurGig AI</div>
        <div className="nav-links">
          <span onClick={() => document.getElementById('demo').scrollIntoView({behavior:'smooth'})} style={{cursor:'pointer'}}>Simulation</span>
          <span onClick={() => setCurrentView('auth')} style={{cursor:'pointer'}}>Intelligence</span>
          <span onClick={() => setCurrentView('plans')} style={{cursor:'pointer', color:'var(--accent-blue)'}}>Pricing</span>
        </div>
        <div className="nav-actions">
          <button className="btn-nav-login" onClick={() => setCurrentView('auth')}>Login</button>
          <button className="btn-primary" onClick={() => setCurrentView('auth')}>Get Started</button>
        </div>
      </nav>

      <section className="hero-sec">
        <div className="badge"><span className="dot dot-green"></span> SYSTEM STATUS: SENTINEL ACTIVE</div>
        <h1>AI-Powered Insurance for<br/><span>Gig Workers</span></h1>
        <p>Predictive protection for the modern gig workforce. Automatic payouts triggered by real-world disruptions like weather, traffic, and AQI—no manual claims required.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => setCurrentView('auth')}>Get Started</button>
          <button className="btn-outline" onClick={() => setCurrentView('auth')}>Login</button>
        </div>
      </section>

      <section style={{textAlign:'center', padding:'60px 20px', background:'#0c121e'}}>
        <div className="flow-grid">
          <div className="flow-card">
            <div className="icon-box">📡</div>
            <h3>Real-time Risk Detection</h3>
            <p>Continuous monitoring of environmental sensors and local data streams to anticipate disruptions before they impact your workflow.</p>
          </div>
          <div className="flow-card">
            <div className="icon-box">💵</div>
            <h3>Automatic Claim Payouts</h3>
            <p>Zero paperwork. Our smart contracts execute payments instantly when threshold conditions are met, ensuring financial liquidity.</p>
          </div>
          <div className="flow-card">
            <div className="icon-box">📍</div>
            <h3>Hyper-local Risk Zones</h3>
            <p>Precision coverage tailored to your exact coordinates. Dynamic pricing based on neighborhood intelligence.</p>
          </div>
        </div>
      </section>

      {/* Legacy Demo Integration */}
      <section className="demo-wrap" id="demo">
        <h2>Explore the <span style={{color:'var(--accent-blue)'}}>Sentinel</span> Interface</h2>
        <p style={{color:'var(--text-muted)', marginBottom:'30px'}}>Experience the power of predictive protection firsthand. Our demo dashboard lets you simulate disruption events.</p>
        <div className="demo-form">
          <label className="sys-label">Worker Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter name" />
          <label className="sys-label">Target City</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Enter city" />
          <label className="sys-label">Deployment Zone</label>
          <select value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})}>
            <option>Zone A</option><option>Zone B</option><option>Zone C</option>
          </select>
          <button className="btn-primary" style={{width:'100%', marginTop:'15px'}} onClick={handleCheckRisk}>
            {loadingRisk ? 'AI Analyzing...' : 'Initialize Risk Simulation'}
          </button>
        </div>

        {results.riskScore && (
          <div style={{marginTop: '30px', padding:'20px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', border:'1px solid var(--border-color)', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px'}}>
            <div>
               <div className="sys-label">Risk Profile</div>
               <div style={{fontSize:'24px', fontWeight:'800', color:'var(--accent-red)'}}>{results.riskScore}</div>
            </div>
            <div>
               <div className="sys-label">Premium Val</div>
               <div style={{fontSize:'24px', fontWeight:'800', color:'var(--accent-blue)'}}>{results.weeklyPremium}</div>
            </div>
            <div>
               <div className="sys-label">Coverage Status</div>
               <div style={{fontSize:'24px', fontWeight:'800', color:'var(--accent-green)'}}>{results.claimStatus}</div>
            </div>
          </div>
        )}
      </section>

    </div>
  )

  const renderPlans = () => (
    <div className={isLoggedIn ? "app-layout" : ""} style={!isLoggedIn ? {background: 'var(--bg-dark)', minHeight: '100vh'} : {}}>
      {isLoggedIn ? <Sidebar active="plans" /> : (
        <nav className="top-nav">
          <div className="nav-brand" style={{cursor:'pointer'}} onClick={() => { setCurrentView('landing'); setRole('worker'); }}>InsurGig AI</div>
          <div className="nav-links">
            <span onClick={() => { setCurrentView('landing'); setTimeout(()=>document.getElementById('demo')?.scrollIntoView({behavior:'smooth'}), 100); }} style={{cursor:'pointer'}}>Simulation</span>
            <span onClick={() => setCurrentView('auth')} style={{cursor:'pointer'}}>Intelligence</span>
            <span onClick={() => setCurrentView('plans')} style={{cursor:'pointer', color:'var(--accent-blue)'}}>Pricing</span>
          </div>
          <div className="nav-actions">
            <button className="btn-nav-login" onClick={() => setCurrentView('auth')}>Login</button>
            <button className="btn-primary" onClick={() => setCurrentView('auth')}>Get Started</button>
          </div>
        </nav>
      )}
      <div className={isLoggedIn ? "main-area" : "public-area"} style={!isLoggedIn ? {padding: '60px 20px', maxWidth: '1200px', margin: '0 auto'} : {}}>
        <div className="dash-header">
           <div>
             <h2>Predictive Protection <span style={{color:'var(--accent-blue)'}}>Pricing</span></h2>
             <p style={{color:'var(--text-muted)', margin:'5px 0 0 0'}}>Dynamic, risk-adjusted coverage for the modern gig workforce. Let our AI calculate your perfect safety net.</p>
           </div>
           <div className="header-actions">
           </div>
        </div>
        <div className="dash-content">
          <div className="pricing-grid" style={{marginTop:'10px', marginBottom:'40px'}}>
           <div className="price-card">
              <h3 style={{fontSize:'20px', margin:'0 0 10px'}}>Basic</h3>
              <div className="price-tag" style={{fontSize:'36px', fontWeight:'800'}}>₹35<span style={{fontSize:'14px', color:'var(--text-muted)'}}>/wk</span></div>
              <p style={{fontSize:'10px', color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', margin:'-15px 0 20px 0'}}>FIXED ENTRY RATE</p>
              <ul className="chk-list" style={{textAlign:'left', fontSize:'13px', marginBottom:'40px'}}>
                <li>Rain & Extreme Heat Protection</li>
                <li>48hr Payout Velocity</li>
                <li>AQI & Traffic Analysis</li>
              </ul>
              <button className="btn-outline" style={{width:'100%', padding:'15px'}} onClick={() => setCurrentView('auth')}>SELECT BASIC</button>
           </div>
           <div className="price-card standard">
              <div className="badge badge-active" style={{position:'absolute', top:'-15px', left:'50%', transform:'translateX(-50%)'}}>MOST PROTECTIVE</div>
              <h3 style={{fontSize:'20px', margin:'0 0 10px'}}>Standard</h3>
              <div className="price-tag" style={{fontSize:'42px', fontWeight:'800'}}>₹60<span style={{fontSize:'14px', color:'var(--text-muted)'}}>/wk</span></div>
              <p style={{fontSize:'10px', color:'var(--accent-blue)', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', margin:'-15px 0 20px 0'}}>AI RECOMMENDED</p>
              <ul className="chk-list" style={{textAlign:'left', fontSize:'13px', marginBottom:'40px'}}>
                <li>Full Environmental Protection</li>
                <li>Instant Payout Approval</li>
                <li>1.5x Trust Score Multiplier</li>
                <li>Live Traffic Rerouting AI</li>
              </ul>
              <button className="btn-primary" style={{width:'100%', padding:'15px'}} onClick={() => setCurrentView('auth')}>GET PROTECTED</button>
           </div>
           <div className="price-card">
              <h3 style={{fontSize:'20px', margin:'0 0 10px'}}>Premium</h3>
              <div className="price-tag" style={{fontSize:'36px', fontWeight:'800'}}>₹90<span style={{fontSize:'14px', color:'var(--text-muted)'}}>/wk</span></div>
              <p style={{fontSize:'10px', color:'var(--accent-red)', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', margin:'-15px 0 20px 0'}}>RISK-ADJUSTED STARTING RATE</p>
              <ul className="chk-list" style={{textAlign:'left', fontSize:'13px', marginBottom:'40px'}}>
                <li>Unlimited Smart Coverage</li>
                <li>Dedicated Safety Concierge</li>
                <li>2.5x Trust Score Multiplier</li>
              </ul>
              <button className="btn-outline" style={{width:'100%', padding:'15px'}} onClick={() => setCurrentView('auth')}>CUSTOMIZE PREMIUM</button>
           </div>
          </div>
          <h2 style={{marginTop:'20px', marginBottom:'30px', fontSize:'24px'}}>Feature Breakdown</h2>
          <div style={{background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:'12px', overflow:'hidden', textAlign:'left'}}>
             <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'20px', borderBottom:'1px solid var(--border-color)', background:'#1f2937', fontSize:'10px', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', color:'var(--text-muted)'}}>
                <div>DISRUPTION ANALYSIS</div><div>BASIC</div><div style={{color:'var(--accent-blue)'}}>STANDARD</div><div>PREMIUM</div>
             </div>
             <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'20px', borderBottom:'1px solid var(--border-color)', fontSize:'14px', alignItems:'center'}}>
                <div style={{color:'var(--text-main)', fontWeight:'600'}}>Rain Protection</div>
                <div style={{color:'var(--accent-green)'}}>✓</div>
                <div style={{color:'var(--accent-green)'}}>✓</div>
                <div style={{color:'var(--accent-green)'}}>✓</div>
             </div>
             <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'20px', borderBottom:'1px solid var(--border-color)', fontSize:'14px', alignItems:'center'}}>
                <div style={{color:'var(--text-main)', fontWeight:'600'}}>Heat & AQI Alerts</div>
                <div style={{color:'var(--accent-red)'}}>✕</div>
                <div style={{color:'var(--accent-blue)'}}>Advanced</div>
                <div style={{color:'var(--text-main)'}}>Real-time</div>
             </div>
             <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'20px', borderBottom:'1px solid var(--border-color)', fontSize:'14px', alignItems:'center'}}>
                <div style={{color:'var(--text-main)', fontWeight:'600'}}>Traffic Congestion</div>
                <div style={{color:'var(--accent-red)'}}>✕</div>
                <div style={{color:'var(--accent-blue)'}}>Included</div>
                <div style={{color:'var(--text-main)'}}>Predictive</div>
             </div>
             <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'20px', borderBottom:'1px solid var(--border-color)', fontSize:'14px', alignItems:'center'}}>
                <div style={{color:'var(--text-main)', fontWeight:'600'}}>Payout Speed</div>
                <div style={{color:'var(--text-muted)'}}>48 Hours</div>
                <div style={{color:'var(--text-main)', fontWeight:'700'}}>Instant</div>
                <div style={{color:'var(--text-main)'}}>Flash Pay</div>
             </div>
             <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'20px', fontSize:'14px', alignItems:'center'}}>
                <div style={{color:'var(--text-main)', fontWeight:'600'}}>Trust-Score Multiplier</div>
                <div style={{color:'var(--text-muted)'}}>1.0x</div>
                <div style={{color:'var(--accent-blue)', fontWeight:'700'}}>1.5x</div>
                <div style={{color:'var(--text-main)', fontWeight:'700'}}>2.5x</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAuth = () => (
    <div className="auth-wrapper">
      <div className="badge" style={{position:'absolute', top:'40px'}}><span style={{color:'var(--accent-blue)'}}>🛡️</span> INSURGIG AI SENTINEL</div>
      <div className="auth-header">
        <h1>InsurGig <span>Secure</span></h1>
        <p>Predictive Identity Verification</p>
      </div>
      <div className="auth-box">
        <button className="auth-google" onClick={() => { setIsLoggedIn(true); setCurrentView('dashboard'); }}>G  Sign in with Google</button>
        <div className="proto-label">SYSTEM PROTOCOL</div>
        <div className="auth-toggle">
          <button className={role === 'worker' ? 'active' : ''} onClick={()=>setRole('worker')}>👤 Worker Login</button>
          <button className={role === 'admin' ? 'active' : ''} onClick={()=>setRole('admin')}>🛡️ Admin / Insurer</button>
        </div>
        <div className="auth-form">
          <label>SYSTEM IDENTIFIER</label>
          <input type="email" placeholder="node_id@insurgig.network" />
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <label>ACCESS KEY</label>
            <label style={{color:'var(--accent-blue)', cursor:'pointer'}}>REQUEST RESET</label>
          </div>
          <input type="password" placeholder="••••••••••••" />
          <button className="btn-auth" onClick={() => {
            if (role === 'admin') setIsLoggedIn(true);
            setCurrentView(role === 'worker' ? 'verify' : 'admin');
          }}>
            Initialize Session →
          </button>
        </div>
        <div className="auth-footer" style={{marginTop:'30px', display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--text-muted)', fontWeight:'700', letterSpacing:'1px'}}>
          <span style={{color:'var(--accent-green)'}}><span className="dot dot-green" style={{display:'inline-block'}}></span> AI SENTINEL ACTIVE</span>
          <span style={{display:'flex', gap:'15px'}}><span>COMPLIANCE</span><span>PRIVACY NODE</span></span>
        </div>
      </div>
    </div>
  )

  const renderVerify = () => (
    <div className="auth-wrapper">
      <div style={{position:'absolute', top:'30px', left:'30px', color:'var(--accent-blue)', fontWeight:'700'}}>InsurGig Secure</div>
      <div style={{width:'100%', maxWidth:'800px'}}>
        <div style={{marginBottom:'30px', borderBottom:'2px solid var(--accent-blue)', paddingBottom:'20px'}}>
          <div style={{fontSize:'12px', color:'var(--text-muted)', fontWeight:'700', letterSpacing:'1px', marginBottom:'10px'}}>STEP 2 OF 2</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
            <h1 style={{margin:0}}>Identity Verification</h1>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'12px', color:'var(--text-muted)'}}>Validation Status</div>
              <div style={{color:'var(--accent-green)', fontWeight:'700'}}>Awaiting Scan</div>
            </div>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:'30px'}}>
          <div className="card">
             <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={{margin:0}}>Scan Gig ID</h3>
                <span className="badge badge-active">LIVE CAMERA</span>
             </div>
             <div style={{height:'200px', background:'#0b0f19', borderRadius:'12px', border:'1px dashed var(--border-color)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'30px', position:'relative'}}>
                <div style={{color:'var(--text-muted)', fontSize:'14px'}}>Center your platform ID within the markers for AI validation.</div>
             </div>
             <div style={{display:'flex', gap:'20px'}}>
                <button className="btn-outline" style={{flex:1}} onClick={() => { setIsLoggedIn(true); setCurrentView('dashboard'); }}>Upload Manual Copy</button>
                <button className="btn-primary" style={{flex:1}} onClick={() => { setIsLoggedIn(true); setCurrentView('dashboard'); }}>Begin Live Scan</button>
             </div>
          </div>
          <div className="card" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
             <div className="sys-label">Predictive Trust Score</div>
             <div className="risk-circle" style={{margin:'30px 0', height:'140px', width:'140px', borderColor:'var(--border-color)', borderTopColor:'var(--accent-green)', borderRightColor:'var(--accent-green)'}}>
                <div className="risk-circle-inner">
                   <h2>320</h2>
                   <span>ESTABLISHING</span>
                </div>
             </div>
             <div style={{width:'100%', background:'#0b0f19', padding:'15px', borderRadius:'8px', display:'flex', justifyContent:'space-between', marginBottom:'10px', border:'1px solid var(--border-color)'}}>
               <span style={{fontSize:'13px', color:'var(--text-muted)'}}>Fraud Probability</span>
               <span style={{fontSize:'13px', color:'var(--accent-green)', fontWeight:'700'}}>Low-Risk</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div className="app-layout">
      <Sidebar active="dashboard" />
      <div className="main-area">
        <div className="dash-header">
           <div>
             <h2>Operational Canvas</h2>
             <p style={{color:'var(--text-muted)', margin:'5px 0 0 0'}}>Predictive risk assessment and active coverage status for your current shift in Central District.</p>
           </div>
           <div className="header-actions">
             <div className="status active"><span className="dot dot-green"></span> Active & Protected</div>
           </div>
        </div>
        <div className="dash-content">
           <div className="ops-canvas-grid">
              <div className="card insight-body">
                 <div className="risk-circle">
                    <div className="risk-circle-inner">
                       <h2>78</h2>
                       <span>RISK SCORE</span>
                    </div>
                 </div>
                 <div>
                    <h3 style={{fontSize:'24px', margin:'0 0 10px 0'}}>Intelligence Insight</h3>
                    <p style={{color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'20px'}}>Your current score is optimal. AI has automatically adjusted your dynamic coverage premium for the next 2 hours.</p>
                    <div style={{display:'flex', gap:'10px'}}>
                       <span className="badge">🌧️ Rainfall: High</span>
                       <span className="badge">💨 AQI: Moderate</span>
                     </div>
                 </div>
              </div>
              <div className="card" style={{display:'flex', flexDirection:'column'}}>
                 <div className="sys-label">ACTIVE ZONE</div>
                 <h3 style={{margin:'0 0 15px 0'}}>Zone B - Central</h3>
                 <div style={{flex:1, background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, #0b0f19 70%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100% 100%, 20px 20px, 20px 20px', borderRadius:'8px', border:'1px solid var(--border-color)', position:'relative', overflow:'hidden', minHeight:'120px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'15px'}}>
                    <div className="dot dot-green" style={{position:'absolute', top:'45%', left:'60%', height:'12px', width:'12px', boxShadow:'0 0 20px 8px rgba(52, 211, 153, 0.4)'}}></div>
                    <div style={{position:'absolute', top:'45%', left:'60%', transform:'translate(-50%, -50%)', width:'30px', height:'30px', borderRadius:'50%', border:'1px solid rgba(52, 211, 153, 0.5)'}}></div>
                    <div style={{position:'absolute', top:'45%', left:'60%', transform:'translate(-50%, -50%)', width:'60px', height:'60px', borderRadius:'50%', border:'1px solid rgba(52, 211, 153, 0.2)'}}></div>
                 </div>
                 <button className="btn-outline" style={{width:'100%'}} onClick={() => setCurrentView('map')}>EXPAND RISK MAP →</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )

  const renderClaims = () => (
    <div className="app-layout">
      <Sidebar active="claims" />
      <div className="main-area">
        <div className="dash-header">
           <div>
             <h2>Claims <span style={{color:'var(--accent-blue)'}}>Intelligence</span></h2>
             <p style={{color:'var(--text-muted)', margin:'5px 0 0 0'}}>Real-time parametric monitoring. Our Sentinel AI detects policy breaches and triggers instant payouts.</p>
           </div>
           <div className="header-actions">
             <div className="status active"><span className="dot dot-green"></span> Operational</div>
           </div>
        </div>
        <div className="dash-content" style={{gridTemplateColumns:'2fr 1fr'}}>
           <div style={{display:'flex', flexDirection:'column', gap:'30px'}}>
              <div className="card">
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'40px'}}>
                    <span className="badge badge-active">LIVE SIMULATION</span>
                    <div style={{textAlign:'right'}}>
                       <div className="sys-label">Simulation ID</div>
                       <div className="mono">SIM-882-XQ</div>
                    </div>
                 </div>
                 <h2 style={{margin:'0 0 40px 0', fontSize:'32px'}}>Event: Urban Flood (Zone A4)</h2>
                 
                 <div style={{background:'rgba(52, 211, 153, 0.05)', border:'1px solid rgba(52, 211, 153, 0.2)', padding:'20px', borderRadius:'12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                       <div className="sys-label" style={{color:'var(--accent-green)'}}>PROJECTED PAYOUT</div>
                       <div style={{fontSize:'32px', fontWeight:'800', color:'white'}}>₹4,000</div>
                    </div>
                    <button className="btn-outline" onClick={() => setCurrentView('dashboard')}>ABORT SIMULATION</button>
                 </div>
              </div>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                 <div className="card">
                    <h3 style={{margin:'0 0 25px 0'}}>Trigger Breakdown</h3>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', borderBottom:'1px solid var(--border-color)', paddingBottom:'15px'}}>
                       <div><div style={{fontWeight:'600'}}>Rainfall Intensity</div></div>
                       <div style={{textAlign:'right', color:'var(--accent-green)', fontWeight:'700'}}>15mm/hr</div>
                    </div>
                 </div>
                 <div className="card">
                    <h3 style={{margin:'0 0 5px 0'}}>Node Analysis</h3>
                    <p style={{fontSize:'12px', color:'var(--text-muted)', margin:'0 0 30px 0'}}>Sentinel verification engine</p>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                       <span className="sys-label">CONFIDENCE</span>
                       <span style={{color:'var(--accent-green)', fontWeight:'700'}}>99.2%</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                 <h3 style={{margin:0}}>Claim History</h3>
              </div>
              <div style={{background:'#0b0f19', border:'1px solid var(--border-color)', borderRadius:'12px', padding:'20px', marginBottom:'20px'}}>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}><span className="sys-label">24 OCT 2023</span><span className="badge badge-green">SETTLED</span></div>
                 <div style={{fontWeight:'700', fontSize:'16px', marginBottom:'15px'}}>Micro-Transport Delay</div>
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                    <div><div className="sys-label">REFERENCE</div><div className="mono" style={{fontSize:'13px'}}>CLM-102-Y</div></div>
                    <div style={{textAlign:'right'}}><div className="sys-label">PAYOUT</div><div style={{fontWeight:'800', fontSize:'18px'}}>₹800</div></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )

  const renderAdmin = () => (
    <div className="app-layout">
      <Sidebar active="admin" />
      <div className="main-area">
        <div className="dash-content">
           <div className="admin-metrics">
              <div className="metric-card">
                 <p>TOTAL ACTIVE COVERAGE</p>
                 <h3 style={{color:'white'}}>₹1300Cr</h3>
                 <span style={{color:'var(--accent-green)', fontSize:'12px', fontWeight:'600'}}>↗ +12.4% from last month</span>
              </div>
              <div className="metric-card">
                 <p>TRIGGERED PAYOUTS (24H)</p>
                 <h3 style={{color:'white'}}>₹8.5L</h3>
                 <span style={{color:'var(--accent-blue)', fontSize:'12px', fontWeight:'600'}}>↺ 42 automated settlements</span>
              </div>
              <div className="metric-card">
                 <p>DETECTED FRAUD ATTEMPTS</p>
                 <h3 style={{color:'var(--accent-red)'}}>1,084</h3>
                 <span style={{color:'var(--accent-red)', fontSize:'12px', fontWeight:'600'}}>⚠ 8.2% increase in malicious activity</span>
              </div>
           </div>
           
           <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'30px'}}>
              <div className="card" style={{display:'flex', flexDirection:'column'}}>
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <div>
                       <h3 style={{margin:'0 0 5px 0'}}>Zone-Level Risk Heatmap</h3>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                       <span className="badge" style={{background:'var(--accent-red)', color:'white', borderColor:'var(--accent-red)'}}>HIGH ALERT</span>
                    </div>
                 </div>
                  <div style={{flex:1, background: 'radial-gradient(circle at 30% 40%, rgba(248, 113, 113, 0.15) 0%, #0b0f19 60%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100% 100%, 30px 30px, 30px 30px', borderRadius:'12px', border:'1px solid var(--border-color)', position:'relative', minHeight:'300px', overflow:'hidden'}}>
                     <div className="dot" style={{position:'absolute', top:'30%', left:'25%', height:'16px', width:'16px', background:'var(--accent-red)', boxShadow:'0 0 30px 10px rgba(248, 113, 113, 0.5)'}}></div>
                     <div className="dot" style={{position:'absolute', top:'60%', left:'70%', height:'12px', width:'12px', background:'#fbbf24', boxShadow:'0 0 20px 8px rgba(251, 191, 36, 0.4)'}}></div>
                     <div className="dot dot-green" style={{position:'absolute', top:'80%', left:'40%', height:'10px', width:'10px', boxShadow:'0 0 15px 5px rgba(52, 211, 153, 0.4)'}}></div>
                     <div style={{position:'absolute', top:'50%', left:'50%', width:'200%', height:'2px', background:'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)', transform:'translate(-50%, -50%) rotate(45deg)', opacity:0.5}}></div>
                     <div style={{position:'absolute', bottom:'15px', right:'15px', color:'var(--text-muted)', fontSize:'10px', fontWeight:'700', letterSpacing:'1px', background:'rgba(0,0,0,0.5)', padding:'4px 8px', borderRadius:'4px'}}>LIVE SENSOR FEED</div>
                  </div>
              </div>
              
              <div className="card">
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
                    <h3 style={{margin:0}}>Claim Activity Feed</h3>
                 </div>
                 
                 <div style={{background:'#0b0f19', border:'1px solid var(--border-color)', borderRadius:'12px', padding:'15px', marginBottom:'15px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                       <span className="sys-label mono" style={{fontSize:'10px', color:'var(--text-muted)'}}>ID: #CLM-9921</span>
                       <span style={{fontSize:'10px', background:'rgba(248,113,113,0.1)', color:'var(--accent-red)', padding:'2px 6px', borderRadius:'4px', border:'1px solid var(--accent-red)'}}>94% FRAUD</span>
                    </div>
                    <div style={{fontWeight:'700', fontSize:'14px', marginBottom:'5px'}}>Device Theft: iPhone 15 Pro</div>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'12px', color:'var(--text-muted)'}}>
                       <span>Location: Neo-Downtown</span>
                       <span style={{color:'white', fontWeight:'700'}}>₹65,000</span>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                       <button className="btn-outline" style={{padding:'8px', flex:1, fontSize:'12px'}}>FLAG</button>
                       <button className="btn-primary" style={{padding:'8px', flex:1, fontSize:'12px', background:'var(--accent-red)', color:'white', boxShadow:'none'}}>REJECT</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )

  const renderMap = () => (
    <div className="app-layout">
      <Sidebar active="map" />
      <div className="main-area" style={{background:'#06090f', position:'relative', padding:'40px'}}>
         <div className="card" style={{background:'rgba(21,27,40,0.8)', backdropFilter:'blur(10px)', marginBottom:'20px', maxWidth:'400px', zIndex:10, position:'relative'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
               <h3 style={{margin:0}}>Risk Overview</h3>
               <span style={{color:'var(--accent-green)'}}>📊</span>
            </div>
            <div className="sys-label">ACTIVE ZONES</div>
            <div style={{fontSize:'48px', fontWeight:'800', color:'var(--accent-blue)', marginBottom:'20px', borderBottom:'2px solid var(--accent-blue)', paddingBottom:'10px', display:'inline-block'}}>12</div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px'}}>
               <div style={{textAlign:'center'}}><div className="sys-label">SAFE</div><div style={{color:'var(--accent-green)', fontWeight:'700', fontSize:'18px'}}>72%</div></div>
               <div style={{textAlign:'center'}}><div className="sys-label">WARNING</div><div style={{color:'#fbbf24', fontWeight:'700', fontSize:'18px'}}>18%</div></div>
               <div style={{textAlign:'center'}}><div className="sys-label">CRITICAL</div><div style={{color:'var(--accent-red)', fontWeight:'700', fontSize:'18px'}}>10%</div></div>
            </div>
            <button className="btn-primary" style={{width:'100%'}} onClick={() => setCurrentView('dashboard')}>GENERATE TACTICAL REPORT</button>
         </div>
         <div style={{position:'absolute', inset:0, background:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px'}}>
            <div className="dot" style={{position:'absolute', top:'20%', left:'30%', height:'24px', width:'24px', background:'var(--accent-red)', boxShadow:'0 0 40px 15px rgba(248, 113, 113, 0.4)'}}></div>
            <div className="dot" style={{position:'absolute', top:'75%', left:'65%', height:'18px', width:'18px', background:'#fbbf24', boxShadow:'0 0 30px 10px rgba(251, 191, 36, 0.4)'}}></div>
            <div className="dot dot-green" style={{position:'absolute', top:'50%', left:'80%', height:'14px', width:'14px', boxShadow:'0 0 20px 8px rgba(52, 211, 153, 0.4)'}}></div>
            <div style={{position:'absolute', top:'45%', left:'45%', width:'300px', height:'300px', borderRadius:'50%', border:'2px dashed rgba(56, 189, 248, 0.2)', transform:'translate(-50%, -50%)'}}></div>
            <div style={{position:'absolute', top:'45%', left:'45%', width:'150px', height:'150px', borderRadius:'50%', border:'1px solid rgba(56, 189, 248, 0.3)', transform:'translate(-50%, -50%)'}}></div>
            <div style={{position:'absolute', bottom:'40px', right:'40px', background:'rgba(0,0,0,0.8)', padding:'20px', borderRadius:'12px', border:'1px solid var(--border-color)', color:'var(--text-muted)', fontSize:'12px'}}>
               <h4 style={{color:'white', margin:'0 0 10px 0'}}>TACTICAL BRIEF</h4>
               <p style={{margin:0}}>Storm cell approaching Zone B.<br/>Payout reserve fully liquid.</p>
            </div>
         </div>
      </div>
    </div>
  )

  return (
    <div className="app-root">
      {currentView === 'landing' && renderLanding()}
      {currentView === 'auth' && renderAuth()}
      {currentView === 'verify' && renderVerify()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'claims' && renderClaims()}
      {currentView === 'admin' && renderAdmin()}
      {currentView === 'map' && renderMap()}
      {currentView === 'plans' && renderPlans()}
    </div>
  )
}
