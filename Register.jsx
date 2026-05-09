import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Auth.css';

const Register = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
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
      await axios.post('/api/auth/register', {
        name, email, password, role, phone, location, companyName, companyWebsite
      });
      setRegistrationSuccess(true);
      setTimeout(() => navigate('/login', { state: { email, password } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  const Modal = ({ title, content }) => (
    <div className="legal-modal-overlay" onClick={closeModal}>
      <div className="legal-modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={closeModal}>✕</button>
        </div>
        <div className="modal-body">{content}</div>
      </div>
    </div>
  );



  if (registrationSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-panel glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
          <h2 style={{ color: '#10b981' }}>Registration Successful!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            You are successfully registered. Redirecting to login...
          </p>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {activeModal === 'privacy' && (
        <Modal
          title="Privacy Policy"
          content={
            <div className="legal-text">
              <p>Welcome to CareerNest. Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
              <h4>1. Information Collection</h4>
              <p>We collect information you provide directly to us when you create an account, such as your name, email address, and professional background.</p>
              <h4>2. Use of Information</h4>
              <p>We use your information to match you with job opportunities, facilitate communication with recruiters, and improve our AI algorithms.</p>
              <h4>3. Data Security</h4>
              <p>We implement industry-standard security measures to protect your data from unauthorized access or disclosure.</p>
            </div>
          }
        />
      )}
      {activeModal === 'terms' && (
        <Modal
          title="Terms & Conditions"
          content={
            <div className="legal-text">
              <p>By using CareerNest, you agree to comply with the following terms and conditions.</p>
              <h4>1. Acceptance of Terms</h4>
              <p>Your access to and use of CareerNest is conditioned on your acceptance of and compliance with these Terms.</p>
              <h4>2. User Conduct</h4>
              <p>You agree not to use the service for any unlawful purpose or to conduct any activity that infringes upon the rights of others.</p>
              <h4>3. Intellectual Property</h4>
              <p>All content and AI-generated insights on CareerNest are the property of the platform and protected by copyright laws.</p>
            </div>
          }
        />
      )}

      <div className="auth-panel glass-panel">
        <h2>{t('create_account')}</h2>
        <p className="auth-subtitle">{t('join_future')}</p>

        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">{t('full_name')} <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="text" placeholder="John Doe" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label">{t('email_addr')} <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="email" placeholder="name@company.com" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label">{t('password')} <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="password" placeholder="••••••••" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <div className="input-group">
            <label className="input-label">{t('role_label')} <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="seeker">{t('find_job')}</option>
              <option value="recruiter">{t('post_job_role')}</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="tel" placeholder="+91 8084723685" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label">Location <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="text" placeholder="City, Country" className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          {role === 'recruiter' && (
            <>
              <div className="input-group">
                <label className="input-label">Company Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input type="text" placeholder="CareerNest Inc." className="input-field" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Company Website <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input type="url" placeholder="https://company.com" className="input-field" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} required />
              </div>
            </>
          )}

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

          <div className="input-group terms-group">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms" className="terms-label">
              {t('agree_terms')} <span className="legal-link" onClick={() => setActiveModal('privacy')}>{t('privacy_policy')}</span> and <span className="legal-link" onClick={() => setActiveModal('terms')}>{t('terms_cond')}</span> <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
          </div>

          <button type="submit" className="btn-secondary auth-submit" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : t('signup')}
          </button>
        </form>

        <div className="auth-footer">
          <p>{t('already_account')} <Link to="/login">{t('sign_in_here')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
