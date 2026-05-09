import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const generateString = () => Math.random().toString(36).substring(2, 8).toUpperCase();
  const [captcha, setCaptcha] = useState(generateString());
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    setCaptcha(generateString());
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // CAPTCHA Validation
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setError('Incorrect verification code. Please try again.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      // Using relative path thanks to Vite proxy
      const res = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      console.log('Login success:', res.data);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel glass-panel">
        <h2>{t('welcome_back')}</h2>
        <p className="auth-subtitle">{t('login_subtitle')}</p>
        
        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">{t('email_addr')} <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">{t('password')} <span style={{ color: 'var(--color-error)' }}>*</span></label>
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
            <label className="input-label">{t('prove_human')} <span className="captcha-code">{captcha}</span> <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder={t('captcha_placeholder')} 
                className="input-field" 
                value={captchaInput} 
                onChange={(e) => setCaptchaInput(e.target.value)} 
                required 
              />
              <button type="button" className="btn-secondary" onClick={generateCaptcha} style={{ padding: '0 1rem', flexShrink: 0 }}>🔄</button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-secondary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner"></div> : t('login')}
          </button>
        </form>

        <div className="auth-footer">
          <p>{t('dont_account')} <Link to="/register">{t('create_free')}</Link></p>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center' 
        }}>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>Quick Login (Demo Accounts)</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn-primary" 
              style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              onClick={() => {
                setEmail('seeker@demo.com');
                setPassword('password123');
                setCaptchaInput(captcha);
              }}
            >
              👤 Seeker
            </button>
            <button 
              className="btn-primary" 
              style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              onClick={() => {
                setEmail('recruiter@demo.com');
                setPassword('password123');
                setCaptchaInput(captcha);
              }}
            >
              💼 Recruiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
