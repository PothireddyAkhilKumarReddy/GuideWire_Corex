import { useState, useEffect } from 'react'

// Page Components
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import Plans from './pages/Plans'
import Admin from './pages/Admin'
import RiskMap from './pages/RiskMap'
import Chat from './pages/Chat'

// Shared Components
import PaymentModal from './components/PaymentModal'

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
  const [userId, setUserId] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: 'worker@insurgig.network', password: 'secure123' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', city: 'Hyderabad', role: 'worker' })
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
  const [paymentStep, setPaymentStep] = useState('select')
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Claims state
  const [claimForm, setClaimForm] = useState({ name: '', mobile: '', city: 'Hyderabad', location: '', reason: '', description: '' })
  const [claimResult, setClaimResult] = useState(null)
  const [claimHistory, setClaimHistory] = useState([])
  const [claimLoading, setClaimLoading] = useState(false)

  // Fetch Claim History
  useEffect(() => {
    if (isLoggedIn && userId && currentView === 'claims') {
      fetch(`http://127.0.0.1:8000/api/claims/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.history) {
            const fetchedHistory = data.history.map(c => ({
              id: `CLM-${c.id}`, date: new Date(c.created_at).toLocaleDateString('en-IN'),
              reason: 'Parametric Disruption', city: 'Registered City', zone: 'Active Zone',
              payout: c.payout_amount, status: c.claim_status.includes('Fraud') ? 'investigating' : 'approved', riskScore: c.risk_level
            }));
            setClaimHistory(fetchedHistory);
          }
        }).catch(e => console.error("Failed to fetch claims:", e));
    }
  }, [currentView, isLoggedIn, userId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserId(null);
      setSubscription(null);
      setClaimHistory([]);
    }
  }, [isLoggedIn]);

  // Legacy Demo Logic
  const [formData] = useState({ name: '', city: '', location: '' })
  const [results, setResults] = useState({ riskScore: null, weeklyPremium: null, claimStatus: null })
  const [loadingRisk, setLoadingRisk] = useState(false)
  const [coords, setCoords] = useState({ lat: null, lon: null })

  // Initialize live geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.log("Geolocation access denied or unavailable", err)
      );
    }
  }, []);

  const PLANS = [
    { id: 'basic', name: 'Basic', premium: 40, coverage: 700, period: 'week', features: ['Personal Accident Cover', 'WhatsApp Claim Support', 'Hospital Cash Benefit'] },
    { id: 'standard', name: 'Standard', premium: 70, coverage: 1200, period: 'week', features: ['Medical Expense Reimbursement', 'Disability Benefit Included', 'Instant Parametric Approval', 'Priority WhatsApp Support'], recommended: true },
    { id: 'premium', name: 'Premium', premium: 100, coverage: 1700, period: 'week', features: ['Unlimited Dynamic Coverage', 'Dedicated WhatsApp Concierge', 'End-to-End Claim Support'] },
  ]

  // --- Handlers ---

  const handleAuthSubmit = async () => {
    setAuthError('');
    setAuthSuccess('');
    if (!authForm.email || !authForm.email.trim()) { setAuthError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email)) { setAuthError('Please enter a valid email address.'); return; }
    if (!authForm.password || authForm.password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      if (!res.ok) { setAuthError("Access Denied: Invalid Email or Password."); return; }
      const data = await res.json();
      setRole(data.role); 
      setUserId(data.user_id);
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
      if (!res.ok) { setAuthError("Registration Failed: Email might be in use."); return; }
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

  const handleBuyPlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentStep('select');
    setPaymentMethod('card');
    setShowPaymentModal(true);
  }

  const handlePaymentSubmit = async () => {
    setPaymentStep('processing');
    try {
      if (!userId) throw new Error("Not logged in");
      const res = await fetch("http://127.0.0.1:8000/api/plans/select-plan", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user_id: userId, plan_name: selectedPlan.name })
      });
      if (!res.ok) throw new Error("Payment API failed");
      
      setPaymentStep('success');
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      setSubscription({ plan: selectedPlan.name, premium: selectedPlan.premium, coverage: selectedPlan.coverage, expiry: expiry.toLocaleDateString('en-IN'), activatedOn: new Date().toLocaleDateString('en-IN') });
      setTimeout(() => {
        setShowPaymentModal(false);
        setCurrentView('dashboard');
      }, 2000);
    } catch {
      setPaymentStep('select');
      alert("Payment API connection failed. Please ensure backend is running.");
    }
  }

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
        longitude: coords.lon || 78.4867
      };
      const response = await fetch('http://127.0.0.1:8000/api/risk/calculate-risk', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.claim_eligible) {
        const payout = subscription.coverage;
        // CREATE DB RECORD
        const claimRes = await fetch('http://127.0.0.1:8000/api/claims/trigger-claim', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ user_id: userId || 8829, risk_level: data.risk_level, payout_amount: payout })
        });
        const claimData = await claimRes.json();
        
        const newClaim = { id: `CLM-${claimData.claim_id || Date.now()}`, date: new Date().toLocaleDateString('en-IN'), reason: claimForm.reason, city: claimForm.city, location: claimForm.location, payout: claimData.payout, status: claimData.status.includes('Fraud') ? 'investigating' : 'approved', riskScore: data.risk_level };
        setClaimHistory(prev => [newClaim, ...prev]);
        
        if (claimData.status.includes('Fraud')) {
           setClaimResult({ status: 'rejected', riskScore: data.risk_level, message: `Claim halted for fraud review. Trust Score: ${claimData.trust_score}` });
        } else {
           setClaimResult({ status: 'approved', payout, riskScore: data.risk_level, message: `Claim approved! ₹${payout} will be credited within 24 hours.` });
        }
      } else {
        setClaimResult({ status: 'rejected', riskScore: data.risk_level, message: `Claim not eligible. Risk level (${data.risk_level}) is below the threshold for automatic payout. Current conditions in ${claimForm.city} do not meet parametric trigger criteria.` });
      }
    } catch {
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

  const handleCheckRisk = async () => {
    setLoadingRisk(true)
    try {
      const payload = {
        user_id: userId || 8829,
        city: formData.city || "Hyderabad",
        latitude: coords.lat || 17.3850,
        longitude: coords.lon || 78.4867
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

  useEffect(() => {
    const protectedRoutes = ['dashboard', 'claims', 'map', 'admin', 'chat'];
    if (!isLoggedIn && protectedRoutes.includes(currentView)) {
      window.location.hash = 'auth';
       
      setCurrentView('auth');
    }
  }, [currentView, isLoggedIn]);

  return (
    <div className="app-root">
      {currentView === 'landing' && <Landing setCurrentView={setCurrentView} />}
      
      {currentView === 'auth' && (
        <Auth
          role={role} setRole={setRole}
          authMode={authMode} setAuthMode={setAuthMode}
          authForm={authForm} setAuthForm={setAuthForm}
          regForm={regForm} setRegForm={setRegForm}
          authError={authError} authSuccess={authSuccess}
          handleAuthSubmit={handleAuthSubmit} handleRegSubmit={handleRegSubmit}
          setCurrentView={setCurrentView}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard
          subscription={subscription} setCurrentView={setCurrentView}
          setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          results={results} loadingRisk={loadingRisk} handleCheckRisk={handleCheckRisk}
        />
      )}
      
      {currentView === 'claims' && (
        <Claims
          subscription={subscription} setCurrentView={setCurrentView}
          setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          claimForm={claimForm} setClaimForm={setClaimForm}
          claimResult={claimResult} setClaimResult={setClaimResult}
          claimHistory={claimHistory} claimLoading={claimLoading}
          handleSubmitClaim={handleSubmitClaim}
        />
      )}
      
      {currentView === 'admin' && (
        <Admin role={role} setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} setRole={setRole} />
      )}
      
      {currentView === 'map' && (
        <RiskMap role={role} setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} setRole={setRole} />
      )}
      
      {currentView === 'plans' && (
        <Plans
          isLoggedIn={isLoggedIn} setCurrentView={setCurrentView}
          setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          handleBuyPlan={handleBuyPlan} PLANS={PLANS}
        />
      )}
      
      {currentView === 'chat' && (
        <Chat
          role={role} isLoggedIn={isLoggedIn}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          chatMessages={chatMessages} setChatMessages={setChatMessages}
          chatInput={chatInput} setChatInput={setChatInput}
          chatFilter={chatFilter} setChatFilter={setChatFilter}
          handleSendChat={handleSendChat}
        />
      )}

      {/* Payment Modal Overlay */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          selectedPlan={selectedPlan}
          paymentStep={paymentStep}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setShowPaymentModal={setShowPaymentModal}
          handlePaymentSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  )
}
