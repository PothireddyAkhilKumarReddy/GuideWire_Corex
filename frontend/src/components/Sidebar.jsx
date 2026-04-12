import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  User, 
  LogOut,
  History,
  Map
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, userName, handleLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'plans', label: 'Coverage Plans', icon: ShieldCheck },
    { id: 'history', label: 'Claim History', icon: History },
    { id: 'profile-setup', label: 'Profile', icon: User },
  ];

  return (
    <div style={{
      width: '256px', background: 'linear-gradient(180deg, #eff6ff 0%, #eef2ff 100%)', 
      borderRight: '1px solid #e0e7ff', height: '100vh', display: 'flex', flexDirection: 'column', 
      position: 'fixed', left: 0, top: 0, fontFamily: '"Inter", sans-serif',
      boxShadow: '4px 0 15px rgba(0,0,0,0.02)'
    }}>
      {/* Brand & Status */}
      <div style={{padding: '28px 24px 20px 24px'}}>
        <h1 style={{fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', color: '#1e3a8a', margin: 0}}>
          InsurGig <span style={{color: '#4f46e5', fontWeight: '800'}}>AI</span>
        </h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px'}}>
          <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite', boxShadow: '0 0 8px rgba(16,185,129,0.4)'}}></div>
          <span style={{fontSize: '10px', fontWeight: '800', color: '#059669', letterSpacing: '1px'}}>SYSTEM ACTIVE</span>
          <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
        </div>
      </div>

      <div style={{padding: '8px 24px', fontSize: '10px', fontWeight: '800', color: '#6366f1', letterSpacing: '1.5px', marginBottom: '8px', opacity: 0.7}}>
        INTELLIGENCE
      </div>

      {/* Navigation */}
      <nav style={{flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px'}}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'profile-setup' && currentView === 'profile');
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '12px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', 
                transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                background: isActive ? '#fff' : 'transparent',
                color: isActive ? '#4f46e5' : '#64748b',
                boxShadow: isActive ? '0 4px 10px rgba(79,70,229,0.1)' : 'none',
                borderLeft: isActive ? '3px solid #4f46e5' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#3b82f6'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
            >
              <Icon size={20} color={isActive ? "#4f46e5" : "#818cf8"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div style={{padding: '16px', borderTop: '1px solid #e0e7ff'}}>
        <div style={{background: 'rgba(255,255,255,0.7)', borderRadius: '14px', padding: '12px', border: '1px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '12px', backdropFilter: 'blur(10px)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 12px rgba(79,70,229,0.2)'}}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <p style={{fontSize: '14px', fontWeight: '800', color: '#1e3a8a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase'}}>{userName || "Worker"}</p>
              <p style={{fontSize: '12px', color: '#6366f1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Connected User</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', 
            padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', 
            color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
