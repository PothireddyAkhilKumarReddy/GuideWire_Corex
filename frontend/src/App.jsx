import { useState, useEffect } from 'react'

// Dynamic API base — reads from Vite env var on production (Vercel), falls back to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Page Components
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import Plans from './pages/Plans'
import Admin from './pages/Admin'
import RiskMap from './pages/RiskMap'
import Chat from './pages/Chat'
import ClaimHistory from './pages/ClaimHistory'
import Analytics from './pages/Analytics'

// App Boot
export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname.replace('/', '');
    return path || 'landing';
  });

  useEffect(() => {
    const targetPath = currentView === 'landing' ? '/' : `/${currentView}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      setCurrentView(path || 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [role, setRole] = useState('worker')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [honorScore, setHonorScore] = useState(100.0)
  // Decentralized state hooks

  // Subscription & Payment state
  const [subscription, setSubscription] = useState(() => {
    try {
      const saved = localStorage.getItem('insurgig_sub');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (subscription) localStorage.setItem('insurgig_sub', JSON.stringify(subscription));
    else localStorage.removeItem('insurgig_sub');
  }, [subscription]);

  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('insurgig_name') || 'Worker';
    } catch { return 'Worker'; }
  });

  useEffect(() => {
    localStorage.setItem('insurgig_name', userName);
  }, [userName]);
  const [claimHistory, setClaimHistory] = useState([])

  // Fetch Claim History
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetch(`${API_BASE}/api/claims/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.history) {
            const fetchedHistory = data.history.map(c => ({
              id: `CLM-${c.id}`, date: new Date(c.created_at).toLocaleDateString('en-IN'),
              reason: c.reason || 'Parametric Trigger', city: c.city || 'Unknown', zone: 'Active Zone',
              payout: c.payout_amount, status: c.claim_status.toLowerCase(), riskScore: c.risk_level
            }));
            setClaimHistory(fetchedHistory);
          }
        }).catch(e => console.error("Failed to fetch claims:", e));
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserId(null);
      setSubscription(null);
      setClaimHistory([]);
    }
  }, [isLoggedIn]);

  // Active Configuration
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
    { id: 'standard', name: 'Standard', premium: 70, coverage: 1000, period: 'week', features: ['Medical Expense Reimbursement', 'Disability Benefit Included', 'Instant Parametric Approval', 'Priority WhatsApp Support'], recommended: true },
    { id: 'premium', name: 'Premium', premium: 100, coverage: 1300, period: 'week', features: ['Unlimited Dynamic Coverage', 'Dedicated WhatsApp Concierge', 'End-to-End Claim Support'] },
  ]



  const [oracleStatus, setOracleStatus] = useState(null);

  const handleZeroTouchOracle = async () => {
    if (!subscription) return;
    setOracleStatus('scanning');
    
    try {
      const payload = {
        user_id: userId || 8829,
        city: "Auto",
        latitude: coords.lat || 17.3850,
        longitude: coords.lon || 78.4867,
        claim_reason: "Automated System Trigger"
      };
      
      const response = await fetch(`${API_BASE}/api/risk/calculate-risk`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
      });
      const data = await response.json();
      const payout = subscription.coverage;
      
      if (data.risk_level === 'Low' || data.risk_level === 'Medium') {
          setOracleStatus('safe');
          return;
      }
      
      const claimRes = await fetch(`${API_BASE}/api/claims/trigger-claim`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user_id: userId || 8829, risk_level: data.risk_level, payout_amount: payout, reason: "Automated System Payload", city: "Auto", xai_reason: data.xai_reason })
      });
      const claimData = await claimRes.json();
      const parsedStatus = claimData.status === 'Rejected' ? 'rejected' : (claimData.status.includes('Fraud') ? 'investigating' : 'approved');
      
      // Update Honor Score from auto-claim response
      if (claimData.honor_score !== undefined) {
        setHonorScore(claimData.honor_score);
      }
      
      const newClaim = { id: `CLM-${claimData.claim_id || Date.now()}`, date: new Date().toLocaleDateString('en-IN'), reason: "Automated System Trigger", city: data.telemetry?.city || "Auto", location: "Live Geo", payout: claimData.payout, status: parsedStatus, riskScore: data.risk_level, xaiReason: data.xai_reason || 'Smart Contract Triggered' };
      setClaimHistory(prev => [newClaim, ...prev]);
      
      // Update global Dashboard AI Risk status
      setResults(prev => prev ? { ...prev, riskScore: data.risk_level, claimStatus: "Triggered" } : null);
      setOracleStatus('triggered');
    } catch (e) {
      console.error(e);
      setOracleStatus('error');
    }
  }

  const handleCheckRisk = async () => {
    setLoadingRisk(true)
    try {
      const payload = {
        user_id: userId || 8829,
        city: "Auto",
        latitude: coords.lat || 17.3850,
        longitude: coords.lon || 78.4867
      };
      const response = await fetch(`${API_BASE}/api/risk/calculate-risk`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResults({ 
        riskScore: data.risk_level, 
        weeklyPremium: `₹${data.recommended_premium.toFixed(0)}`, 
        claimStatus: data.claim_eligible ? "Triggered" : "Active",
        telemetry: data.telemetry
      });
    } catch (e) {
      console.error("API Integration Offline:", e);
      setResults({ riskScore: "High", weeklyPremium: "₹90", claimStatus: "Fallback Active" });
    }
    setLoadingRisk(false)
  }

  useEffect(() => {
    const protectedRoutes = ['dashboard', 'claims', 'map', 'admin', 'chat', 'analytics'];
    if (!isLoggedIn && protectedRoutes.includes(currentView)) {
      setCurrentView('auth');
    }
  }, [currentView, isLoggedIn]);

  return (
    <div className="app-root">
      {currentView === 'landing' && <Landing setCurrentView={setCurrentView} />}
      
      {currentView === 'auth' && (
        <Auth
          role={role} setRole={setRole}
          setUserId={setUserId} setUserName={setUserName}
          setSubscription={setSubscription} setHonorScore={setHonorScore}
          setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard
          coords={coords} userName={userName} claimHistory={claimHistory}
          subscription={subscription} setCurrentView={setCurrentView}
          setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          results={results} loadingRisk={loadingRisk} handleCheckRisk={handleCheckRisk}
          handleZeroTouchOracle={handleZeroTouchOracle} oracleStatus={oracleStatus} setOracleStatus={setOracleStatus}
          honorScore={honorScore}
        />
      )}
      
      {currentView === 'claims' && (
        <Claims
          coords={coords} results={results}
          subscription={subscription} setSubscription={setSubscription}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          userId={userId} setClaimHistory={setClaimHistory} setHonorScore={setHonorScore}
        />
      )}
      
      {currentView === 'history' && (
        <ClaimHistory 
          claimHistory={claimHistory} 
          setCurrentView={setCurrentView} 
          setIsLoggedIn={setIsLoggedIn} 
          setRole={setRole} 
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
          userId={userId} setSubscription={setSubscription} PLANS={PLANS}
        />
      )}
      
      {currentView === 'chat' && (
        <Chat
          role={role} isLoggedIn={isLoggedIn}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
        />
      )}
      
      {currentView === 'analytics' && (
        <Analytics
          userId={userId}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
        />
      )}
    </div>
  )
}
