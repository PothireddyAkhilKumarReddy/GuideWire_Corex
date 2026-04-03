export default function BottomNav({ active, setCurrentView, setIsLoggedIn, setRole }) {
  return (
    <div className="glass-nav-pill">
       <div onClick={() => setCurrentView('dashboard')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'dashboard' ? '#021676' : 'transparent', color: active === 'dashboard' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🏠</div>
       <div onClick={() => setCurrentView('claims')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'claims' ? '#021676' : 'transparent', color: active === 'claims' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🛡️</div>
       <div onClick={() => setCurrentView('plans')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'plans' ? '#021676' : 'transparent', color: active === 'plans' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>💳</div>
       <div onClick={() => setCurrentView('chat')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'chat' ? '#021676' : 'transparent', color: active === 'chat' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>💬</div>
       <div onClick={() => setCurrentView('analytics')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'analytics' ? '#021676' : 'transparent', color: active === 'analytics' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>📊</div>
       <div onClick={() => setCurrentView('history')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'history' ? '#021676' : 'transparent', color: active === 'history' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>📜</div>
    </div>
  )
}
