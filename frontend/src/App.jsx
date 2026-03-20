import { useState } from 'react'
import './App.css'

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

  const formGroupStyle = { marginBottom: '15px' }
  const inputStyle = { padding: '8px', width: '250px', display: 'block', marginTop: '5px' }
  const buttonStyle = { padding: '10px 20px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    alert('Worker Registered Successfully')
  }

  const handleCheckRisk = async () => {
    const response = await fetch('http://127.0.0.1:8000/risk')
    const data = await response.json()
    
    setResults({
      riskScore: data.risk,
      weeklyPremium: `₹${data.premium}`,
      claimStatus: data.claim
    })
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>InsurGig AI</h1>
      
      <h2>Worker Registration Form</h2>
      <form onSubmit={handleRegister}>
        <div style={formGroupStyle}>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            style={inputStyle}
            placeholder="Enter your name"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label>City:</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange} 
            style={inputStyle}
            placeholder="Enter your city"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label>Zone:</label>
          <select 
            name="zone" 
            value={formData.zone} 
            onChange={handleInputChange} 
            style={inputStyle}
          >
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={buttonStyle}>Register</button>
          <button type="button" onClick={handleCheckRisk} style={{...buttonStyle, backgroundColor: '#28a745'}}>Check Risk</button>
        </div>
      </form>

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>Output Section</h2>
        <p><strong>Risk Score:</strong> {results.riskScore !== null ? results.riskScore : '--'}</p>
        <p><strong>Weekly Premium:</strong> {results.weeklyPremium !== null ? results.weeklyPremium : '--'}</p>
        <p><strong>Claim Status:</strong> {results.claimStatus !== null ? results.claimStatus : '--'}</p>
      </div>
    </div>
  )
}

export default App
