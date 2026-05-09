import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useContext(AuthContext);
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('about');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFeedbackClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('feedback');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('feedback');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('contact');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isLightTheme, setIsLightTheme] = useState(false);

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
    document.body.classList.toggle('light-theme');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-left">
        <div className="hamburger-menu" ref={menuRef}>
          <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          {menuOpen && (
            <div className="hamburger-dropdown glass-panel">
              <a href="#about" className="nav-link dropdown-link" onClick={handleAboutClick}>{t('about')}</a>
              <a href="/" className="nav-link dropdown-link" onClick={handleHomeClick}>{t('home')}</a>
              <a href="#contact" className="nav-link dropdown-link" onClick={handleContactClick}>{t('contact')}</a>
              <Link to="/jobs" className="nav-link dropdown-link" onClick={() => setMenuOpen(false)}>{t('jobs')}</Link>
              <a href="#feedback" className="nav-link dropdown-link" onClick={handleFeedbackClick}>{t('feedback')}</a>
              <div className="dropdown-divider"></div>

              {!loading && (
                isAuthenticated ? (
                  <>
                    <div className="dropdown-user-info">
                      <span className="user-greeting">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                      <span className="user-role">{user?.role === 'recruiter' ? t('post_job') : t('resume_builder')}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/dashboard" className="nav-link dropdown-link" onClick={() => setMenuOpen(false)}>{t('dashboard')}</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="nav-link dropdown-link admin-nav-link" onClick={() => setMenuOpen(false)}>🛡️ Admin Panel</Link>
                    )}
                    {user?.role === 'recruiter' ? (
                      <Link to="/post-job" className="nav-link dropdown-link" onClick={() => setMenuOpen(false)}>{t('post_job')}</Link>
                    ) : user?.role !== 'admin' ? (
                      <Link to="/resume-builder" className="nav-link dropdown-link" onClick={() => setMenuOpen(false)}>{t('resume_builder')}</Link>
                    ) : null}
                    <div className="dropdown-divider"></div>
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-secondary dropdown-btn">{t('logout')}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link dropdown-link" onClick={() => setMenuOpen(false)}>{t('login')}</Link>
                    <Link to="/register" className="nav-link dropdown-link" onClick={() => setMenuOpen(false)}>{t('signup')}</Link>
                  </>
                )
              )}
            </div>
          )}
        </div>

        {/* Logo Left-Aligned */}
        <Link to="/" className="navbar-logo-link">
          <img src="/logo.png" alt="CareerNest Logo" className="navbar-logo" />
          <span className="brand-name">CareerNest</span>
        </Link>
      </div>

      {/* Actions on the Right */}
      <div className="navbar-right">
        <div className="navbar-actions">
          <select 
            className="lang-select-nav" 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
          
          {isAuthenticated && (
            <div className="notification-wrapper" ref={notifRef}>
              <button className="action-btn" title={t('notifications')} onClick={() => setNotifOpen(!notifOpen)}>🔔</button>
              <span className="badge">2</span>
              
              {notifOpen && (
                <div className="notification-dropdown glass-panel">
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{t('notifications')}</h4>
                  <div className="dropdown-divider"></div>
                  <div className="notification-item">
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Welcome to CareerNest! Complete your profile to get better job matches.</p>
                    <small style={{ color: 'var(--color-accent)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>2 hours ago</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="notification-item">
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Your resume was successfully parsed and saved.</p>
                    <small style={{ color: 'var(--color-accent)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>1 day ago</small>
                  </div>
                </div>
              )}
            </div>
          )}

          <button className="action-btn theme-toggle" title={t('theme')} onClick={toggleTheme}>
            {isLightTheme ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
