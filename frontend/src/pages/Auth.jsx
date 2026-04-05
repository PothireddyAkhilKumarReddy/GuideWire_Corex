import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, MapPin } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Auth({ setUserId, setUserName, setSubscription, setHonorScore, setIsLoggedIn, setCurrentView, setProfileComplete, setWalletBalance }) {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', city: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple media queries handled via state/window width or pure CSS flex wrapping
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
  const isMobile = windowWidth < 1024;

  const handleAuthSubmit = async () => {
    setAuthError('');
    setAuthSuccess('');
    if (!authForm.email || !authForm.email.trim()) { setAuthError('Email is required.'); return; }
    if (!authForm.password) { setAuthError('Password is required.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      if (!res.ok) { setAuthError("Invalid Email or Password."); return; }
      const data = await res.json();
      setUserId(data.user_id);
      setUserName(data.name || 'Worker');
      setSubscription(data.subscription || null);
      if (data.honor_score !== undefined) setHonorScore(data.honor_score);
      if (setProfileComplete) setProfileComplete(data.profile_complete || false);
      if (setWalletBalance) setWalletBalance(data.wallet_balance || 0);

      setIsLoggedIn(true);
      setCurrentView('dashboard');
    } catch (e) {
      setAuthError("Network Error. Server is offline.");
    }
    setLoading(false);
  }

  const handleRegSubmit = async () => {
    setAuthError('');
    setAuthSuccess('');
    if (!regForm.name || !regForm.email || !regForm.password || !regForm.city) { 
      setAuthError('All fields are required.'); 
      return; 
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ ...regForm, role: 'worker' })
      });
      if (!res.ok) { setAuthError("Registration Failed. Email might exist."); return; }
      setAuthSuccess("Account created! Please login.");
      setAuthMode('login');
      setAuthForm({ email: regForm.email, password: regForm.password });
    } catch (e) {
      setAuthError("Network Error. Server is offline.");
    }
    setLoading(false);
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true); setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      if (!res.ok) { setAuthError("Google Sign-in failed."); setLoading(false); return; }
      const data = await res.json();
      setUserId(data.user_id);
      setUserName(data.name || 'Worker');
      setSubscription(data.subscription || null);
      if (data.honor_score !== undefined) setHonorScore(data.honor_score);
      if (setProfileComplete) setProfileComplete(data.profile_complete || false);
      if (setWalletBalance) setWalletBalance(data.wallet_balance || 0);

      setIsLoggedIn(true);
      setCurrentView('dashboard');
    } catch (e) {
      setAuthError("Network Error.");
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#f8fafc', fontFamily:'"Inter", sans-serif'}}>
      
      {/* Left Side: Branding & Illustration */}
      {!isMobile && (
        <div style={{width:'50%', background:'#2563eb', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px', color:'white', position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0.1, pointerEvents:'none', backgroundImage:'radial-gradient(circle at 20% 150%, white 0%, transparent 50%)'}}></div>
          
          <div style={{position:'relative', zIndex:10}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'24px', fontWeight:'700', letterSpacing:'-0.5px', marginBottom:'64px', cursor:'pointer'}} onClick={() => setCurrentView('landing')}>
              <div style={{width:'40px', height:'40px', background:'white', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563eb', fontWeight:'900', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}>⊞</div>
              InsurGig <span style={{fontWeight:'300'}}>AI</span>
            </div>

            <h1 style={{fontSize:'48px', fontWeight:'900', lineHeight:'1.1', marginBottom:'24px', marginTop:'40px'}}>
              The Financial<br/>Safety Net for<br/>Gig Workers.
            </h1>
            <p style={{color:'#dbeafe', fontSize:'18px', maxWidth:'400px', lineHeight:'1.6'}}>
              Instant parametric payouts, dynamically priced coverage, and AI-driven protection against daily operational risks.
            </p>
          </div>

          {/* Live Payout Visualization */}
          <div style={{position:'relative', zIndex:10, background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'24px', padding:'24px', marginTop:'48px', maxWidth:'400px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
              <span style={{fontSize:'12px', fontWeight:'700', letterSpacing:'1px', color:'#bfdbfe'}}>LIVE SYSTEM ACTIVITY</span>
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <div style={{width:'8px', height:'8px', background:'#34d399', borderRadius:'50%'}}></div>
                <span style={{fontSize:'12px', color:'white'}}>Secure</span>
              </div>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'12px', border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>🌧️</div>
                    <div>
                       <div style={{fontSize:'14px', fontWeight:'700'}}>Auto-Claim Triggered</div>
                       <div style={{fontSize:'12px', color:'#bfdbfe'}}>Mumbai • Heavy Rain</div>
                    </div>
                  </div>
                  <div style={{color:'#34d399', fontWeight:'700'}}>+₹1,450</div>
               </div>
               
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'12px', border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>🚦</div>
                    <div>
                       <div style={{fontSize:'14px', fontWeight:'700'}}>Coverage Active</div>
                       <div style={{fontSize:'12px', color:'#bfdbfe'}}>Delhi • Urban Strike</div>
                    </div>
                  </div>
                  <div style={{color:'#bfdbfe', fontWeight:'700'}}>Protected</div>
               </div>
            </div>
          </div>

          <div style={{position:'relative', zIndex:10, fontSize:'14px', fontWeight:'500', color:'#bfdbfe', marginTop:'48px'}}>
            © 2026 InsurGig AI Intelligence Network
          </div>
        </div>
      )}

      {/* Right Side: Auth Form */}
      <div style={{width: isMobile ? '100%' : '50%', display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? '24px' : '48px'}}>
        <div style={{width:'100%', maxWidth:'450px'}}>
          
          {/* Mobile Only Logo */}
          {isMobile && (
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'12px', fontSize:'24px', fontWeight:'700', letterSpacing:'-0.5px', marginBottom:'40px', color:'#0f172a', cursor:'pointer'}} onClick={() => setCurrentView('landing')}>
              <div style={{width:'40px', height:'40px', background:'#2563eb', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'900', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}>⊞</div>
              InsurGig <span style={{fontWeight:'300', color:'#2563eb'}}>AI</span>
            </div>
          )}

          <div style={{background:'white', borderRadius:'32px', padding: isMobile ? '32px' : '40px', boxShadow:'0 8px 30px rgba(0,0,0,0.04)', border:'1px solid #f1f5f9'}}>
            <h2 style={{fontSize:'24px', fontWeight:'900', color:'#0f172a', marginBottom:'8px'}}>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{fontSize:'14px', color:'#64748b', marginBottom:'32px'}}>
              {authMode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Join the platform as a protected independent professional.'}
            </p>

            {authMode === 'login' ? (
              <form onSubmit={e => { e.preventDefault(); handleAuthSubmit(); }} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                <div>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px'}}>EMAIL ADDRESS</label>
                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}><Mail size={18} /></div>
                    <input type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                           style={{width:'100%', padding:'12px 16px 12px 40px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box'}} 
                           placeholder="name@example.com" />
                  </div>
                </div>

                <div>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px'}}>PASSWORD</label>
                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}><Lock size={18} /></div>
                    <input type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                           style={{width:'100%', padding:'12px 16px 12px 40px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box'}} 
                           placeholder="••••••••" />
                  </div>
                </div>

                {authError && <div style={{color:'#ef4444', fontSize:'12px', fontWeight:'600'}}>{authError}</div>}
                {authSuccess && <div style={{color:'#10b981', fontSize:'12px', fontWeight:'600'}}>{authSuccess}</div>}

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'8px 0 16px 0'}}>
                  <label style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', fontWeight:'600', color:'#64748b', cursor:'pointer'}}>
                    <input type="checkbox" style={{borderRadius:'4px', accentColor:'#2563eb'}} /> Remember me
                  </label>
                  <button type="button" onClick={() => setAuthMode('register')} style={{fontSize:'12px', fontWeight:'700', color:'#2563eb', background:'none', border:'none', cursor:'pointer'}}>
                    Create account
                  </button>
                </div>

                <button type="submit" disabled={loading} 
                        style={{width:'100%', padding:'14px', background:'#0f172a', color:'white', borderRadius:'12px', fontSize:'14px', fontWeight:'700', border:'none', cursor: loading ? 'wait' : 'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', boxShadow:'0 10px 25px rgba(15,23,42,0.2)'}}>
                  {loading ? 'Authenticating...' : 'Enter Dashboard →'}
                </button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleRegSubmit(); }} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                <div>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px'}}>FULL NAME</label>
                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}><User size={18} /></div>
                    <input type="text" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} 
                           style={{width:'100%', padding:'12px 16px 12px 40px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box'}} 
                           placeholder="John Doe" />
                  </div>
                </div>

                <div>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px'}}>EMAIL ADDRESS</label>
                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}><Mail size={18} /></div>
                    <input type="email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} 
                           style={{width:'100%', padding:'12px 16px 12px 40px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box'}} 
                           placeholder="name@example.com" />
                  </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                  <div>
                    <label style={{display:'block', fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px'}}>PASSWORD</label>
                    <div style={{position:'relative'}}>
                      <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}><Lock size={18} /></div>
                      <input type="password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} 
                             style={{width:'100%', padding:'12px 16px 12px 40px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box'}} 
                             placeholder="••••••••" />
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block', fontSize:'12px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px'}}>CITY</label>
                    <div style={{position:'relative'}}>
                      <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}><MapPin size={18} /></div>
                      <input type="text" value={regForm.city} onChange={e => setRegForm({...regForm, city: e.target.value})} 
                             style={{width:'100%', padding:'12px 16px 12px 40px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box'}} 
                             placeholder="Mumbai" />
                    </div>
                  </div>
                </div>
                
                {authError && <div style={{color:'#ef4444', fontSize:'12px', fontWeight:'600'}}>{authError}</div>}

                <div style={{display:'flex', justifyContent:'center', margin:'8px 0'}}>
                  <button type="button" onClick={() => setAuthMode('login')} style={{fontSize:'12px', fontWeight:'700', color:'#64748b', background:'none', border:'none', cursor:'pointer'}}>
                    ← Back to Login
                  </button>
                </div>

                <button type="submit" disabled={loading} 
                        style={{width:'100%', padding:'14px', background:'#0f172a', color:'white', borderRadius:'12px', fontSize:'14px', fontWeight:'700', border:'none', cursor: loading ? 'wait' : 'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', boxShadow:'0 10px 25px rgba(15,23,42,0.2)'}}>
                  {loading ? 'Creating Account...' : 'Sign Up →'}
                </button>
              </form>
            )}

            <div style={{display:'flex', alignItems:'center', margin:'24px 0'}}>
              <div style={{flex:1, height:'1px', background:'#f1f5f9'}}></div>
              <span style={{padding:'0 16px', fontSize:'12px', fontWeight:'700', color:'#cbd5e1', letterSpacing:'1px'}}>OR CONTINUE WITH</span>
              <div style={{flex:1, height:'1px', background:'#f1f5f9'}}></div>
            </div>

            <div style={{display:'flex', justifyContent:'center'}}>
              <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => setAuthError('Google Sign-In Failed')}
                 theme="outline" size="large" shape="rectangular" width="100%"
              />
            </div>
            
            <p style={{textAlign:'center', fontSize:'10px', color:'#94a3b8', marginTop:'32px', lineHeight:'1.6', maxWidth:'250px', marginLeft:'auto', marginRight:'auto'}}>
              By continuing, you agree to InsurGig AI's Terms of Service and Privacy Policy. Secure encrypted connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
