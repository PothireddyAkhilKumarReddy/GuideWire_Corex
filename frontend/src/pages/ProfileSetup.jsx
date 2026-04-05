import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, UploadCloud, MapPin, User as UserIcon, Phone, Calendar, Hash, CheckCircle, Edit3, Save, X, CreditCard, Mail, Shield } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function ProfileSetup({ userId, userName, setProfileComplete, setCurrentView, cachedProfile, setCachedProfile, honorScore }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('loading'); // loading, setup, view
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ phone: '', dob: '', address: '', city: '', pincode: '', aadhaar: '', pan: '' });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [verificationPhoto, setVerificationPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Use cached profile if available, otherwise fetch
  useEffect(() => {
    if (cachedProfile && cachedProfile.profile_complete) {
      setUserData(cachedProfile);
      setProfileComplete(true);
      setViewMode('view');
      setIsDataLoaded(true);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (setCachedProfile) setCachedProfile(data);
          if (data.profile_complete) {
            setUserData(data);
            setProfileComplete(true);
            setViewMode('view');
          } else {
            setViewMode('setup');
          }
        } else {
          setViewMode('setup');
        }
      } catch (err) {
        setViewMode('setup');
      }
      setIsDataLoaded(true);
    };
    if (userId) fetchProfile();
  }, [userId, setProfileComplete, cachedProfile]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (e) {
      alert('Camera access denied. Please allow camera permissions in your browser settings.');
    }
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    setVerificationPhoto(dataUrl);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/profile/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          phone: form.phone,
          date_of_birth: form.dob,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
          aadhaar_number: form.aadhaar,
          pan_number: form.pan,
          profile_photo: profilePhoto,
          verification_photo: verificationPhoto,
        })
      });
      const data = await res.json();
      if (data.profile_complete) {
        setProfileComplete(true);
        const profileRes = await fetch(`${API_BASE}/api/profile/${userId}`);
        const profileData = await profileRes.json();
        setUserData(profileData);
        setViewMode('view');
      }
    } catch (e) {
      console.error('Profile submit error:', e);
    }
    setLoading(false);
  };

  const startEditing = () => {
    setEditForm({
      phone: userData.phone || '',
      date_of_birth: userData.date_of_birth || '',
      address: userData.address || '',
      city: userData.city || '',
      pincode: userData.pincode || '',
      aadhaar_number: userData.aadhaar_number || '',
      pan_number: userData.pan_number || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const saveEdits = async () => {
    setSaving(true);
    try {
      await fetch(`${API_BASE}/api/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ...editForm })
      });
      const res = await fetch(`${API_BASE}/api/profile/${userId}`);
      const data = await res.json();
      setUserData(data);
      setIsEditing(false);
    } catch (e) {
      console.error('Update error:', e);
    }
    setSaving(false);
  };

  const canProceed = () => {
    if (step === 1) return form.phone.length >= 10 && form.dob;
    if (step === 2) return form.address && form.city.length > 2 && form.pincode.length >= 5;
    if (step === 3) return form.aadhaar.length >= 12;
    if (step === 4) return profilePhoto && verificationPhoto;
    return false;
  };

  // ────────────────────────────────────
  //  LOADING STATE
  // ────────────────────────────────────
  if (!isDataLoaded) {
    return (
      <div style={{padding: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ────────────────────────────────────
  //  PROFILE VIEW (after completion)
  // ────────────────────────────────────
  if (viewMode === 'view' && userData) {
    const InfoRow = ({ icon, label, value, editKey }) => (
      <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f1f5f9'}}>
        <div style={{width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0}}>
          {icon}
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: '12px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '4px'}}>{label}</div>
          {isEditing && editKey ? (
            <input
              type={editKey === 'date_of_birth' ? 'date' : 'text'}
              value={editForm[editKey] || ''}
              onChange={e => setEditForm(prev => ({ ...prev, [editKey]: e.target.value }))}
              style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '500', color: '#0f172a', outline: 'none', boxSizing: 'border-box'}}
            />
          ) : (
            <div style={{fontSize: '15px', color: '#0f172a', fontWeight: '600'}}>{value || '—'}</div>
          )}
        </div>
      </div>
    );

    return (
      <div style={{padding: '40px 48px', maxWidth: '880px', margin: '0 auto'}}>
        {/* Header Card */}
        <div style={{background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '24px', padding: '40px 48px', marginBottom: '32px', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', background: 'rgba(59,130,246,0.08)', borderRadius: '50%'}}></div>
          <div style={{position: 'absolute', bottom: '-40px', right: '80px', width: '120px', height: '120px', background: 'rgba(59,130,246,0.05)', borderRadius: '50%'}}></div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
              <div style={{width: '88px', height: '88px', borderRadius: '50%', background: '#475569', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {userData.profile_photo ? (
                  <img src={userData.profile_photo} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <UserIcon size={36} color="#94a3b8" />
                )}
              </div>
              <div>
                <h2 style={{fontSize: '26px', fontWeight: '800', color: 'white', margin: '0 0 8px 0', letterSpacing: '-0.3px'}}>{userData.name}</h2>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'}}>
                    <CheckCircle size={13} /> Verified
                  </div>
                  <div style={{fontSize: '13px', color: '#94a3b8'}}>{userData.email}</div>
                </div>
              </div>
            </div>

            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px'}}>Honor Score</div>
              <div style={{fontSize: '40px', fontWeight: '900', color: 'white', lineHeight: 1}}>{honorScore !== undefined ? honorScore : userData.honor_score}<span style={{fontSize: '16px', color: '#64748b', fontWeight: '500'}}>/100</span></div>
            </div>
          </div>
        </div>

        {/* Edit / Save Controls */}
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '12px'}}>
          {isEditing ? (
            <>
              <button onClick={cancelEditing} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
                <X size={15} /> Cancel
              </button>
              <button onClick={saveEdits} disabled={saving} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', opacity: saving ? 0.7 : 1}}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={startEditing} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#3b82f6', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
              <Edit3 size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Info Cards Grid */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
          {/* Contact Information */}
          <div style={{background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'}}>
            <h3 style={{fontSize: '13px', fontWeight: '700', color: '#3b82f6', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px 0'}}>Contact Information</h3>

            <InfoRow icon={<Phone size={18} color="#3b82f6" />} label="Phone Number" value={userData.phone} editKey="phone" />
            <InfoRow icon={<Mail size={18} color="#3b82f6" />} label="Email Address" value={userData.email} />
            <InfoRow icon={<MapPin size={18} color="#3b82f6" />} label="Address" value={userData.address} editKey="address" />
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0'}}>
              <div style={{width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0}}>
                <MapPin size={18} color="#3b82f6" />
              </div>
              <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <div style={{fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px'}}>City</div>
                  {isEditing ? (
                    <input value={editForm.city || ''} onChange={e => setEditForm(p => ({ ...p, city: e.target.value }))} style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '500', color: '#0f172a', outline: 'none', boxSizing: 'border-box'}} />
                  ) : (
                    <div style={{fontSize: '15px', color: '#0f172a', fontWeight: '600'}}>{userData.city || '—'}</div>
                  )}
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px'}}>Pincode</div>
                  {isEditing ? (
                    <input value={editForm.pincode || ''} onChange={e => setEditForm(p => ({ ...p, pincode: e.target.value }))} style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '500', color: '#0f172a', outline: 'none', boxSizing: 'border-box'}} />
                  ) : (
                    <div style={{fontSize: '15px', color: '#0f172a', fontWeight: '600'}}>{userData.pincode || '—'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Identity */}
          <div style={{background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'}}>
            <h3 style={{fontSize: '13px', fontWeight: '700', color: '#3b82f6', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px 0'}}>Personal Identity</h3>

            <InfoRow icon={<Calendar size={18} color="#3b82f6" />} label="Date of Birth" value={userData.date_of_birth} editKey="date_of_birth" />
            <InfoRow icon={<Shield size={18} color="#3b82f6" />} label="Aadhaar Number" value={userData.aadhaar_number ? `XXXX XXXX ${userData.aadhaar_number.slice(-4)}` : '—'} editKey="aadhaar_number" />
            <InfoRow icon={<CreditCard size={18} color="#3b82f6" />} label="PAN Card" value={userData.pan_number || '—'} editKey="pan_number" />

            {/* Member Since */}
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0'}}>
              <div style={{width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0}}>
                <CheckCircle size={18} color="#10b981" />
              </div>
              <div>
                <div style={{fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px'}}>Member Since</div>
                <div style={{fontSize: '15px', color: '#0f172a', fontWeight: '600'}}>{userData.created_at || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────
  //  SETUP WIZARD (4-step onboarding)
  // ────────────────────────────────────
  return (
    <div style={{background: '#f8fafc', minHeight: '100vh', padding: '24px 40px', fontFamily: '"Inter", sans-serif'}}>
      <div style={{maxWidth: '672px', margin: '0 auto'}}>
        <header style={{marginBottom: '40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
             <div style={{width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: '#2563eb', fontWeight: '900', border: '1px solid #e2e8f0'}}>
                ⊞
             </div>
             <div>
                <div style={{fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px'}}>ONBOARDING</div>
                <div style={{fontSize: '20px', fontWeight: '900', color: '#0f172a'}}>Complete Your Profile</div>
             </div>
          </div>
          <p style={{fontSize: '14px', color: '#64748b', marginBottom: '32px', maxWidth: '448px', lineHeight: '1.5'}}>Provide your details to enable wallet payouts, custom coverage pricing, and automated contract triggers.</p>

          {/* Progress Tracker */}
          <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 10, width: '100%', padding: '0 8px', boxSizing: 'border-box'}}>
            {[1,2,3,4].map((s) => (
               <div key={s} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, background: '#f8fafc', padding: '0 8px'}}>
                 <div style={{
                   width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', transition: 'all 0.3s ease',
                   background: s <= step ? '#2563eb' : 'white',
                   color: s <= step ? 'white' : '#94a3b8',
                   border: s <= step ? 'none' : '1px solid #e2e8f0',
                   boxShadow: s <= step ? '0 4px 6px -1px rgba(37, 99, 235, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
                 }}>
                   {s}
                 </div>
               </div>
            ))}
            <div style={{position: 'absolute', top: '16px', left: 0, width: '100%', height: '2px', background: '#e2e8f0', zIndex: -1}}></div>
          </div>
        </header>

        {/* Form Card */}
        <div style={{background: 'white', borderRadius: '32px', border: '1px solid #f1f5f9', padding: '48px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)'}}>
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0'}}>
              {step === 1 ? `Welcome, ${userName}!` : step === 2 ? 'Where do you work?' : step === 3 ? 'Identity Verification' : 'Final Step: Photos'}
            </h2>
            <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>
              {step === 1 ? "Let's start with your contact details." : step === 2 ? 'Your location determines environmental risk zones.' : step === 3 ? 'Aadhaar & PAN mapping for smart contract payouts.' : 'Upload a profile photo and capture live verification.'}
            </p>
          </div>

          {/* Step 1: Personal */}
          {step === 1 && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', marginLeft: '4px'}}>MOBILE NUMBER</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91" maxLength={13}
                  style={{width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '500'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', marginLeft: '4px'}}>DATE OF BIRTH</label>
                <input type="date" value={form.dob} onChange={e => update('dob', e.target.value)}
                  style={{width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '500'}} />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', marginLeft: '4px'}}>WORKING CITY</label>
                <div style={{position: 'relative'}}>
                  <div style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}}><MapPin size={18} /></div>
                  <input type="text" value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Mumbai, Bangalore"
                    style={{width: '100%', padding: '14px 16px 14px 40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '500'}} />
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', marginLeft: '4px'}}>PIN CODE</label>
                <input type="text" value={form.pincode} onChange={e => update('pincode', e.target.value.replace(/\D/g, ''))} placeholder="e.g. 522502" maxLength={6}
                  style={{width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '500', letterSpacing: '2px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', marginLeft: '4px'}}>FULL ADDRESS</label>
                <textarea value={form.address} onChange={e => update('address', e.target.value)} placeholder="House No, Street, Area..." rows={3}
                  style={{width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '500', resize: 'none', fontFamily: 'inherit'}} />
              </div>
            </div>
          )}

          {/* Step 3: Identity */}
          {step === 3 && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', textAlign: 'center'}}>AADHAAR NUMBER</label>
                <input type="text" value={form.aadhaar} onChange={e => update('aadhaar', e.target.value.replace(/\D/g, ''))} placeholder="XXXX XXXX XXXX" maxLength={12}
                  style={{width: '100%', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '20px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '900', letterSpacing: '5px', textAlign: 'center'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px', textAlign: 'center'}}>PAN CARD NUMBER</label>
                <input type="text" value={form.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10}
                  style={{width: '100%', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '20px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontWeight: '900', letterSpacing: '5px', textAlign: 'center'}} />
              </div>
              <div style={{background: '#fffbeb', borderRadius: '12px', padding: '16px', border: '1px solid #fef3c7', display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                 <div style={{color: '#d97706', marginTop: '2px'}}>🔒</div>
                 <p style={{fontSize: '11px', fontWeight: '500', color: '#92400e', margin: 0, lineHeight: '1.6'}}>Your Aadhaar & PAN identifiers are encrypted and stored securely. They are utilized exclusively for smart contract claim verification and payouts.</p>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
              {/* Profile Photo Upload */}
              <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <label style={{display: 'block', fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px'}}>PROFILE PHOTO (UPLOAD)</label>
                {profilePhoto ? (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <img src={profilePhoto} alt="Profile" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #dbeafe', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '12px'}} />
                    <div style={{fontSize: '12px', fontWeight: '700', color: '#059669'}}>✓ Uploaded</div>
                  </div>
                ) : (
                  <label style={{width: '100%', height: '96px', background: 'white', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                    <UploadCloud size={20} style={{color: '#94a3b8', marginBottom: '8px'}} />
                    <span style={{fontSize: '11px', fontWeight: '700', color: '#64748b'}}>Tap to browse</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{display: 'none'}} />
                  </label>
                )}
              </div>

              {/* Webcam Verification */}
              <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <label style={{display: 'block', fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px'}}>LIVE VERIFICATION (CAM)</label>
                {verificationPhoto ? (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <img src={verificationPhoto} alt="Verification" style={{width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '4px solid #d1fae5', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '12px'}} />
                    <div style={{fontSize: '12px', fontWeight: '700', color: '#059669', marginBottom: '8px'}}>✓ Verified</div>
                    <button onClick={() => { setVerificationPhoto(null); startCamera(); }} style={{fontSize: '10px', fontWeight: '700', color: '#64748b', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer'}}>Retake</button>
                  </div>
                ) : cameraActive ? (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                    <video ref={videoRef} autoPlay muted playsInline style={{width: '100%', height: '128px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #bfdbfe', background: 'black', marginBottom: '12px'}} />
                    <button onClick={capturePhoto} style={{width: '100%', padding: '8px', background: '#2563eb', color: 'white', fontSize: '12px', fontWeight: '700', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>📸 Capture</button>
                  </div>
                ) : (
                  <button onClick={startCamera} style={{width: '100%', height: '96px', background: 'white', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none'}}>
                    <Camera size={20} style={{color: '#94a3b8', marginBottom: '8px'}} />
                    <span style={{fontSize: '11px', fontWeight: '700', color: '#64748b'}}>Open Camera</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{display: 'flex', gap: '12px', marginTop: '40px'}}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{width: '33%', padding: '14px', background: '#f1f5f9', color: '#475569', borderRadius: '12px', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'background 0.2s'}}>
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', border: 'none', transition: 'all 0.2s',
                  background: canProceed() ? '#0f172a' : '#e2e8f0',
                  color: canProceed() ? 'white' : '#94a3b8',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                  boxShadow: canProceed() ? '0 10px 15px -3px rgba(15, 23, 42, 0.1)' : 'none'
                }}>
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', border: 'none', transition: 'all 0.2s',
                  background: canProceed() && !loading ? '#2563eb' : '#e2e8f0',
                  color: canProceed() && !loading ? 'white' : '#94a3b8',
                  cursor: canProceed() && !loading ? 'pointer' : 'not-allowed',
                  boxShadow: canProceed() && !loading ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : 'none'
                }}>
                {loading ? '⏳ Securing Profile...' : '🚀 Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
