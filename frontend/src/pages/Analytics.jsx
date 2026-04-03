import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Analytics({ userId, setCurrentView, setIsLoggedIn, setRole }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/worker-analytics/${userId}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Analytics fetch error:', e);
      }
      setLoading(false);
    };
    if (userId) fetchAnalytics();
  }, [userId]);

  if (loading) {
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Inter", sans-serif'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'40px', height:'40px', border:'4px solid #e2e8f0', borderTopColor:'#021676', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 20px auto'}}></div>
          <p style={{color:'#64748b', fontWeight:'600'}}>Loading Analytics...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
        <div style={{maxWidth:'600px', margin:'0 auto', textAlign:'center', paddingTop:'100px'}}>
          <div style={{fontSize:'60px', marginBottom:'20px'}}>📊</div>
          <h2 style={{color:'#0f172a', fontWeight:'900'}}>No Data Yet</h2>
          <p style={{color:'#64748b'}}>Use the dashboard to generate risk scores and file claims first.</p>
        </div>
        <BottomNav active="analytics" setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
      </div>
    );
  }

  const maxScore = Math.max(...(data.risk_history?.map(r => r.score) || [1]), 1);
  const claimTotal = data.claim_stats?.total || 0;
  const approved = data.claim_stats?.approved || 0;
  const rejected = data.claim_stats?.rejected || 0;
  const investigating = data.claim_stats?.investigating || 0;

  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        
        {/* Header */}
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{width:'44px', height:'44px', background:'#021676', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(2,22,118,0.2)'}}>
              <span style={{fontSize:'20px'}}>📊</span>
            </div>
            <div>
              <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>WORKER INSIGHTS</div>
              <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Risk Analytics</div>
            </div>
          </div>
        </header>

        {/* Honor Score + Velocity Summary */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'20px'}}>
          <div style={{background:'white', borderRadius:'20px', padding:'25px', border:'1px solid #e2e8f0', textAlign:'center'}}>
            <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'10px'}}>HONOR SCORE</div>
            <div style={{fontSize:'36px', fontWeight:'900', color: data.honor_score >= 80 ? '#10b981' : data.honor_score >= 50 ? '#f59e0b' : '#ef4444'}}>{data.honor_score}</div>
            <div style={{fontSize:'11px', fontWeight:'700', color: data.honor_score >= 80 ? '#10b981' : data.honor_score >= 50 ? '#f59e0b' : '#ef4444', marginTop:'5px'}}>
              {data.honor_score >= 80 ? 'EXCELLENT' : data.honor_score >= 50 ? 'WARNING' : 'CRITICAL'}
            </div>
          </div>
          <div style={{background:'white', borderRadius:'20px', padding:'25px', border:'1px solid #e2e8f0', textAlign:'center'}}>
            <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'10px'}}>CLAIM VELOCITY</div>
            <div style={{fontSize:'36px', fontWeight:'900', color: data.velocity?.status === 'Safe' ? '#10b981' : data.velocity?.status === 'Warning' ? '#f59e0b' : '#ef4444'}}>
              {data.velocity?.weekly_count || 0}/{data.velocity?.max_allowed || 14}
            </div>
            <div style={{fontSize:'11px', fontWeight:'700', color: data.velocity?.status === 'Safe' ? '#10b981' : '#ef4444', marginTop:'5px'}}>
              {data.velocity?.status === 'Safe' ? '7-DAY SAFE' : data.velocity?.status === 'Warning' ? 'APPROACHING LIMIT' : 'WEEKLY LIMIT HIT'}
            </div>
          </div>
        </div>

        {/* Risk Score History Chart */}
        <div style={{background:'white', borderRadius:'24px', padding:'25px', border:'1px solid #e2e8f0', marginBottom:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.02)'}}>
          <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'20px'}}>📈 RISK SCORE HISTORY</div>
          {data.risk_history && data.risk_history.length > 0 ? (
            <div>
              <div style={{display:'flex', alignItems:'flex-end', gap:'4px', height:'140px', marginBottom:'15px', paddingTop:'20px'}}>
                {data.risk_history.map((entry, i) => {
                  const barHeight = Math.max(10, Math.round((entry.score / 100) * 120));
                  const color = entry.score > 75 ? '#ef4444' : entry.score > 45 ? '#f59e0b' : '#10b981';
                  return (
                    <div key={i} style={{flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height:'100%'}}>
                      <div style={{fontSize:'8px', fontWeight:'700', color:'#64748b', marginBottom:'4px'}}>{entry.score}</div>
                      <div style={{width:'100%', height:`${barHeight}px`, background:color, borderRadius:'4px 4px 0 0', transition:'height 0.3s ease'}}></div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', color:'#94a3b8', fontWeight:'600'}}>
                <span>{data.risk_history[0]?.date}</span>
                <span>{data.risk_history[data.risk_history.length - 1]?.date}</span>
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center', padding:'30px 0', color:'#94a3b8', fontSize:'14px'}}>
              No risk data yet. Refresh the dashboard to generate entries.
            </div>
          )}
        </div>

        {/* Claim Statistics */}
        <div style={{background:'white', borderRadius:'24px', padding:'25px', border:'1px solid #e2e8f0', marginBottom:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.02)'}}>
          <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'20px'}}>🎯 CLAIM BREAKDOWN</div>
          
          {claimTotal > 0 ? (
            <div>
              {/* Visual Bar */}
              <div style={{display:'flex', height:'24px', borderRadius:'12px', overflow:'hidden', marginBottom:'20px'}}>
                {approved > 0 && <div style={{flex: approved, background:'#10b981'}}></div>}
                {rejected > 0 && <div style={{flex: rejected, background:'#ef4444'}}></div>}
                {investigating > 0 && <div style={{flex: investigating, background:'#f59e0b'}}></div>}
              </div>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'24px', fontWeight:'900', color:'#10b981'}}>{approved}</div>
                  <div style={{fontSize:'11px', fontWeight:'700', color:'#64748b'}}>Approved</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'24px', fontWeight:'900', color:'#ef4444'}}>{rejected}</div>
                  <div style={{fontSize:'11px', fontWeight:'700', color:'#64748b'}}>Rejected</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'24px', fontWeight:'900', color:'#f59e0b'}}>{investigating}</div>
                  <div style={{fontSize:'11px', fontWeight:'700', color:'#64748b'}}>Investigating</div>
                </div>
              </div>
              
              <div style={{borderTop:'1px solid #e2e8f0', marginTop:'20px', paddingTop:'15px', display:'flex', justifyContent:'space-between'}}>
                <span style={{fontSize:'13px', fontWeight:'700', color:'#64748b'}}>Total Payouts</span>
                <span style={{fontSize:'18px', fontWeight:'900', color:'#021676'}}>₹{data.claim_stats?.total_payouts || 0}</span>
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center', padding:'30px 0', color:'#94a3b8', fontSize:'14px'}}>
              No claims filed yet.
            </div>
          )}
        </div>

        {/* Honor Score Explainer */}
        <div style={{background:'white', borderRadius:'24px', padding:'25px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.02)'}}>
          <div style={{fontSize:'12px', fontWeight:'800', color:'#64748b', letterSpacing:'1px', marginBottom:'20px'}}>🛡️ HOW HONOR SCORE WORKS</div>
          
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 15px', background:'#f0fdf4', borderRadius:'12px'}}>
              <span style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>✅ Legitimate claim approved</span>
              <span style={{fontSize:'14px', fontWeight:'900', color:'#10b981'}}>+3 pts</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 15px', background:'#fef2f2', borderRadius:'12px'}}>
              <span style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>❌ False claim during safe weather</span>
              <span style={{fontSize:'14px', fontWeight:'900', color:'#ef4444'}}>-5 pts</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 15px', background:'#fef2f2', borderRadius:'12px'}}>
              <span style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>🚨 Velocity breach (14+ claims/week)</span>
              <span style={{fontSize:'14px', fontWeight:'900', color:'#ef4444'}}>-10 pts</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 15px', background:'#fef2f2', borderRadius:'12px'}}>
              <span style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>📍 GPS location spoofing detected</span>
              <span style={{fontSize:'14px', fontWeight:'900', color:'#ef4444'}}>-15 pts</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 15px', background:'#f0fdf4', borderRadius:'12px'}}>
              <span style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>🕐 Passive daily recovery</span>
              <span style={{fontSize:'14px', fontWeight:'900', color:'#10b981'}}>+0.5/day</span>
            </div>
          </div>
        </div>

      </div>
      <BottomNav active="analytics" setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
    </div>
  );
}
