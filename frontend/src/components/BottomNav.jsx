export default function BottomNav({ active, setCurrentView, setIsLoggedIn, setRole }) {
  return (
    <div style={{position:'fixed', bottom:'30px', left:'50%', transform:'translateX(-50%)', background:'white', padding:'10px 20px', borderRadius:'30px', display:'flex', gap:'15px', boxShadow:'0 20px 60px rgba(0,0,0,0.1)', border:'1px solid #f1f5f9', zIndex:100}}>
       <div onClick={() => setCurrentView('dashboard')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'dashboard' ? '#021676' : 'transparent', color: active === 'dashboard' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🏠</div>
       <div onClick={() => setCurrentView('claims')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'claims' ? '#021676' : 'transparent', color: active === 'claims' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🛡️</div>
       <div onClick={() => setCurrentView('plans')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'plans' ? '#021676' : 'transparent', color: active === 'plans' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>💳</div>
       <div onClick={() => setCurrentView('chat')} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: active === 'chat' ? '#021676' : 'transparent', color: active === 'chat' ? 'white' : '#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>💬</div>
       <div onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setRole('worker'); }} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', color:'#94a3b8', cursor:'pointer', transition:'all 0.3s ease'}}>🚪</div>
    </div>
  )
}
