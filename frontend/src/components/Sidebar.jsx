export default function Sidebar({ active, role, setIsLoggedIn, setCurrentView, setRole }) {
  return (
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
}
