import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

// Two hardcoded admin accounts
const ADMIN_ACCOUNTS = [
  { id: 'admin@careernest.ai', password: 'Admin@123', name: 'Super Admin' },
  { id: 'manager@careernest.ai', password: 'Manager@456', name: 'Content Manager' },
];

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('admin@careernest.ai');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Generate CAPTCHA
  const generateString = () => Math.random().toString(36).substring(2, 8).toUpperCase();
  const [captcha, setCaptcha] = useState(generateString());
  const [captchaInput, setCaptchaInput] = useState(captcha);
  const generateCaptcha = () => { 
    const newCaptcha = generateString();
    setCaptcha(newCaptcha); 
    setCaptchaInput(newCaptcha); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setError('Incorrect verification code. Please try again.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email: adminId.trim(),
        password: password
      });

      const { token, role, name, _id } = response.data;

      if (role !== 'admin') {
        setError('Access denied. You do not have administrator privileges.');
        generateCaptcha();
      } else {
        sessionStorage.setItem('adminAuth', JSON.stringify({ id: _id, email: adminId, name, token }));
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Admin ID or Password. Access denied.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel glass-panel" style={{ maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h2 style={{ margin: 0 }}>Admin Access</h2>
          <p className="auth-subtitle">Restricted area — authorized personnel only</p>
        </div>

        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: '#f87171'
        }}>
          ⚠️ This panel is for administrators only. Unauthorized access is prohibited.
        </div>

        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label className="input-label">Admin ID (Email) <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input
              type="email"
              placeholder="admin@careernest.ai"
              className="input-field"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group captcha-group">
            <label className="input-label">
              Verify you are human: <span className="captcha-code">{captcha}</span>
              <span style={{ color: 'var(--color-error)' }}> *</span>
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Enter code"
                className="input-field"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
              <button type="button" className="btn-secondary" onClick={generateCaptcha} style={{ padding: '0 1rem', flexShrink: 0 }}>🔄</button>
            </div>
          </div>

          <button type="submit" className="btn-secondary auth-submit" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : '🔐 Access Admin Panel'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.5 }}>
          <p>CareerNest Admin Portal v1.0 — All access is logged.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
