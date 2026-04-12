import Sidebar from '../components/Sidebar'
import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'

export default function RiskMap({ role, setIsLoggedIn, setCurrentView, setRole }) {
   const [logs, setLogs] = useState([]);
   const logEndRef = useRef(null);

   useEffect(() => {
      const messages = [
         "🤖 Autonomous Daemon executing sweep...",
         "📡 Polling 3,402 active users' geolocation...",
         "⚡ AQI Spike detected in Zone 4 (Hazardous).",
         "🔍 Running parameters through Multi-Modal risk model...",
         "✅ 3,398 Users safe. 4 anomalies detected.",
         "⚠️ Seismic tremor detected (4.2 Mag) near grid 78.4.",
         "💰 Auto-triggering claims for affected users...",
         "💸 Payouts disbursed to 4 wallets. Honor scores augmented.",
         "🏁 Sweep Complete. Sleeping for 60s."
      ];
      let i = 0;
      const interval = setInterval(() => {
         setLogs(prev => {
            const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ${messages[i % messages.length]}`];
            return newLogs.slice(-15);
         });
         i++;
         if(logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 2500);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="app-layout">
         <Sidebar active="map" role={role} setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} setRole={setRole} />
         <div className="main-area" style={{ background: '#06090f', position: 'relative', padding: '40px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative' }}>
               <div className="card" style={{ background: 'rgba(21,27,40,0.8)', backdropFilter: 'blur(10px)', marginBottom: '20px', maxWidth: '400px', zIndex: 10, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                     <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px' }}>Autonomous AI Overlord</h3>
                     <span style={{ color: 'var(--accent-green)', fontSize: '22px', animation: 'pulse 2s infinite' }}>📡</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 25px 0' }}>This Live Daemon acts as a decentralized parametric judge. It polls USGS Seismic, OpenWeather, and IoT Crash Sensor APIs 24/7. When parameters breach threshold limits, funds are routed to affected gig-workers instantly without human review.</p>

                  <div className="sys-label">ACTIVE GIG-WORKER LOCATIONS</div>
                  <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--accent-blue)', marginBottom: '20px', borderBottom: '2px solid var(--accent-blue)', paddingBottom: '10px', display: 'inline-block' }}>12</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                     <div style={{ textAlign: 'center' }}><div className="sys-label">SAFE</div><div style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '18px' }}>72%</div></div>
                     <div style={{ textAlign: 'center' }}><div className="sys-label">WARNING</div><div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '18px' }}>18%</div></div>
                     <div style={{ textAlign: 'center' }}><div className="sys-label">CRITICAL</div><div style={{ color: 'var(--accent-red)', fontWeight: '700', fontSize: '18px' }}>10%</div></div>
                  </div>
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => setCurrentView('dashboard')}>VIEW DETAILED REPORT</button>
               </div>
               
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', overflow: 'hidden' }}>
                  
                  <style>{`
                  @keyframes radar-sweep {
                     from { transform: rotate(0deg); }
                     to { transform: rotate(360deg); }
                  }
                  `}</style>
                  <div style={{ position: 'absolute', top: '50%', left: '55%', transform: 'translate(-50%, -50%)', zIndex: 2, cursor: 'grab' }}>
                     <Globe
                        width={600}
                        height={600}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundColor="rgba(0,0,0,0)"
                        enablePointerInteraction={true}
                     />
                  </div>
                  <div className="radar-scanner"></div>
                  <div className="ring-1"></div>
                  <div className="ring-2"></div>
                  <div style={{ position: 'absolute', top: '40px', right: '40px', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                     <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>WEATHER ALERT</h4>
                     <p style={{ margin: 0 }}>Storm cell approaching downtown.<br />Payout reserve fully liquid.</p>
                  </div>
               </div>
            </div>

            {/* LIVE TERMINAL FEED */}
            <div style={{ height: '200px', background: 'rgba(10, 15, 25, 0.95)', borderTop: '2px solid rgba(56, 189, 248, 0.5)', padding: '15px 20px', overflowY: 'auto', fontFamily: 'monospace', color: '#10b981', fontSize: '12px', zIndex: 20 }}>
               <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>InsurGig Autonomous Terminal (Live)</div>
               {logs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: '6px' }}>{log}</div>
               ))}
               <div ref={logEndRef} />
            </div>
         </div>
      </div>
   )
}
