import { useState, useRef, useEffect } from 'react'

export default function Chat({ role, isLoggedIn, setCurrentView, setIsLoggedIn, setRole }) {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'admin', name: 'Support Team', text: 'Welcome to InsurGig AI Support! How can we help you today?', time: '10:00 AM', date: 'Today' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatFilter, setChatFilter] = useState('all')

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const newMsg = {
      id: Date.now(),
      sender: role === 'admin' ? 'admin' : 'user',
      name: role === 'admin' ? 'Admin' : 'You',
      text: chatInput.trim(),
      time: timeStr,
      date: 'Today'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    if (role !== 'admin') {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'admin',
          name: 'Support Team',
          text: 'Thank you for reaching out! Our team will review your message and get back to you within 24 hours.',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          date: 'Today'
        }]);
      }, 1500);
    }
  }
  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', padding:'30px 20px 120px 20px', fontFamily:'"Inter", sans-serif'}}>
      <div style={{maxWidth:'700px', margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', cursor:'pointer'}} onClick={() => setCurrentView('dashboard')}>
            <div style={{width:'44px', height:'44px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
              <span style={{fontSize:'20px'}}>←</span>
            </div>
            <div>
              <div style={{fontSize:'12px', color:'#64748b', fontWeight:'700', letterSpacing:'1px'}}>SUPPORT</div>
              <div style={{fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Help & Complaints</div>
            </div>
          </div>
          <div style={{display:'flex', gap:'8px'}}>
            {['all', 'open', 'resolved'].map(f => (
              <button key={f} onClick={() => setChatFilter(f)} style={{padding:'8px 16px', borderRadius:'20px', border: chatFilter === f ? 'none' : '1px solid #e2e8f0', background: chatFilter === f ? '#021676' : 'white', color: chatFilter === f ? 'white' : '#64748b', fontSize:'12px', fontWeight:'700', cursor:'pointer', textTransform:'capitalize'}}>{f}</button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div className="hover-card" style={{background:'white', borderRadius:'24px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.03)', overflow:'hidden'}}>
          <div style={{padding:'20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{width:'40px', height:'40px', background:'#021676', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'18px'}}>💬</div>
            <div>
              <div style={{fontSize:'15px', fontWeight:'800', color:'#0f172a'}}>InsurGig AI Support</div>
              <div style={{fontSize:'12px', color:'#22c55e', fontWeight:'600'}}>● Online</div>
            </div>
          </div>

          <div style={{height:'400px', overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'15px', background:'#fafbfc'}}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{display:'flex', flexDirection:'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{fontSize:'10px', color:'#94a3b8', fontWeight:'700', marginBottom:'4px', letterSpacing:'0.5px'}}>{msg.name} • {msg.time}</div>
                <div style={{maxWidth:'80%', padding:'14px 18px', borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.sender === 'user' ? '#021676' : 'white', color: msg.sender === 'user' ? 'white' : '#0f172a', fontSize:'14px', lineHeight:'1.5', border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:'15px 20px', borderTop:'1px solid #f1f5f9', display:'flex', gap:'10px', background:'white'}}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder={role === 'admin' ? 'Reply to this complaint...' : 'Type your message or complaint...'}
              style={{flex:1, padding:'14px 18px', borderRadius:'14px', border:'1px solid #e2e8f0', fontSize:'14px', color:'#0f172a', outline:'none', background:'#f8fafc'}}
            />
            <button onClick={handleSendChat} style={{width:'48px', height:'48px', borderRadius:'14px', background:'#021676', color:'white', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0}}>➤</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{marginTop:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'12px'}}>
          {[
            {icon:'🔧', label:'Claim Issue', msg:'I have an issue with my recent claim payout.'},
            {icon:'📋', label:'Plan Query', msg:'I need help choosing the right insurance plan.'},
            {icon:'⚠️', label:'Report Bug', msg:'I found a bug in the app that needs attention.'},
            {icon:'💰', label:'Payment Help', msg:'I have a question about my premium payment.'},
          ].map((action, i) => (
            <button key={i} className="hover-card" onClick={() => { setChatInput(action.msg); }} style={{background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'16px', cursor:'pointer', textAlign:'center', transition:'all 0.2s ease', boxShadow:'0 2px 8px rgba(0,0,0,0.02)'}}>
              <div style={{fontSize:'24px', marginBottom:'8px'}}>{action.icon}</div>
              <div style={{fontSize:'12px', fontWeight:'700', color:'#0f172a'}}>{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
