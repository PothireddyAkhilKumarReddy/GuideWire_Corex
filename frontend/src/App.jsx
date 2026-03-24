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
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: 'worker@insurgig.network', password: 'secure123' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', city: 'Hyderabad', zone: 'Zone A', role: 'worker' })
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  // Chatbox state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'admin', name: 'Support Team', text: 'Welcome to InsurGig AI Support! How can we help you today?', time: '10:00 AM', date: 'Today' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatFilter, setChatFilter] = useState('all')

  // Subscription & Payment state
  const [subscription, setSubscription] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentStep, setPaymentStep] = useState('select') // 'select' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Claims state
  const [claimForm, setClaimForm] = useState({ name: '', mobile: '', city: 'Hyderabad', zone: 'Zone A', reason: '', description: '' })
  const [claimResult, setClaimResult] = useState(null)
  const [claimHistory, setClaimHistory] = useState([])
  const [claimLoading, setClaimLoading] = useState(false)

  const PLANS = [
    { id: 'basic', name: 'Basic', premium: 40, coverage: 700, period: 'week', features: ['Personal Accident Cover', 'WhatsApp Claim Support', 'Hospital Cash Benefit'] },
    { id: 'standard', name: 'Standard', premium: 70, coverage: 1200, period: 'week', features: ['Medical Expense Reimbursement', 'Disability Benefit Included', 'Instant Parametric Approval', 'Priority WhatsApp Support'], recommended: true },
    { id: 'premium', name: 'Premium', premium: 100, coverage: 1700, period: 'week', features: ['Unlimited Dynamic Coverage', 'Dedicated WhatsApp Concierge', 'End-to-End Claim Support'] },
  ]

  const handleAuthSubmit = async () => {
    setAuthError('');
    setAuthSuccess('');
    // Input validation
    if (!authForm.email || !authForm.email.trim()) { setAuthError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email)) { setAuthError('Please enter a valid email address.'); return; }
    if (!authForm.password || authForm.password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      
      if (!res.ok) {
        setAuthError("Access Denied: Invalid Email or Password.");
        return;
      }
      
      const data = await res.json();
      setRole(data.role); 
      setIsLoggedIn(true);
      setCurrentView(data.role === 'admin' ? 'admin' : 'dashboard');
    } catch (e) {
      console.error("Auth Offline:", e);
      setAuthError("Network Error: InsurGig AI Server is currently offline.");
    }
  }

  const handleRegSubmit = async () => {
    setAuthError('');
    setAuthSuccess('');
    // Input validation
    if (!regForm.name || regForm.name.trim().length < 2) { setAuthError('Please enter your full name (at least 2 characters).'); return; }
    if (!regForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) { setAuthError('Please enter a valid email address.'); return; }
    if (!regForm.password || regForm.password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    if (!regForm.city || regForm.city.trim().length < 2) { setAuthError('Please enter your city.'); return; }
    try {
      const payload = { ...regForm, role: role };
      const res = await fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        setAuthError("Registration Failed: Email might be in use.");
        return;
      }
      
      setAuthSuccess("Account created! Please login.");
      setAuthMode('login');
      setAuthForm({...authForm, email: regForm.email, password: regForm.password});
    } catch (e) {
      console.error("Auth Offline:", e);
      setAuthError("Network Error: InsurGig AI Server is currently offline.");
    }
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const newMsg = {
      id: Date.now(),
      sender: role === 'admin' ? 'admin' : 'user',
      name: role === 'admin' ? 'Admin' : 'You',
      text: chatInput.trim(),
      time: timeStr,
      date: 'Today'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    // Auto-reply from support for demo
    if (role !== 'admin') {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'admin',
          name: 'Support Team',
          text: 'Thank you for reaching out! Our team will review your message and get back to you within 24 hours.',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          date: 'Today'
        }]);
      }, 1500);
    }
  }

  // Payment handler
  const handleBuyPlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentStep('select');
    setPaymentMethod('card');
    setShowPaymentModal(true);
  }

  const handlePaymentSubmit = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      setSubscription({ plan: selectedPlan.name, premium: selectedPlan.premium, coverage: selectedPlan.coverage, expiry: expiry.toLocaleDateString('en-IN'), activatedOn: new Date().toLocaleDateString('en-IN') });
      setTimeout(() => {
        setShowPaymentModal(false);
        setCurrentView('dashboard');
      }, 2000);
    }, 2500);
  }

  // Claim submission handler
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
        user_id: 8829,
        city: claimForm.city,
        zone: claimForm.zone,
        rain: claimForm.reason === 'Heavy Rain' ? Math.floor(Math.random() * 60) + 50 : Math.floor(Math.random() * 30),
        heat: claimForm.reason === 'Extreme Heat' ? Math.floor(Math.random() * 10) + 45 : Math.floor(Math.random() * 15) + 25,
        aqi: claimForm.reason === 'Air Pollution' ? Math.floor(Math.random() * 200) + 300 : Math.floor(Math.random() * 150),
        traffic_level: claimForm.reason === 'Traffic Congestion' ? 'severe' : ['light', 'moderate'][Math.floor(Math.random() * 2)]
      };
      const response = await fetch('http://127.0.0.1:8000/api/risk/calculate-risk', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.claim_eligible) {
        const payout = subscription.coverage;
        const newClaim = { id: `CLM-${Date.now().toString(36).toUpperCase()}`, date: new Date().toLocaleDateString('en-IN'), reason: claimForm.reason, city: claimForm.city, zone: claimForm.zone, payout, status: 'approved', riskScore: data.risk_level };
        setClaimHistory(prev => [newClaim, ...prev]);
        setClaimResult({ status: 'approved', payout, riskScore: data.risk_level, message: `Claim approved! ₹${payout} will be credited within 24 hours.` });
      } else {
        setClaimResult({ status: 'rejected', riskScore: data.risk_level, message: `Claim not eligible. Risk level (${data.risk_level}) is below the threshold for automatic payout. Current conditions in ${claimForm.city} do not meet parametric trigger criteria.` });
      }
    } catch (e) {
      // Fallback: simulate locally when backend is offline
      const isHighRisk = ['Heavy Rain', 'Air Pollution', 'Extreme Heat'].includes(claimForm.reason);
      const riskLevel = isHighRisk ? 'High' : 'Medium';
      if (isHighRisk) {
        const payout = subscription.coverage;
        const newClaim = { id: `CLM-${Date.now().toString(36).toUpperCase()}`, date: new Date().toLocaleDateString('en-IN'), reason: claimForm.reason, city: claimForm.city, zone: claimForm.zone, payout, status: 'approved', riskScore: riskLevel };
        setClaimHistory(prev => [newClaim, ...prev]);
        setClaimResult({ status: 'approved', payout, riskScore: riskLevel, message: `Claim approved! ₹${payout} will be credited within 24 hours.` });
      } else {
        setClaimResult({ status: 'rejected', riskScore: riskLevel, message: `Claim not eligible. Risk level (${riskLevel}) is below the threshold. Conditions in ${claimForm.city} are within safe limits.` });
      }
    }
    setClaimLoading(false);
  }

  useEffect(() => {
    const protectedRoutes = ['dashboard', 'claims', 'map', 'admin', 'chat'];
    if (!isLoggedIn && protectedRoutes.includes(currentView)) {
      window.location.hash = 'auth';
      setCurrentView('auth');
    }
  }, [currentView, isLoggedIn]);
  
  // Legacy Demo Logic
  const [formData, setFormData] = useState({ name: '', city: '', zone: 'Zone A' })
  const [results, setResults] = useState({ riskScore: null, weeklyPremium: null, claimStatus: null })
  const [loadingRisk, setLoadingRisk] = useState(false)

  const handleCheckRisk = async () => {
    setLoadingRisk(true)
    try {
      const payload = {
        user_id: 8829,
        city: formData.city || "Hyderabad",
        zone: formData.zone || "Zone A",
        rain: Math.floor(Math.random() * 120),
        heat: Math.floor(Math.random() * 15) + 30,
        aqi: Math.floor(Math.random() * 450),
        traffic_level: ["light", "moderate", "heavy", "severe"][Math.floor(Math.random() * 4)]
      };
      
      const response = await fetch("http://127.0.0.1:8000/api/risk/calculate-risk", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      setResults({ 
        riskScore: data.risk_level, 
        weeklyPremium: `₹${data.recommended_premium}`, 
        claimStatus: data.claim_eligible ? "Triggered" : "Active" 
      });
    } catch (e) {
      console.error("API Integration Offline:", e);
      setResults({ riskScore: "High", weeklyPremium: "₹90", claimStatus: "Fallback Active" });
    }
    setLoadingRisk(false)
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
        <div className={`nav-item ${active === 'chat' ? 'active' : ''}`} onClick={() => setCurrentView('chat')}>💬 Support</div>
      </div>
      <div style={{marginTop: 'auto', display:'flex', flexDirection:'column', gap:'10px'}}>
        {role === 'worker' && <button className="btn-primary" style={{width:'100%'}} onClick={() => setCurrentView('plans')}>Upgrade Plan</button>}
        <button className="btn-outline" style={{width:'100%', fontSize:'12px'}} onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }}>Logout</button>
      </div>
    </div>
  )

  const renderLanding = () => (
    <div style={{background: '#f8fafc', color:'#0f172a', minHeight:'100vh', paddingBottom:'80px', fontFamily:'"Inter", sans-serif', overflowX:'hidden'}}>
      
      {/* Background Blobs */}
      <div style={{position:'absolute', top:'-10%', left:'-10%', width:'500px', height:'500px', background:'rgba(59, 130, 246, 0.15)', filter:'blur(100px)', borderRadius:'50%', zIndex:0}}></div>
      <div style={{position:'absolute', top:'20%', right:'-5%', width:'400px', height:'400px', background:'rgba(2, 22, 118, 0.1)', filter:'blur(120px)', borderRadius:'50%', zIndex:0}}></div>

      <nav style={{display:'flex', justifyContent:'space-between', padding:'20px', alignItems:'center', maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'18px', fontWeight:'900', cursor:'pointer', color:'#021676'}} onClick={() => { setCurrentView('landing'); setRole('worker'); }}>
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
              <div style={{fontSize:'10px', color:'#64748b', fontWeight:'800', letterSpacing:'1px', marginBottom:'15px'}}>LIVE ZONE RISK</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <div>
                    <div style={{fontSize:'24px', fontWeight:'900', color:'#0f172a'}}>Zone A4</div>
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
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', marginBottom:'10px'}}>Register & Choose Zone</h4>
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>Sign up and select your operating delivery zone (e.g., Hyderabad Zone A).</p>
            </div>
            <div style={{padding:'30px'}}>
               <div style={{width:'60px', height:'60px', background:'#f0fdf4', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px auto', fontSize:'24px', fontWeight:'900', color:'#16a34a'}}>2</div>
               <h4 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', marginBottom:'10px'}}>AI Monitors Conditions</h4>
               <p style={{fontSize:'14px', color:'#64748b', lineHeight:'1.6', margin:0}}>Our AI fetches real-time rainfall, temperature, AQI, and traffic data for your zone.</p>
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

  const renderPlans = () => (
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
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'20px', marginBottom:'50px'}}>
          {/* Basic */}
          <div style={{background:'white', borderRadius:'24px', padding:'35px 30px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', position:'relative'}}>
            <h3 style={{fontSize:'20px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Basic</h3>
            <div style={{fontSize:'42px', fontWeight:'900', color:'#0f172a', margin:'0 0 5px 0'}}>₹40<span style={{fontSize:'16px', fontWeight:'600', color:'#94a3b8'}}>/wk</span></div>
            <p style={{fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', margin:'0 0 25px 0'}}>FIXED ENTRY RATE</p>
            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'30px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Personal Accident Cover</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> WhatsApp Claim Support</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Hospital Cash Benefit</div>
            </div>
            <button style={{width:'100%', padding:'16px', background:'white', color:'#021676', border:'2px solid #e2e8f0', borderRadius:'14px', fontSize:'14px', fontWeight:'800', cursor:'pointer'}} onClick={() => isLoggedIn ? handleBuyPlan(PLANS[0]) : setCurrentView('auth')}>SELECT BASIC</button>
          </div>

          {/* Standard */}
          <div style={{background:'#021676', borderRadius:'24px', padding:'35px 30px', color:'white', position:'relative', boxShadow:'0 20px 40px rgba(2, 22, 118, 0.2)', transform:'scale(1.02)'}}>
            <div style={{position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'#3b82f6', color:'white', padding:'6px 16px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px'}}>MOST PROTECTIVE</div>
            <h3 style={{fontSize:'20px', fontWeight:'800', margin:'0 0 8px 0'}}>Standard</h3>
            <div style={{fontSize:'48px', fontWeight:'900', margin:'0 0 5px 0'}}>₹70<span style={{fontSize:'16px', fontWeight:'600', color:'rgba(255,255,255,0.6)'}}>/wk</span></div>
            <p style={{fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.6)', letterSpacing:'1px', margin:'0 0 25px 0'}}>AI RECOMMENDED</p>
            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'30px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Medical Expense Reimbursement</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Disability Benefit Included</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Instant Parametric Approval</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(255,255,255,0.9)'}}><span style={{color:'#34d399'}}>✓</span> Priority WhatsApp Support</div>
            </div>
            <button style={{width:'100%', padding:'16px', background:'white', color:'#021676', border:'none', borderRadius:'14px', fontSize:'14px', fontWeight:'800', cursor:'pointer'}} onClick={() => isLoggedIn ? handleBuyPlan(PLANS[1]) : setCurrentView('auth')}>GET PROTECTED</button>
          </div>

          {/* Premium */}
          <div style={{background:'white', borderRadius:'24px', padding:'35px 30px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', position:'relative'}}>
            <h3 style={{fontSize:'20px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px 0'}}>Premium</h3>
            <div style={{fontSize:'42px', fontWeight:'900', color:'#0f172a', margin:'0 0 5px 0'}}>₹100<span style={{fontSize:'16px', fontWeight:'600', color:'#94a3b8'}}>/wk</span></div>
            <p style={{fontSize:'11px', fontWeight:'700', color:'#ef4444', letterSpacing:'1px', margin:'0 0 25px 0'}}>RISK-ADJUSTED STARTING RATE</p>
            <div style={{display:'flex', flexDirection:'column', gap:'14px', marginBottom:'30px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Unlimited Dynamic Coverage</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> Dedicated WhatsApp Concierge</div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#334155'}}><span style={{color:'#22c55e'}}>✓</span> End-to-End Claim Support</div>
            </div>
            <button style={{width:'100%', padding:'16px', background:'white', color:'#021676', border:'2px solid #e2e8f0', borderRadius:'14px', fontSize:'14px', fontWeight:'800', cursor:'pointer'}} onClick={() => isLoggedIn ? handleBuyPlan(PLANS[2]) : setCurrentView('auth')}>CUSTOMIZE PREMIUM</button>
          </div>
        </div>

        {/* Feature Breakdown Table */}
        <div style={{background:'white', borderRadius:'24px', padding:'30px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', overflow:'hidden'}}>
          <h3 style={{fontSize:'20px', fontWeight:'800', color:'#0f172a', margin:'0 0 25px 0'}}>Feature Breakdown</h3>
          <div style={{overflowX:'auto'}}>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'15px 20px', background:'#f8fafc', borderRadius:'12px', marginBottom:'10px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#64748b'}}>
              <div>COVERAGE</div><div>BASIC</div><div style={{color:'#021676'}}>STANDARD</div><div>PREMIUM</div>
            </div>
            {[
              {name:'Personal Accident Cover', b:'✓', s:'✓', p:'✓'},
              {name:'Medical Reimbursement', b:'✕', s:'Up to ₹1L', p:'Unlimited'},
              {name:'Hospital Cash Benefit', b:'✕', s:'Included', p:'Priority'},
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
      {isLoggedIn && <BottomNav active="plans" />}
    </div>
  )

  const renderAuth = () => (
    <div style={{background: '#f8fafc', color:'#0f172a', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', fontFamily:'"Inter", sans-serif'}}>
       <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'20px', fontWeight:'800', marginBottom:'40px', color:'#021676'}}>
           <span style={{background:'#021676', color:'white', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px'}}>⊞</span> InsurGig AI
       </div>
       
       <div style={{width:'100%', maxWidth:'480px', background:'white', borderRadius:'32px', padding:'50px 40px', boxShadow:'0 20px 60px rgba(0,0,0,0.03)', textAlign:'center', border:'1px solid #f1f5f9'}}>
          <h1 style={{fontSize:'36px', fontWeight:'900', color:'#021676', margin:'0 0 10px 0', lineHeight:'1.1'}}>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p style={{color:'#64748b', fontSize:'15px', marginBottom:'40px', maxWidth:'280px', margin:'0 auto 40px auto', lineHeight:'1.5'}}>{authMode === 'login' ? 'Enter your credentials to access your account.' : 'Join the platform as a new worker.'}</p>
          
          <div style={{display:'flex', background:'#f8fafc', padding:'8px', borderRadius:'16px', marginBottom:'40px', border:'1px solid #e2e8f0'}}>
             <button style={{flex:1, padding:'16px', borderRadius:'12px', border:'none', background: role === 'worker' ? 'white' : 'transparent', color: role === 'worker' ? '#021676' : '#64748b', fontWeight:'800', fontSize:'13px', letterSpacing:'1px', transition:'all 0.3s ease', boxShadow: role === 'worker' ? '0 4px 15px rgba(0,0,0,0.05)' : 'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}} onClick={()=>setRole('worker')}>
                👤 WORKER
             </button>
             <button style={{flex:1, padding:'16px', borderRadius:'12px', border:'none', background: role === 'admin' ? 'white' : 'transparent', color: role === 'admin' ? '#021676' : '#64748b', fontWeight:'800', fontSize:'13px', letterSpacing:'1px', transition:'all 0.3s ease', boxShadow: role === 'admin' ? '0 4px 15px rgba(0,0,0,0.05)' : 'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}} onClick={()=>setRole('admin')}>
                🛡️ ADMIN
             </button>
          </div>

          {authMode === 'login' ? (
             <>
               <div style={{textAlign:'left', marginBottom:'25px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>EMAIL ADDRESS</label>
                  <input type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} placeholder="worker@insurgig.network" style={{width:'100%', padding:'18px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'15px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>

               <div style={{textAlign:'left', marginBottom:'25px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>PASSWORD</label>
                  <input type="password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} placeholder="••••••••••••" style={{width:'100%', padding:'18px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'15px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
                  {authError && <div style={{color:'var(--accent-red)', fontSize:'12px', marginTop:'10px'}}>{authError}</div>}
                  {authSuccess && <div style={{color:'#22c55e', fontSize:'12px', marginTop:'10px'}}>{authSuccess}</div>}
               </div>

               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'40px', fontSize:'13px', fontWeight:'600'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#64748b', cursor:'pointer'}}>
                     <div style={{width:'16px', height:'16px', border:'2px solid #cbd5e1', borderRadius:'4px'}}></div> Remember me
                  </div>
                  <div style={{color:'#021676', cursor:'pointer', fontWeight:'700'}} onClick={() => setAuthMode('register')}>Don't have an account? Sign up</div>
               </div>

               <button style={{width:'100%', background:'#0e24b4', color:'white', border:'none', padding:'20px', borderRadius:'16px', fontSize:'15px', fontWeight:'800', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 15px 30px rgba(14, 36, 180, 0.2)', letterSpacing:'1px'}} onClick={handleAuthSubmit}>
                  LOGIN ⚡
               </button>
             </>
          ) : (
             <>
               <div style={{textAlign:'left', marginBottom:'15px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>FULL NAME</label>
                  <input type="text" value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} placeholder="Ravi Kumar" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>
               
               <div style={{textAlign:'left', marginBottom:'15px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>EMAIL ADDRESS</label>
                  <input type="email" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} placeholder="ravi@insurgig.network" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>

               <div style={{textAlign:'left', marginBottom:'15px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>PASSWORD</label>
                  <input type="password" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} placeholder="••••••••••••" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>
               
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'25px'}}>
                  <div style={{textAlign:'left'}}>
                     <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>CITY</label>
                     <input type="text" value={regForm.city} onChange={(e) => setRegForm({...regForm, city: e.target.value})} placeholder="Hyderabad" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
                  </div>
                  <div style={{textAlign:'left'}}>
                     <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>ZONE</label>
                     <select value={regForm.zone} onChange={(e) => setRegForm({...regForm, zone: e.target.value})} style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'white'}}>
                        <option value="Zone A">Zone A (High Risk)</option>
                        <option value="Zone B">Zone B (Mid Risk)</option>
                        <option value="Zone C">Zone C (Low Risk)</option>
                     </select>
                  </div>
               </div>

               {authError && <div style={{color:'var(--accent-red)', fontSize:'12px', marginBottom:'15px'}}>{authError}</div>}

               <div style={{display:'flex', justifyContent:'center', marginBottom:'30px', fontSize:'13px', fontWeight:'600'}}>
                  <div style={{color:'#64748b', cursor:'pointer'}} onClick={() => setAuthMode('login')}>← Back to Login</div>
               </div>

               <button style={{width:'100%', background:'#0e24b4', color:'white', border:'none', padding:'20px', borderRadius:'16px', fontSize:'15px', fontWeight:'800', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 15px 30px rgba(14, 36, 180, 0.2)', letterSpacing:'1px'}} onClick={handleRegSubmit}>
                  SIGN UP ⚡
               </button>
             </>
          )}

          <div style={{display:'flex', alignItems:'center', margin:'30px 0', gap:'15px'}}>
              <div style={{flex:1, height:'1px', background:'#e2e8f0'}}></div>
              <div style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', textTransform:'uppercase'}}>OR</div>
              <div style={{flex:1, height:'1px', background:'#e2e8f0'}}></div>
          </div>

          <button style={{width:'100%', background:'white', color:'#0f172a', border:'1px solid #cbd5e1', padding:'18px', borderRadius:'16px', fontSize:'15px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', boxShadow:'0 5px 15px rgba(0,0,0,0.02)', transition:'all 0.2s ease'}} onClick={() => alert('Google Auth Simulator: Token injected.')}>
             <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             Continue with Google
          </button>

          <div style={{marginTop:'40px', paddingTop:'40px', borderTop:'1px solid #f1f5f9', fontSize:'12px', color:'#94a3b8', lineHeight:'1.6'}}>
             Secure encrypted connection.<br/>All access is authenticated and monitored.
             
             <div style={{display:'flex', justifyContent:'center', gap:'15px', marginTop:'20px'}}>
                <div style={{width:'24px', height:'24px', background:'#f1f5f9', borderRadius:'50%'}}></div>
                <div style={{width:'24px', height:'24px', background:'#f1f5f9', borderRadius:'50%'}}></div>
                <div style={{width:'24px', height:'24px', background:'#f1f5f9', borderRadius:'50%'}}></div>
             </div>
          </div>
       </div>

       <div style={{marginTop:'30px', background:'white', padding:'12px 24px', borderRadius:'30px', display:'flex', alignItems:'center', gap:'15px', fontSize:'11px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', border:'1px solid #f1f5f9'}}>
          <div style={{display:'flex'}}>
             <div style={{width:'24px', height:'24px', background:'#021676', borderRadius:'50%', border:'2px solid white', zIndex:2}}></div>
             <div style={{width:'24px', height:'24px', background:'#3b82f6', borderRadius:'50%', border:'2px solid white', marginLeft:'-10px', zIndex:1}}></div>
          </div>
          WORKERS ONLINE
          <span style={{color:'#021676'}}>• LIVE SYNC</span>
       </div>
    </div>
  )


  // Bottom Nav Component for mobile-first views
  const BottomNav = ({ active }) => (
    <div style={{position:'fixed', bottom:'30px', left:'50%', transform:'translateX(-50%)', background:'white', padding:'10px 20px', borderRadius:'30px', display:'flex', gap:'15px', boxShadow:'0 20px 60px rgba(0,0,0,0.1)', border:'1px solid #f1f5f9', zIndex:100}}>
       <div onClick={() => setCurrentView('dashboard')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'dashboard' ? '#021676' : 'transparent', color: active === 'dashboard' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🏠</div>
       <div onClick={() => setCurrentView('claims')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'claims' ? '#021676' : 'transparent', color: active === 'claims' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🛡️</div>
       <div onClick={() => setCurrentView('plans')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'plans' ? '#021676' : 'transparent', color: active === 'plans' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>💳</div>
       <div onClick={() => setCurrentView('chat')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'chat' ? '#021676' : 'transparent', color: active === 'chat' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>💬</div>
       <div onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', color:'#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🚪</div>
    </div>
  )

  const renderDashboard = () => (
    <div style={{background: '#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
         <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
               <div style={{width:'44px', height:'44px', background:'#white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
                  <span style={{background:'#021676', color:'white', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', fontSize:'12px'}}>⊞</span>
               </div>
               <div>
                  <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>YOUR DASHBOARD</div>
                  <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Welcome back, Ravi</div>
               </div>
            </div>
            <div onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }} style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', fontSize:'16px'}}>
               🚪
            </div>
         </header>

         <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'20px'}}>
            <div style={{background:'#021676', borderRadius:'24px', padding:'25px', color:'white', boxShadow:'0 15px 30px rgba(2, 22, 118, 0.2)', position:'relative', overflow:'hidden'}}>
               <div style={{position:'absolute', top:0, right:0, width:'100px', height:'100px', background:'rgba(255,255,255,0.1)', borderRadius:'50%', transform:'translate(30%, -30%)'}}></div>
               <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'rgba(255,255,255,0.7)', marginBottom:'10px'}}>{subscription ? 'YOUR PLAN' : 'NO ACTIVE PLAN'}</div>
               {subscription ? (
                 <div>
                   <div style={{fontSize:'24px', fontWeight:'900', letterSpacing:'-1px'}}>{subscription.plan}</div>
                   <div style={{fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'5px'}}>Coverage: ₹{subscription.coverage}</div>
                 </div>
               ) : (
                 <div style={{cursor:'pointer'}} onClick={() => setCurrentView('plans')}>
                   <div style={{fontSize:'16px', fontWeight:'800'}}>Buy a Plan</div>
                   <div style={{fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'5px'}}>Starting at ₹40/week →</div>
                 </div>
               )}
            </div>
            <div style={{background:'white', borderRadius:'24px', padding:'25px', border:'1px solid #e2e8f0', boxShadow:'0 10px 20px rgba(0,0,0,0.03)'}}>
               <div style={{fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#64748b', marginBottom:'10px'}}>RISK COVERAGE</div>
               <div style={{fontSize:'20px', fontWeight:'900', color: subscription ? '#0f172a' : '#94a3b8', display:'flex', alignItems:'center', gap:'10px'}}>
                  {subscription ? 'ACTIVE' : 'INACTIVE'} <div style={{width:'10px', height:'10px', background: subscription ? '#22c55e' : '#ef4444', borderRadius:'50%', boxShadow: subscription ? '0 0 10px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)'}}></div>
               </div>
               {subscription && <div style={{fontSize:'11px', color:'#64748b', marginTop:'8px'}}>Expires: {subscription.expiry}</div>}
            </div>
         </div>

         <div style={{background:'white', borderRadius:'32px', padding:'25px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)', marginBottom:'20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
               <div style={{fontSize:'12px', fontWeight:'800', letterSpacing:'1px', color:'#64748b'}}>YOUR DELIVERY ZONE</div>
               <div style={{fontSize:'12px', fontWeight:'800', color:'#021676', background:'#eff6ff', padding:'6px 12px', borderRadius:'10px'}}>Zone B</div>
            </div>
            
            <div style={{height:'220px', background:'linear-gradient(145deg, #f8fafc, #f1f5f9)', borderRadius:'20px', border:'1px solid #e2e8f0', position:'relative', overflow:'hidden', backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%23e2e8f0\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\'/%3E%3C/svg%3E")'}}>
               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'120px', height:'120px', background:'rgba(59, 130, 246, 0.1)', borderRadius:'50%', animation:'pulse 2s infinite'}}></div>
               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'16px', height:'16px', background:'#3b82f6', borderRadius:'50%', border:'4px solid white', boxShadow:'0 0 20px rgba(59, 130, 246, 0.8)'}}></div>
               
               <div style={{position:'absolute', bottom:'15px', right:'15px', background:'white', padding:'8px 12px', borderRadius:'12px', fontSize:'10px', fontWeight:'800', color:'#0f172a', border:'1px solid #e2e8f0', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                  Hyderabad
               </div>
               
               <div style={{position:'absolute', top:'15px', left:'15px', background:'white', padding:'8px 12px', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                  <button className="btn-primary" style={{padding:'6px 12px', fontSize:'10px'}} onClick={handleCheckRisk}>{loadingRisk ? 'Scanning...' : 'Simulate Risk'}</button>
               </div>
            </div>
            
            {results.riskScore && (
              <div style={{marginTop:'20px', background:'#f8fafc', padding:'15px', borderRadius:'16px', border:'1px solid #e2e8f0'}}>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                    <span style={{fontSize:'12px', fontWeight:'700', color:'#64748b'}}>AI Risk Profile:</span>
                    <span style={{fontSize:'12px', fontWeight:'800', color:'#ef4444'}}>{results.riskScore}</span>
                 </div>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                    <span style={{fontSize:'12px', fontWeight:'700', color:'#64748b'}}>Calculated Premium:</span>
                    <span style={{fontSize:'12px', fontWeight:'800', color:'#021676'}}>{results.weeklyPremium}</span>
                 </div>
                 <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontSize:'12px', fontWeight:'700', color:'#64748b'}}>Claim Status:</span>
                    <span style={{fontSize:'12px', fontWeight:'800', color:'#22c55e'}}>{results.claimStatus}</span>
                 </div>
              </div>
            )}
         </div>

         <div style={{background:'white', borderRadius:'32px', padding:'30px', border:'1px solid #f1f5f9', boxShadow:'0 20px 40px rgba(0,0,0,0.04)'}}>
            <h3 style={{fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 20px 0'}}>Live Weather & Traffic Data</h3>
            
            <div style={{display:'grid', gap:'15px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                     <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>💧</div>
                     <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Humidity</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'800', color:'#3b82f6'}}>82%</div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                     <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>🚗</div>
                     <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Traffic Delay</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'800', color:'#f59e0b'}}>14 mins</div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', background:'#f8fafc', borderRadius:'16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                     <div style={{width:'36px', height:'36px', background:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.02)'}}>🧠</div>
                     <div style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>AI Risk Level</div>
                  </div>
                  <div style={{fontSize:'16px', fontWeight:'800', color:'#ef4444'}}>High Risk</div>
               </div>
            </div>
         </div>
         
      </div>
      <BottomNav active="dashboard" />
    </div>
  )

  const renderClaims = () => (
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
      <BottomNav active="claims" />
    </div>
  )


  const renderAdmin = () => (
    <div className="app-layout">
      <Sidebar active="admin" />
      <div className="main-area" style={{background:'#f8fafc', color:'#0f172a', overflowY:'auto'}}>
        <div className="dash-content" style={{gap:'20px', maxWidth:'600px', margin:'0 auto', padding:'20px', display:'flex', flexDirection:'column'}}>
           
           <div style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
              <div style={{fontSize:'10px', fontWeight:'700', letterSpacing:'1px', color:'#3b82f6', marginBottom:'10px'}}>TOTAL ECOSYSTEM PAYOUT AMOUNT</div>
              <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px'}}>
                 <h1 style={{fontSize:'48px', margin:0, color:'#0f172a'}}>₹1300</h1>
                 <span style={{background:'#eff6ff', color:'#3b82f6', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>↗ 12.4%</span>
              </div>
              <h1 style={{fontSize:'36px', margin:'0 0 30px 0', color:'#94a3b8'}}>Cr</h1>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>24H PAYOUTS</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>₹42.8 Cr</div>
                 </div>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>ACTIVE WORKERS</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>1,842</div>
                 </div>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>AVG. CLAIM TIME</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>1.4s</div>
                 </div>
                 <div>
                    <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', marginBottom:'5px'}}>SYSTEM UPTIME</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#0f172a'}}>99.2%</div>
                 </div>
              </div>
           </div>

           <div style={{background:'#021676', borderRadius:'24px', padding:'30px', color:'white', position:'relative', overflow:'hidden'}}>
              <div style={{position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize:'20px 20px', opacity:0.3}}></div>
              <div style={{fontSize:'10px', fontWeight:'700', letterSpacing:'1px', color:'rgba(255,255,255,0.6)', marginBottom:'5px', position:'relative'}}>NETWORK HEALTH</div>
              <h2 style={{fontSize:'28px', margin:'0 0 40px 0', position:'relative'}}>Optimal</h2>
              
              <div style={{display:'flex', justifyContent:'center', marginBottom:'40px', position:'relative'}}>
                 <div style={{width:'100px', height:'100px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                    <div style={{width:'70px', height:'70px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                       <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                 </div>
              </div>
              
              <button style={{width:'100%', padding:'15px', background:'white', color:'#021676', border:'none', borderRadius:'12px', fontWeight:'700', cursor:'pointer', position:'relative'}}>Generate Report</button>
           </div>

           <div style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                 <div>
                    <h3 style={{margin:'0 0 5px 0', color:'#0f172a', fontSize:'18px'}}>Fraud Detection Radar</h3>
                    <p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Real-time threat vector analysis</p>
                 </div>
                 <div style={{color:'#ef4444', fontSize:'24px'}}>⊗</div>
              </div>
              
              <div style={{height:'200px', border:'1px solid #e2e8f0', borderRadius:'50%', position:'relative', margin:'0 auto', width:'200px', marginBottom:'30px'}}>
                 <div style={{position:'absolute', top:'50%', width:'100%', height:'1px', background:'#e2e8f0'}}></div>
                 <div style={{position:'absolute', left:'50%', height:'100%', width:'1px', background:'#e2e8f0'}}></div>
                 <div style={{position:'absolute', top:'25%', left:'25%', width:'50%', height:'50%', borderRadius:'50%', border:'1px solid #e2e8f0'}}></div>
                 <div style={{position:'absolute', top:'30%', left:'30%', width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', boxShadow:'0 0 10px #ef4444'}}></div>
                 <div style={{position:'absolute', top:'60%', left:'70%', width:'6px', height:'6px', background:'#fca5a5', borderRadius:'50%'}}></div>
                 <div style={{position:'absolute', top:'45%', left:'80%', width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', boxShadow:'0 0 10px #ef4444'}}></div>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', textAlign:'center'}}>
                 <div><div style={{fontSize:'20px', fontWeight:'800', color:'#0f172a'}}>14</div><div style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8'}}>BLOCKED</div></div>
                 <div><div style={{fontSize:'20px', fontWeight:'800', color:'#0f172a'}}>03</div><div style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8'}}>ESCALATED</div></div>
                 <div><div style={{fontSize:'20px', fontWeight:'800', color:'#0f172a'}}>99.8%</div><div style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8'}}>PRECISION</div></div>
              </div>
           </div>

           <div style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px'}}>
                 <div>
                    <h3 style={{margin:'0 0 5px 0', color:'#0f172a', fontSize:'18px'}}>Regional Claims<br/>Density</h3>
                    <p style={{margin:0, fontSize:'12px', color:'#94a3b8'}}>Claim volume by city</p>
                 </div>
                 <div style={{color:'#021676', fontSize:'24px'}}>🌍</div>
              </div>
              <div style={{background:'linear-gradient(to bottom, #4b5563, #1f2937)', height:'200px', borderRadius:'16px', position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end', padding:'15px'}}>
                 <div style={{position:'absolute', top:'20%', left:'20%', width:'20%', height:'20%', background:'rgba(255,255,255,0.1)', borderRadius:'50%'}}></div>
                 <div style={{position:'absolute', top:'50%', right:'30%', width:'30%', height:'30%', background:'rgba(255,255,255,0.05)', borderRadius:'50%'}}></div>
                 <div style={{background:'rgba(255,255,255,0.9)', padding:'10px 15px', borderRadius:'8px', backdropFilter:'blur(5px)'}}>
                    <div style={{fontSize:'9px', fontWeight:'700', color:'#3b82f6', marginBottom:'2px'}}>PEAK REGION</div>
                    <div style={{fontSize:'12px', fontWeight:'700', color:'#0f172a'}}>Hyderabad South</div>
                 </div>
              </div>
           </div>

           <div style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                  <h3 style={{margin:0, color:'#0f172a', fontSize:'18px'}}>Command<br/>Live Stream</h3>
                  <div style={{display:'flex', gap:'5px'}}>
                     <button style={{padding:'6px 12px', background:'#f1f5f9', border:'none', borderRadius:'20px', fontSize:'11px', fontWeight:'600', color:'#0f172a'}}>All Events</button>
                     <button style={{padding:'6px 12px', background:'#f1f5f9', border:'none', borderRadius:'20px', fontSize:'11px', fontWeight:'600', color:'#0f172a'}}>High Risk</button>
                  </div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'15px', paddingBottom:'10px', borderBottom:'1px solid #f1f5f9'}}>
                  <span>TIMESTAMP</span>
                  <span>WORKER ID</span>
               </div>
               
               <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:22:01.04</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0021</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:21:58.12</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0442</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:21:45.92</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0919</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#475569'}}>
                     <span>14:21:32.44</span><span style={{fontWeight:'700', color:'#0f172a'}}>WKR-0002</span>
                  </div>
               </div>
           </div>

           <div style={{background:'white', borderRadius:'24px', padding:'30px', boxShadow:'0 10px 40px rgba(0,0,0,0.05)', marginTop:'20px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <h3 style={{margin:0, color:'#0f172a', fontSize:'18px'}}>Anti-Spoofing & Fraud Review Queue</h3>
                  <div style={{background:'#fef2f2', color:'#ef4444', padding:'6px 12px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px'}}>2 PENDING REVIEW</div>
               </div>
               
               <p style={{fontSize:'12px', color:'#64748b', marginBottom:'25px'}}>Section 15.3.7: Claims flagged by the AI Anti-Spoofing engine (GPS mismatch, device anomalies) require manual human arbitration before PAYOUT AMOUNT release.</p>
               
               <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'20px'}}>
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#0f172a'}}>CLAIM: CLM-A992-TX</span>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#ef4444'}}>FRAUD SCORE: 94%</span>
                     </div>
                     <div style={{fontSize:'12px', color:'#64748b', marginBottom:'15px'}}>
                        <strong>Flag Reason:</strong> Speed velocity anomaly (120km/h) across high-traffic delivery block during rainfall. GPS Spoofing highly probable.
                     </div>
                     <div style={{display:'flex', gap:'10px'}}>
                        <button style={{flex:1, padding:'10px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Reject Claim</button>
                        <button style={{flex:1, padding:'10px', background:'white', color:'#0f172a', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Approve (Override AI)</button>
                     </div>
                  </div>
                  
                  <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'20px'}}>
                     <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#0f172a'}}>CLAIM: CLM-B411-RQ</span>
                        <span style={{fontSize:'12px', fontWeight:'800', color:'#f59e0b'}}>FRAUD SCORE: 76%</span>
                     </div>
                     <div style={{fontSize:'12px', color:'#64748b', marginBottom:'15px'}}>
                        <strong>Flag Reason:</strong> Worker filed two claims in consecutive hours in separate zones (Zone A to Zone C impossible teleportation metrics).
                     </div>
                     <div style={{display:'flex', gap:'10px'}}>
                        <button style={{flex:1, padding:'10px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Reject Claim</button>
                        <button style={{flex:1, padding:'10px', background:'white', color:'#0f172a', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>Approve (Override AI)</button>
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
            <button className="btn-primary" style={{width:'100%'}} onClick={() => setCurrentView('dashboard')}>VIEW DETAILED REPORT</button>
         </div>
         <div style={{position:'absolute', inset:0, background:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px'}}>
            <div className="dot" style={{position:'absolute', top:'20%', left:'30%', height:'24px', width:'24px', background:'var(--accent-red)', boxShadow:'0 0 40px 15px rgba(248, 113, 113, 0.4)'}}></div>
            <div className="dot" style={{position:'absolute', top:'75%', left:'65%', height:'18px', width:'18px', background:'#fbbf24', boxShadow:'0 0 30px 10px rgba(251, 191, 36, 0.4)'}}></div>
            <div className="dot dot-green" style={{position:'absolute', top:'50%', left:'80%', height:'14px', width:'14px', boxShadow:'0 0 20px 8px rgba(52, 211, 153, 0.4)'}}></div>
            <div style={{position:'absolute', top:'45%', left:'45%', width:'300px', height:'300px', borderRadius:'50%', border:'2px dashed rgba(56, 189, 248, 0.2)', transform:'translate(-50%, -50%)'}}></div>
            <div style={{position:'absolute', top:'45%', left:'45%', width:'150px', height:'150px', borderRadius:'50%', border:'1px solid rgba(56, 189, 248, 0.3)', transform:'translate(-50%, -50%)'}}></div>
            <div style={{position:'absolute', bottom:'40px', right:'40px', background:'rgba(0,0,0,0.8)', padding:'20px', borderRadius:'12px', border:'1px solid var(--border-color)', color:'var(--text-muted)', fontSize:'12px'}}>
               <h4 style={{color:'white', margin:'0 0 10px 0'}}>WEATHER ALERT</h4>
               <p style={{margin:0}}>Storm cell approaching Zone B.<br/>Payout reserve fully liquid.</p>
            </div>
         </div>
      </div>
    </div>
  )

  // Chatbox / Support Page
  const renderChatbox = () => (
    <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'700px', margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', cursor:'pointer'}} onClick={() => setCurrentView('dashboard')}>
            <div style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
              <span style={{fontSize:'20px'}}>←</span>
            </div>
            <div>
              <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>SUPPORT</div>
              <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Help & Complaints</div>
            </div>
          </div>
          <div style={{display:'flex', gap:'8px'}}>
            {['all', 'open', 'resolved'].map(f => (
              <button key={f} onClick={() => setChatFilter(f)} style={{padding:'8px 16px', borderRadius:'20px', border: chatFilter === f ? 'none' : '1px solid #e2e8f0', background: chatFilter === f ? '#021676' : 'white', color: chatFilter === f ? 'white' : '#64748b', fontSize:'12px', fontWeight:'700', cursor:'pointer', textTransform:'capitalize'}}>{f}</button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div style={{background:'white', borderRadius:'24px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', overflow:'hidden'}}>
          <div style={{padding:'20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{width:'40px', height:'40px', background:'#021676', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'18px'}}>💬</div>
            <div>
              <div style={{fontSize:'15px', fontWeight:'800', color:'#0f172a'}}>InsurGig AI Support</div>
              <div style={{fontSize:'12px', color:'#22c55e', fontWeight:'600'}}>● Online</div>
            </div>
          </div>

          <div style={{height:'400px', overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'15px', background:'#fafbfc'}}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{display:'flex', flexDirection:'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{fontSize:'10px', color:'#94a3b8', fontWeight:'700', marginBottom:'4px', letterSpacing:'0.5px'}}>{msg.name} • {msg.time}</div>
                <div style={{maxWidth:'80%', padding:'14px 18px', borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.sender === 'user' ? '#021676' : 'white', color: msg.sender === 'user' ? 'white' : '#0f172a', fontSize:'14px', lineHeight:'1.5', border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:'15px 20px', borderTop:'1px solid #f1f5f9', display:'flex', gap:'10px', background:'white'}}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder={role === 'admin' ? 'Reply to this complaint...' : 'Type your message or complaint...'}
              style={{flex:1, padding:'14px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', background:'#f8fafc'}}
            />
            <button onClick={handleSendChat} style={{width:'48px', height:'48px', borderRadius:'14px', background:'#021676', color:'white', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0}}>➤</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{marginTop:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'12px'}}>
          {[
            {icon:'🔧', label:'Claim Issue', msg:'I have an issue with my recent claim payout.'},
            {icon:'📋', label:'Plan Query', msg:'I need help choosing the right insurance plan.'},
            {icon:'⚠️', label:'Report Bug', msg:'I found a bug in the app that needs attention.'},
            {icon:'💰', label:'Payment Help', msg:'I have a question about my premium payment.'},
          ].map((action, i) => (
            <button key={i} onClick={() => { setChatInput(action.msg); }} style={{background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'16px', cursor:'pointer', textAlign:'center', transition:'all 0.2s ease', boxShadow:'0 2px 8px rgba(0,0,0,0.02)'}}>
              <div style={{fontSize:'24px', marginBottom:'8px'}}>{action.icon}</div>
              <div style={{fontSize:'12px', fontWeight:'700', color:'#0f172a'}}>{action.label}</div>
            </button>
          ))}
        </div>
      </div>
      {isLoggedIn && <BottomNav active="chat" />}
    </div>
  )

  return (
    <div className="app-root">
      {currentView === 'landing' && renderLanding()}
      {currentView === 'auth' && renderAuth()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'claims' && renderClaims()}
      {currentView === 'admin' && renderAdmin()}
      {currentView === 'map' && renderMap()}
      {currentView === 'plans' && renderPlans()}
      {currentView === 'chat' && renderChatbox()}

      {/* Payment Modal Overlay */}
      {showPaymentModal && selectedPlan && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px'}}>
          <div style={{background:'white', borderRadius:'32px', padding:'40px', maxWidth:'440px', width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,0.15)', position:'relative'}}>
            
            {paymentStep === 'select' && (
              <>
                <button onClick={() => setShowPaymentModal(false)} style={{position:'absolute', top:'20px', right:'20px', background:'#f1f5f9', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
                
                <div style={{textAlign:'center', marginBottom:'30px'}}>
                  <div style={{width:'56px', height:'56px', background:'#021676', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px auto', color:'white', fontSize:'24px'}}>💳</div>
                  <h2 style={{fontSize:'24px', fontWeight:'900', color:'#0f172a', margin:'0 0 5px 0'}}>Complete Payment</h2>
                  <p style={{color:'#64748b', fontSize:'14px', margin:0}}>{selectedPlan.name} Plan � ₹{selectedPlan.premium}/week</p>
                </div>

                <div style={{background:'#f8fafc', borderRadius:'16px', padding:'20px', marginBottom:'25px', border:'1px solid #e2e8f0'}}>
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
                    <input type="text" placeholder="Card Number" defaultValue="4111 1111 1111 1111" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                      <input type="text" placeholder="MM/YY" defaultValue="12/28" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                      <input type="text" placeholder="CVV" defaultValue="123" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div style={{marginBottom:'25px'}}>
                    <input type="text" placeholder="Enter UPI ID" defaultValue="worker@paytm" style={{width:'100%', padding:'15px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box', background:'#f8fafc'}} />
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
      )}
    </div>
  )
}
