import { useState } from 'react'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'login', 'signup'
  const [role, setRole] = useState('worker') // 'worker', 'admin'
  const [formData, setFormData] = useState({ name: '', city: '', zone: 'Zone A' })
  const [results, setResults] = useState({ riskScore: null, weeklyPremium: null, claimStatus: null })
  const [registerMessage, setRegisterMessage] = useState('')
  const [loadingRisk, setLoadingRisk] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setRegisterMessage('Worker Registered Successfully')
    setTimeout(() => setRegisterMessage(''), 3000)
  }

  const handleCheckRisk = () => {
    setLoadingRisk(true)
    
    // Decoupled from backend for Vercel deployment
    const data = {
      risk: "High",
      premium: 90,
      claim: "Triggered"
    }

    setTimeout(() => {
      setResults({
        riskScore: data.risk,
        weeklyPremium: `₹${data.premium}`,
        claimStatus: data.claim
      })
      setLoadingRisk(false)
    }, 500)
  }

  const scrollToSection = (id) => {
    setCurrentView('home')
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const renderNav = () => (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setCurrentView('home')}>InsurGig AI</div>
      <div className="nav-links">
        <span onClick={() => setCurrentView('home')}>Home</span>
        <span onClick={() => scrollToSection('features')}>Features</span>
        <span onClick={() => scrollToSection('pricing')}>Pricing</span>
        <button className="nav-login-btn" onClick={() => setCurrentView('login')}>Login</button>
      </div>
    </nav>
  )

  const renderLogin = () => (
    <div className="auth-container fade-up">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <div className="role-toggle">
          <button type="button" className={role === 'worker' ? 'active' : ''} onClick={() => setRole('worker')}>Worker</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Insurer / Admin</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert(`Logged in as ${role}!`) }}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-primary auth-btn">Login</button>
        </form>
        <p className="auth-footer">Don't have an account? <span onClick={() => setCurrentView('signup')}>Sign Up</span></p>
      </div>
    </div>
  )

  const renderSignup = () => (
    <div className="auth-container fade-up">
      <div className="auth-card">
        <h2>Create Account</h2>
        <div className="role-toggle">
          <button type="button" className={role === 'worker' ? 'active' : ''} onClick={() => setRole('worker')}>Worker</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Insurer / Admin</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert(`Signed up as ${role}!`) }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a strong password" required />
          </div>
          <button type="submit" className="btn-primary auth-btn">Sign Up</button>
        </form>
        <p className="auth-footer">Already have an account? <span onClick={() => setCurrentView('login')}>Login</span></p>
      </div>
    </div>
  )

  const renderHome = () => (
    <div className="home-content">
      {/* 1. HERO SECTION */}
      <section className="hero-section fade-up delay-1">
        <div className="hero-text">
          <h1 className="hero-title">Income Protection for Gig Workers</h1>
          <p className="hero-subtitle">AI-powered automatic payouts guaranteed during sudden weather and traffic disruptions.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollToSection('demo')}>Get Started</button>
            <button className="btn-secondary" onClick={() => scrollToSection('demo')}>Check Risk</button>
          </div>
        </div>
        <div className="hero-image-placeholder">
          <div className="placeholder-art">🚀🛡️</div>
        </div>
      </section>

      {/* 2. PARTNERS / TRUST SECTION */}
      <section className="partners-section fade-up delay-2">
        <p>Trusted by modern gig platforms</p>
        <div className="partner-logos">
          <span>Uber</span>
          <span>Zomato</span>
          <span>Swiggy</span>
          <span>Urban Company</span>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <div className="services-wrapper fade-up delay-3">
        <section className="services-section">
          <h2>What We Offer</h2>
          <div className="services-grid">
            <div className="service-card dark-card">
              <div className="icon">🧠</div>
              <h4>AI Risk Prediction</h4>
              <p>Real-time machine learning analytics for accurate premium pricing</p>
            </div>
            <div className="service-card dark-card">
              <div className="icon">⚡</div>
              <h4>Automatic Claim Trigger</h4>
              <p>Zero paperwork payouts when precise thresholds are met</p>
            </div>
            <div className="service-card dark-card">
              <div className="icon">🛡️</div>
              <h4>Fraud Detection</h4>
              <p>Advanced AI validation prevents false claims globally</p>
            </div>
            <div className="service-card dark-card">
              <div className="icon">📍</div>
              <h4>Hyper-local Risk Zones</h4>
              <p>Pricing dynamically adjusted by precise geographic risk data</p>
            </div>
          </div>
        </section>
      </div>

      {/* 4. ABOUT SECTION */}
      <section className="about-section fade-up">
        <div className="about-image-placeholder">
          <div className="placeholder-art">📊📈</div>
        </div>
        <div className="about-text">
          <h2>Smarter Insurance for Modern Gig Workers</h2>
          <p>Our automation intelligently tracks real-time data across hundreds of active zones. We use artificial intelligence to verify disruptions like heavy rain or traffic instantly, depositing payouts directly into your wallet automatically without ever having to wait for a claim specialist.</p>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="features-section fade-up" id="features">
        <h2>Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🌦️ Weather Monitoring</h4>
            <p>Tracks rain, storms, and heat thresholds simultaneously to guarantee fair coverage.</p>
          </div>
          <div className="feature-card">
            <h4>💨 AQI Tracking</h4>
            <p>Activates safety payouts whenever local air quality reaches highly dangerous levels.</p>
          </div>
          <div className="feature-card">
            <h4>🚗 Traffic Risk</h4>
            <p>Compensates you automatically for unusually severe or catastrophic gridlock events.</p>
          </div>
          <div className="feature-card">
            <h4>📅 Weekly Premium Model</h4>
            <p>Flexible micro-payments that fit neatly inside your variable weekly gig earnings.</p>
          </div>
          <div className="feature-card">
            <h4>💸 Fast Payouts</h4>
            <p>Funds transferred to your linked bank account within 4 hours of a triggered event.</p>
          </div>
          <div className="feature-card">
            <h4>🔒 Fraud Protection</h4>
            <p>Bank-grade security and AI telemetry effectively stopping bad actors from abusing the pool.</p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="pricing-section fade-up" id="pricing">
        <h2>Simple Weekly Plans</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h4>Basic Plan</h4>
            <div className="price">₹35<span>/week</span></div>
            <p>Coverage: ₹1200</p>
            <p className="sub-detail">Low risk zones</p>
            <button className="btn-secondary">Choose Plan</button>
          </div>
          <div className="pricing-card popular">
            <div className="badge">Most Popular</div>
            <h4>Standard Plan</h4>
            <div className="price">₹60<span>/week</span></div>
            <p>Coverage: ₹2500</p>
            <p className="sub-detail">Medium risk zones</p>
            <button className="btn-primary">Choose Plan</button>
          </div>
          <div className="pricing-card">
            <h4>Premium Plan</h4>
            <div className="price">₹90<span>/week</span></div>
            <p>Coverage: ₹4000</p>
            <p className="sub-detail">High risk zones</p>
            <button className="btn-secondary">Choose Plan</button>
          </div>
        </div>
      </section>

      {/* 6. TRIGGERS SECTION */}
      <div className="triggers-wrapper fade-up">
        <section className="triggers-section">
          <h2>Covered Disruptions</h2>
          <div className="triggers-grid">
            <div className="trigger-card">
              <div className="trigger-icon">🌧️</div>
              <span>Heavy Rain</span>
            </div>
            <div className="trigger-card">
              <div className="trigger-icon">☀️</div>
              <span>Extreme Heat</span>
            </div>
            <div className="trigger-card">
              <div className="trigger-icon">💨</div>
              <span>High AQI</span>
            </div>
            <div className="trigger-card">
              <div className="trigger-icon">🚗</div>
              <span>Traffic Congestion</span>
            </div>
            <div className="trigger-card">
              <div className="trigger-icon">🌊</div>
              <span>Flood</span>
            </div>
            <div className="trigger-card">
              <div className="trigger-icon">🚧</div>
              <span>Operational Disruption</span>
            </div>
          </div>
        </section>
      </div>

      {/* 7. DEMO SECTION */}
      <div className="demo-section-wrapper fade-up" id="demo">
        <section className="demo-section">
          <div className="app-container">
            <h1>Try It Yourself</h1>
            <h2>InsurGig Registration Simulator</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter worker name"
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="form-group">
                <label>Zone</label>
                <select 
                  name="zone" 
                  value={formData.zone} 
                  onChange={handleInputChange} 
                >
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="Zone C">Zone C</option>
                </select>
              </div>

              <div className="button-group">
                <button type="submit" className="btn-register">Register</button>
                <button type="button" onClick={handleCheckRisk} className="btn-risk">Check Risk</button>
              </div>
              
              {registerMessage && (
                <div style={{ marginTop: '20px', color: '#38a169', fontWeight: 'bold', textAlign: 'center' }}>
                  {registerMessage}
                </div>
              )}
            </form>

            <div className="output-section">
              {loadingRisk ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#718096', fontWeight: '600', fontSize: '18px' }}>
                  Calculating risk...
                </div>
              ) : (
                <div className="output-grid">
                  <div className="result-card-output">
                    <span className="result-label">Risk Score</span>
                    <span className={`result-value ${results.riskScore ? 'val-risk' : ''}`}>{results.riskScore !== null ? results.riskScore : '--'}</span>
                  </div>
                  <div className="result-card-output">
                    <span className="result-label">Weekly Premium</span>
                    <span className={`result-value ${results.weeklyPremium ? 'val-premium' : ''}`}>{results.weeklyPremium !== null ? results.weeklyPremium : '--'}</span>
                  </div>
                  <div className="result-card-output">
                    <span className="result-label">Claim Status</span>
                    <span className={`result-value ${results.claimStatus ? 'val-claim' : ''}`}>
                      {results.claimStatus !== null ? results.claimStatus : '--'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )

  return (
    <div className="app-root">
      {renderNav()}
      <div className="main-content">
        {currentView === 'home' && renderHome()}
        {currentView === 'login' && renderLogin()}
        {currentView === 'signup' && renderSignup()}
      </div>
    </div>
  )
}

export default App
