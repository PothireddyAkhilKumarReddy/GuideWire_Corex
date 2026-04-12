import { useState, useEffect } from 'react'

// Dynamic API base
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Page Components
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import Plans from './pages/Plans'
import Chat from './pages/Chat'
import ClaimHistory from './pages/ClaimHistory'
import Analytics from './pages/Analytics'
import Wallet from './pages/Wallet'
import PaymentSuccess from './pages/PaymentSuccess'
import RiskMap from './pages/RiskMap'
import Sidebar from './components/Sidebar'

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

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try { return localStorage.getItem('insurgig_logged_in') === 'true'; } catch { return false; }
  });
  const [userId, setUserId] = useState(() => {
    try { const v = localStorage.getItem('insurgig_user_id'); return v ? parseInt(v) : null; } catch { return null; }
  });
  const [honorScore, setHonorScore] = useState(() => {
    try { const v = localStorage.getItem('insurgig_honor'); return v ? parseFloat(v) : 100.0; } catch { return 100.0; }
  });
  const [profileComplete, setProfileComplete] = useState(() => {
    try { return localStorage.getItem('insurgig_profile_complete') === 'true'; } catch { return false; }
  });
  const [walletBalance, setWalletBalance] = useState(() => {
    try { const v = localStorage.getItem('insurgig_wallet'); return v ? parseFloat(v) : 0; } catch { return 0; }
  });
  const [role, setRole] = useState('worker')

  // Persist critical session state to localStorage
  useEffect(() => {
    localStorage.setItem('insurgig_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);
  useEffect(() => {
    if (userId) localStorage.setItem('insurgig_user_id', userId.toString());
    else localStorage.removeItem('insurgig_user_id');
  }, [userId]);
  useEffect(() => {
    localStorage.setItem('insurgig_honor', honorScore.toString());
  }, [honorScore]);
  useEffect(() => {
    localStorage.setItem('insurgig_profile_complete', profileComplete ? 'true' : 'false');
  }, [profileComplete]);
  useEffect(() => {
    localStorage.setItem('insurgig_wallet', walletBalance.toString());
  }, [walletBalance]);

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

  // ─── Prefetch profile & wallet data once after login ───
  const [cachedProfile, setCachedProfile] = useState(null);
  const [cachedWallet, setCachedWallet] = useState(null);

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetch(`${API_BASE}/api/profile/${userId}`)
        .then(r => r.json()).then(d => {
          setCachedProfile(d);
          if (d.honor_score !== undefined) setHonorScore(d.honor_score);
          if (d.wallet_balance !== undefined) setWalletBalance(d.wallet_balance);
        }).catch(() => {});
      fetch(`${API_BASE}/api/wallet/${userId}`)
        .then(r => r.json()).then(d => {
          setCachedWallet(d);
          if (d.balance !== undefined) setWalletBalance(d.balance);
        }).catch(() => {});
    }
  }, [isLoggedIn, userId]);

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
              payout: c.payout_amount, status: c.claim_status.toLowerCase(), riskScore: c.risk_level,
              xaiReason: c.xai_reason
            }));
            setClaimHistory(fetchedHistory);
          }
        }).catch(e => console.error("Failed to fetch claims:", e));
    }
  }, [isLoggedIn, userId]);

  // Cleanup is now handled by handleLogout instead of an effect,
  // because persisted state would cause a loop on page reload.

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
    { id: 'basic', name: 'Basic', premium: 100, coverage: 800, period: 'week', features: ['Weather Risk Auto-Trigger', 'WhatsApp Claim Alerts', 'Basic Payout Protection'] },
    { id: 'standard', name: 'Standard', premium: 150, coverage: 1400, period: 'week', features: ['Weather + Traffic + AQI Triggers', 'Instant Parametric Payouts', 'AI Risk Monitoring 24/7', 'Priority Claim Processing'], recommended: true },
    { id: 'premium', name: 'Premium', premium: 200, coverage: 1800, period: 'week', features: ['All Environmental Triggers', 'Highest Coverage Limit', 'Dedicated Claim Support', 'Minor Accident Telematics'] },
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
      
      if (claimData.honor_score !== undefined) setHonorScore(claimData.honor_score);
      if (claimData.wallet_balance !== undefined) setWalletBalance(claimData.wallet_balance);
      
      const newClaim = { id: `CLM-${claimData.claim_id || Date.now()}`, date: new Date().toLocaleDateString('en-IN'), reason: "Automated System Trigger", city: data.telemetry?.city || "Auto", location: "Live Geo", payout: claimData.payout, status: parsedStatus, riskScore: data.risk_level, xaiReason: data.xai_reason || 'Smart Contract Triggered' };
      setClaimHistory(prev => [newClaim, ...prev]);
      
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

  // Redirect to profile setup if not complete, or to auth if not logged in
  useEffect(() => {
    const protectedRoutes = ['dashboard', 'claims', 'chat', 'analytics', 'wallet', 'plans', 'history', 'profile-setup'];
    // payment-success is NOT protected — Stripe redirects here after a full page reload
    if (!isLoggedIn && protectedRoutes.includes(currentView)) {
      setCurrentView('auth');
    }
  }, [currentView, isLoggedIn, profileComplete]);

  // Helper to determine if we should show portal layout
  const isPortalActive = isLoggedIn && !['landing', 'auth'].includes(currentView);

  const handleLogout = () => {
    // Clear all persisted session state
    setIsLoggedIn(false);
    setUserId(null);
    setSubscription(null);
    setClaimHistory([]);
    setProfileComplete(false);
    setWalletBalance(0);
    setHonorScore(100.0);
    localStorage.removeItem('insurgig_logged_in');
    localStorage.removeItem('insurgig_user_id');
    localStorage.removeItem('insurgig_honor');
    localStorage.removeItem('insurgig_profile_complete');
    localStorage.removeItem('insurgig_wallet');
    localStorage.removeItem('insurgig_sub');
    localStorage.removeItem('insurgig_name');
    setCurrentView('landing');
  };

  return (
    <div style={{background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#0f172a'}}>
      {isPortalActive && (
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          userName={userName}
          handleLogout={handleLogout}
        />
      )}
      
      <div style={isPortalActive ? {marginLeft: '256px', minHeight: '100vh'} : {}}>
        {currentView === 'landing' && <Landing setCurrentView={setCurrentView} />}
        
        {currentView === 'auth' && (
          <Auth
          setUserId={setUserId} setUserName={setUserName}
          setSubscription={setSubscription} setHonorScore={setHonorScore}
          setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView}
          setProfileComplete={setProfileComplete} setWalletBalance={setWalletBalance}
        />
      )}
      
      {currentView === 'profile-setup' && (
        <ProfileSetup
          userId={userId} userName={userName}
          setProfileComplete={setProfileComplete} setCurrentView={setCurrentView}
          cachedProfile={cachedProfile} setCachedProfile={setCachedProfile}
          honorScore={honorScore}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard
          coords={coords} userName={userName} claimHistory={claimHistory}
          subscription={subscription} setCurrentView={setCurrentView}
          setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          results={results} loadingRisk={loadingRisk} handleCheckRisk={handleCheckRisk}
          handleZeroTouchOracle={handleZeroTouchOracle} oracleStatus={oracleStatus} setOracleStatus={setOracleStatus}
          honorScore={honorScore} walletBalance={walletBalance} profileComplete={profileComplete}
        />
      )}
      
      {currentView === 'claims' && (
        <Claims
          coords={coords} results={results}
          subscription={subscription} setSubscription={setSubscription}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          userId={userId} setClaimHistory={setClaimHistory} setHonorScore={setHonorScore}
          setWalletBalance={setWalletBalance}
        />
      )}
      
      {currentView === 'map' && (
        <RiskMap
          coords={coords}
          results={results}
          setCurrentView={setCurrentView} 
          setIsLoggedIn={setIsLoggedIn}
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
      
      {currentView === 'plans' && (
        <Plans
          isLoggedIn={isLoggedIn} setCurrentView={setCurrentView}
          setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          userId={userId} setSubscription={setSubscription} PLANS={PLANS}
          profileComplete={profileComplete}
        />
      )}
      
      {currentView === 'chat' && (
        <Chat
          isLoggedIn={isLoggedIn}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
        />
      )}
      
      {currentView === 'analytics' && (
        <Analytics
          userId={userId}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
        />
      )}
      
      {currentView === 'wallet' && (
        <Wallet
          userId={userId}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole}
          profileComplete={profileComplete}
          cachedWallet={cachedWallet} setCachedWallet={setCachedWallet}
          walletBalance={walletBalance} setWalletBalance={setWalletBalance}
        />
      )}
      
      {currentView === 'payment-success' && (
        <PaymentSuccess
          setSubscription={setSubscription}
          setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn}
        />
      )}
      </div>
    </div>
  )
}
