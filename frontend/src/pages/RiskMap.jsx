import Sidebar from '../components/Sidebar'

export default function RiskMap({ role, setIsLoggedIn, setCurrentView, setRole }) {
  return (
    <div className="app-layout">
      <Sidebar active="map" role={role} setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} setRole={setRole} />
      <div className="main-area" style={{background:'#06090f', position:'relative', padding:'40px'}}>
         <div className="card" style={{background:'rgba(21,27,40,0.8)', backdropFilter:'blur(10px)', marginBottom:'20px', maxWidth:'400px', zIndex:10, position:'relative'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
               <h3 style={{margin:0}}>Risk Overview</h3>
               <span style={{color:'var(--accent-green)'}}>📊</span>
            </div>
            <div className="sys-label">ACTIVE LOCATIONS</div>
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
               <p style={{margin:0}}>Storm cell approaching downtown.<br/>Payout reserve fully liquid.</p>
            </div>
         </div>
      </div>
    </div>
  )
}
