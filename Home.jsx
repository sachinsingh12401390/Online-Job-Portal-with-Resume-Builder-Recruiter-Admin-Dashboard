import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    { name: t('testi_1_name'), role: t('testi_1_role'), text: t('testi_1_text'), avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: t('testi_2_name'), role: t('testi_2_role'), text: t('testi_2_text'), avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: t('testi_3_name'), role: t('testi_3_role'), text: t('testi_3_text'), avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: t('testi_4_name'), role: t('testi_4_role'), text: t('testi_4_text'), avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
    { name: t('testi_5_name'), role: t('testi_5_role'), text: t('testi_5_text'), avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    { name: t('testi_6_name'), role: t('testi_6_role'), text: t('testi_6_text'), avatar: "https://randomuser.me/api/portraits/men/29.jpg" }
  ];

  const slides = [
    {
      title: t('hero_title'),
      subtitle: t('hero_subtitle'),
      image: "/hero-image.png",
      alt: "Futuristic Job Portal"
    },
    {
      title: t('resume_builder'),
      subtitle: t('feature_ats_desc'),
      image: "/resume-builder.png",
      alt: "ATS Resume Builder"
    },
    {
      title: t('contact'),
      subtitle: t('feature_recruiter_desc'),
      image: "/recruiters-network.png",
      alt: "Connect with Recruiters"
    }
  ];

  const features = [
    { title: t('jobs'), description: t('feature_ai_desc'), icon: "🤖" },
    { title: t('resume_builder'), description: t('feature_ats_desc'), icon: "📄" },
    { title: t('contact'), description: t('feature_recruiter_desc'), icon: "🤝" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  
  useEffect(() => {
    const path = window.location.pathname.substring(1);
    if (['about', 'contact', 'feedback'].includes(path)) {
      setTimeout(() => {
        const element = document.getElementById(path);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-container">
        <div className="hero-content glass-panel" key={`content-${currentSlide}`}>
          <h1 className="hero-title">{slides[currentSlide].title}</h1>
          <p className="hero-subtitle">
            {slides[currentSlide].subtitle}
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-secondary btn-lg">{t('dashboard')}</Link>
            ) : (
              <>
                <Link to="/register" className="btn-secondary btn-lg">{t('signup')}</Link>
                <Link to="/login" className="btn-secondary btn-lg">{t('login')}</Link>
              </>
            )}
          </div>

          <div className="slider-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>

        <div className="hero-image-wrapper" key={`img-${currentSlide}`}>
          <div className="glow-effect"></div>
          <img src={slides[currentSlide].image} alt={slides[currentSlide].alt} className="hero-image" />
        </div>
      </section>

      {/* About CareerNest Section */}
      <section className="about-section" id="about">
        <div className="about-content glass-panel">
          <h2 className="section-title">{t('about')} CareerNest</h2>
          <p className="about-text">
            {t('about_text')}
          </p>
        </div>
      </section>

      {/* Why CareerNest Section */}
      <section className="features-section">
        <h2 className="section-title">{t('why_choose')}</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card glass-panel">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="feedback">
        <h2 className="section-title">{t('testimonials')}</h2>
        <div className="testimonials-grid">
          {testimonials.map((test, index) => (
            <div key={index} className="testimonial-card glass-panel">
              <div className="testimonial-content">"{test.text}"</div>
              <div className="testimonial-author">
                <img src={test.avatar} alt={test.name} className="author-avatar" />
                <div>
                  <h4>{test.name}</h4>
                  <p>{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      {!isAuthenticated && (
        <section className="cta-section">
          <h2>{t('ready_career')}</h2>
          <div className="hero-buttons" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn-secondary btn-lg">{t('join_today')}</Link>
          </div>
        </section>
      )}

      {/* Professional Contact Footer */}
      <footer className="home-footer" id="contact">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <img src="/logo.png" alt="CareerNest Logo" className="footer-logo" />
              <h3>CareerNest</h3>
            </div>
            <p>{t('footer_desc')}</p>
          </div>

          <div className="footer-links">
            <h4>{t('quick_links')}</h4>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/jobs">{t('jobs')}</Link></li>
              <li><Link to="/resume-builder">{t('resume_builder')}</Link></li>
              <li><Link to="/login">{t('login')}</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>{t('contact_us')}</h4>
            <ul>
              <li><span>📍</span> {t('address')}</li>
              <li><span>📧</span> support@careernest.ai</li>
              <li><span>📞</span> 8084723685</li>
            </ul>
          </div>

          <div className="footer-map">
            <h4>{t('location')}</h4>
            <div className="map-wrapper glass-panel" style={{ padding: '0', overflow: 'hidden', height: '180px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3410.72639912061!2d75.70295487535562!3d31.255996360155737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391af58fd060936d%3A0x69601d3106198dfa!2sGT%20Road%2C%20Phagwara%2C%20Punjab!5e0!3m2!1sen!2sin!4v1714391000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CareerNest Location"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {t('rights_reserved')}</p>
          <div className="social-links">
            <span>LinkedIn</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
