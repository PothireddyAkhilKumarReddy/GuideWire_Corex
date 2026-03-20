import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    zone: 'Zone A'
  })
  
  const [results, setResults] = useState({
    riskScore: null,
    weeklyPremium: null,
    claimStatus: null
  })

  // New feedback states
  const [registerMessage, setRegisterMessage] = useState('')
  const [loadingRisk, setLoadingRisk] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setRegisterMessage('Worker Registered Successfully')
    // Automatically hide the message after 3 seconds for clean UI
    setTimeout(() => setRegisterMessage(''), 3000)
  }

  const handleCheckRisk = async () => {
    setLoadingRisk(true)
    
    // Call the backend API
    const response = await fetch('http://127.0.0.1:8000/risk')
    const data = await response.json()
    
    setResults({
      riskScore: data.risk,
      weeklyPremium: `₹${data.premium}`,
      claimStatus: data.claim
    })
    
    setLoadingRisk(false)
  }

  return (
    <div className="app-container">
      <h1>InsurGig AI</h1>
      <p style={{ textAlign: 'center', color: '#718096', fontSize: '15px', marginTop: '-15px', marginBottom: '30px' }}>
        AI-Powered Insurance for Gig Workers
      </p>
      
      <h2>Worker Registration</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="John Doe"
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
            placeholder="New York"
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
        
        {/* Simple success text rendering below buttons */}
        {registerMessage && (
          <div style={{ marginTop: '16px', color: '#38a169', fontWeight: 'bold', textAlign: 'center' }}>
            {registerMessage}
          </div>
        )}
      </form>

      <div className="output-section">
        <h2>Output Results</h2>
        
        {/* Conditional rendering for loading state vs actual results */}
        {loadingRisk ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#718096', fontWeight: '600', fontSize: '16px' }}>
            Calculating risk...
          </div>
        ) : (
          <div className="output-grid">
            <div className="result-card">
              <span className="result-label">Risk Score</span>
              <span className="result-value">{results.riskScore !== null ? results.riskScore : '--'}</span>
            </div>
            <div className="result-card">
              <span className="result-label">Weekly Premium</span>
              <span className="result-value">{results.weeklyPremium !== null ? results.weeklyPremium : '--'}</span>
            </div>
            <div className="result-card">
              <span className="result-label">Claim Status</span>
              <span className={`result-value ${results.claimStatus === 'Triggered' ? 'status-triggered' : ''}`}>
                {results.claimStatus !== null ? results.claimStatus : '--'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
