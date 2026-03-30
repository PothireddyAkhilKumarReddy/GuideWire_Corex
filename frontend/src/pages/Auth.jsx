export default function Auth({ role, setRole, authMode, setAuthMode, authForm, setAuthForm, regForm, setRegForm, authError, authSuccess, handleAuthSubmit, handleRegSubmit }) {
  return (
    <div style={{background: '#f8fafc', color:'#0f172a', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', fontFamily:'"Inter", sans-serif'}}>
       <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'20px', fontWeight:'800', marginBottom:'40px', color:'#021676'}}>
           <span style={{background:'#021676', color:'white', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px'}}>⊞</span> InsurGig AI
       </div>
       
       <div className="auth-box w-full-mobile" style={{width:'100%', maxWidth:'480px', background:'white', borderRadius:'32px', padding:'50px 40px', boxShadow:'0 20px 60px rgba(0,0,0,0.03)', textAlign:'center', border:'1px solid #f1f5f9'}}>
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
             <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }}>
               <div style={{textAlign:'left', marginBottom:'25px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>EMAIL ADDRESS</label>
                  <input type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} placeholder="Enter your email address" style={{width:'100%', padding:'18px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'15px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>

               <div style={{textAlign:'left', marginBottom:'25px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>PASSWORD</label>
                  <input type="password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} placeholder="Enter your password" style={{width:'100%', padding:'18px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'15px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
                  {authError && <div style={{color:'var(--accent-red)', fontSize:'12px', marginTop:'10px'}}>{authError}</div>}
                  {authSuccess && <div style={{color:'#22c55e', fontSize:'12px', marginTop:'10px'}}>{authSuccess}</div>}
               </div>

               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'40px', fontSize:'13px', fontWeight:'600'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#64748b', cursor:'pointer'}}>
                     <div style={{width:'16px', height:'16px', border:'2px solid #cbd5e1', borderRadius:'4px'}}></div> Remember me
                  </div>
                  <div style={{color:'#021676', cursor:'pointer', fontWeight:'700'}} onClick={() => setAuthMode('register')}>Don't have an account? Sign up</div>
               </div>

               <button type="submit" style={{width:'100%', background:'#0e24b4', color:'white', border:'none', padding:'20px', borderRadius:'16px', fontSize:'15px', fontWeight:'800', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 15px 30px rgba(14, 36, 180, 0.2)', letterSpacing:'1px'}}>
                  LOGIN ⚡
               </button>
             </form>
          ) : (
             <form onSubmit={(e) => { e.preventDefault(); handleRegSubmit(); }}>
               <div style={{textAlign:'left', marginBottom:'15px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>FULL NAME</label>
                  <input type="text" value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} placeholder="Enter your full name" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>
               
               <div style={{textAlign:'left', marginBottom:'15px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>EMAIL ADDRESS</label>
                  <input type="email" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} placeholder="Enter your email address" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>

               <div style={{textAlign:'left', marginBottom:'15px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>PASSWORD</label>
                  <input type="password" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} placeholder="Create a password" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>
               
               <div style={{textAlign:'left', marginBottom:'25px'}}>
                  <label style={{fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'1px', display:'block', marginBottom:'8px', marginLeft:'5px'}}>CITY</label>
                  <input type="text" value={regForm.city} onChange={(e) => setRegForm({...regForm, city: e.target.value})} placeholder="Enter your regular operating city" style={{width:'100%', padding:'15px 20px', borderRadius:'16px', border:'1px solid #cbd5e1', fontSize:'14px', color:'#0f172a', outline:'none', boxSizing:'border-box'}} />
               </div>

               {authError && <div style={{color:'var(--accent-red)', fontSize:'12px', marginBottom:'15px'}}>{authError}</div>}

               <div style={{display:'flex', justifyContent:'center', marginBottom:'30px', fontSize:'13px', fontWeight:'600'}}>
                  <div style={{color:'#64748b', cursor:'pointer'}} onClick={() => setAuthMode('login')}>← Back to Login</div>
               </div>

               <button type="submit" style={{width:'100%', background:'#0e24b4', color:'white', border:'none', padding:'20px', borderRadius:'16px', fontSize:'15px', fontWeight:'800', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', boxShadow:'0 15px 30px rgba(14, 36, 180, 0.2)', letterSpacing:'1px'}}>
                  SIGN UP ⚡
               </button>
             </form>
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
}
