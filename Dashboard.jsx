import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import RecruiterDashboard from '../components/RecruiterDashboard';
import SeekerDashboard from '../components/SeekerDashboard';
import SmartDiscovery from '../components/SmartDiscovery';
import ApplicationATS from '../components/ApplicationATS';
import SavedJobs from '../components/SavedJobs';
import Messages from '../components/Messages';
import InterviewManager from '../components/InterviewManager';
import Notifications from '../components/Notifications';
import AnalyticsInsights from '../components/AnalyticsInsights';
import CareerPath from '../components/CareerPath';
import { useLanguage } from '../context/LanguageContext';
import { useRef } from 'react';

const ProfileSettings = ({ user }) => {
  const { updateUser } = useContext(AuthContext);
  const [activeSettingsTab, setActiveSettingsTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    location: user.location || '',
    companyName: user.companyName || '',
    companyWebsite: user.companyWebsite || '',
    culture: user.culture || '',
    profileImage: user.profileImage || '',
    companyLogo: user.companyLogo || '',
    skills: user.skills || [],
    experience: user.experience || [],
    projects: user.projects || [],
    resumePath: user.resumePath || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/auth/upload', uploadData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      const filePath = res.data.filePath;
      if (type === 'profile') {
        setFormData({ ...formData, profileImage: filePath });
      } else {
        setFormData({ ...formData, companyLogo: filePath });
      }
      alert('Image uploaded successfully! Click save to apply changes.');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(res.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'personal' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('personal')}>👤 Personal Info</button>
        {user.role === 'seeker' && (
          <>
            <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'professional' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('professional')}>💼 Professional Profile</button>
            <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'resume' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('resume')}>📄 Resume Management</button>
          </>
        )}
        {user.role === 'recruiter' && (
          <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'company' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('company')}>🏢 Company Profile</button>
        )}
        <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'notifications' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('notifications')}>🔔 Notifications</button>
        <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'security' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('security')}>🔒 Security & Password</button>
        <button className="btn-secondary" style={{ textAlign: 'left', background: activeSettingsTab === 'privacy' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setActiveSettingsTab('privacy')}>👁️ Privacy Settings</button>
      </div>

      {/* Content */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {activeSettingsTab === 'personal' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Personal Information</h3>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', overflow: 'hidden' }}>
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : user.name.charAt(0)}
              </div>
              <div>
                <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'profile')} style={{ display: 'none' }} accept="image/*" />
                <button type="button" className="btn-secondary" style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }} onClick={() => fileInputRef.current.click()}>📷 Upload Profile Image</button>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Recommended size: 256x256px. Max 2MB.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" name="name" className="input-field" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" value={user.email} disabled />
                <small style={{ opacity: 0.5, marginTop: '4px', display: 'block' }}>Email cannot be changed.</small>
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" name="phone" className="input-field" placeholder="+91 0000000000" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Location</label>
                <input type="text" name="location" className="input-field" placeholder="City, Country" value={formData.location} onChange={handleInputChange} required />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeSettingsTab === 'professional' && user.role === 'seeker' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Professional Profile</h3>
            
            <div className="input-group">
              <label className="input-label">Skills (comma separated)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="React, Node.js, TypeScript, UI/UX..." 
                value={formData.skills.join(', ')} 
                onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})} 
              />
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Experience</h4>
              {formData.experience.map((exp, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <input type="text" placeholder="Job Title" className="input-field" style={{ marginBottom: '0.5rem' }} value={exp.title} onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[i].title = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }} />
                  <input type="text" placeholder="Company" className="input-field" style={{ marginBottom: '0.5rem' }} value={exp.company} onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[i].company = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }} />
                </div>
              ))}
              <button type="button" className="btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => setFormData({...formData, experience: [...formData.experience, { title: '', company: '', duration: '', description: '' }]})}>+ Add Experience</button>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        )}

        {activeSettingsTab === 'resume' && user.role === 'seeker' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Resume Management</h3>
            
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Resume Strength Meter</h4>
              <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #60a5fa, #10b981)', transition: 'width 1s ease' }}></div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold' }}>Current Score: 75% - Strong</p>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-accent)' }}>✨ AI Missing Skill Suggestions:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', opacity: 0.8 }}>
                  <li>Add <strong>Docker</strong> or <strong>Kubernetes</strong> to stand out for DevOps roles.</li>
                  <li>Your experience mentions <strong>Testing</strong>, but specific frameworks like <strong>Jest</strong> are missing.</li>
                </ul>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ margin: '0 0 1.5rem 0' }}>Upload New Resume</h4>
              <div style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '3rem', textAlign: 'center', borderRadius: '12px', cursor: 'pointer' }} onClick={() => alert('File picker opened...')}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
                <p style={{ marginBottom: '0.5rem' }}>Drag & drop your resume here, or click to browse</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Supports PDF, DOCX (Max 5MB)</p>
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'company' && user.role === 'recruiter' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Company Profile Management</h3>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', overflow: 'hidden' }}>
                {formData.companyLogo ? (
                  <img src={formData.companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : '🏢'}
              </div>
              <div>
                <input type="file" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} style={{ display: 'none' }} accept="image/*" />
                <button type="button" className="btn-secondary" style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }} onClick={() => logoInputRef.current.click()}>📷 Upload Company Logo</button>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Recommended format: PNG transparent.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input type="text" name="companyName" className="input-field" placeholder="e.g. CareerNest Inc." value={formData.companyName} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Company Website</label>
                <input type="url" name="companyWebsite" className="input-field" placeholder="https://www.company.com" value={formData.companyWebsite} onChange={handleInputChange} required />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Culture Description</label>
                <textarea name="culture" className="input-field" placeholder="Describe your company culture, values, and mission..." style={{ minHeight: '100px' }} value={formData.culture} onChange={handleInputChange} required></textarea>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Company Info'}
            </button>
          </form>
        )}

        {activeSettingsTab === 'notifications' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Notifications Management</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Configure how you receive updates and alerts.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>New Applications Alert</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Get notified instantly when a candidate applies to your jobs.</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Interview Reminders</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Receive 24h and 1h reminders before scheduled interviews.</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Candidate Messages</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Email notifications when you receive a direct message.</div>
                </div>
              </label>
              <button className="btn-primary" style={{ marginTop: '2rem', alignSelf: 'flex-start' }} onClick={() => alert('Notification preferences saved!')}>Save Preferences</button>
            </div>
          </div>
        )}

        {activeSettingsTab === 'security' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Security & Account Settings</h3>
            
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Two-Factor Authentication (2FA)</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>Add an extra layer of security to your account.</p>
              <button className="btn-secondary" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }} onClick={() => alert('2FA Setup Wizard Started!')}>🔐 Enable Two-Factor Auth</button>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Change Password</h4>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '400px' }}>
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => alert('Password updated successfully!')}>Update Password</button>
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'privacy' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Privacy Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Profile Visibility</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Allow recruiters to find my profile in searches.</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Email Notifications</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Receive updates about job applications and platform news.</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>Show Resume to Public</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Anyone with your profile link can view your resume.</div>
                </div>
              </label>
              <button className="btn-primary" style={{ marginTop: '2rem', alignSelf: 'flex-start' }} onClick={() => alert('Privacy settings saved successfully!')}>Save Privacy Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const { t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (user && user.role === 'seeker') {
        try {
          const token = localStorage.getItem('token');
          // Fetch applications
          const appRes = await axios.get('/api/jobs/my-applications', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApplications(appRes.data);

          // Fetch all jobs for suggestions
          const jobsRes = await axios.get('/api/jobs');
          setAllJobs(jobsRes.data);
        } catch (err) {
          console.error('Error fetching student activity:', err);
        } finally {
          setIsDataLoading(false);
        }
      } else {
        setIsDataLoading(false);
      }
    };

    if (user) fetchStudentData();
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      const filtered = allJobs.filter(job => 
        job.title.toLowerCase().includes(value.toLowerCase()) ||
        job.company.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    navigate(`/jobs?search=${encodeURIComponent(title)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading || isDataLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ padding: '4rem 2rem', color: 'var(--color-text-primary)' }}>
      <div className="glass-panel" style={{ padding: '4rem', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--color-accent), var(--color-success))' }}></div>
        
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                {user.role === 'recruiter' ? t('recruiter_dash') : t('seeker_dash')}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: 0 }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>{user.name}</span>
                <span style={{ opacity: 0.5 }}> · {user.role}</span>
              </p>
            </div>

            {/* Search + Notification bell */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user.role === 'seeker' && (
                <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search jobs…"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ margin: 0, paddingLeft: '2.2rem', paddingRight: '1rem', width: '220px', fontSize: '0.88rem' }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  />
                  <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }}>🔍</span>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="glass-panel" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100, padding: '0.5rem 0', borderRadius: '10px', overflow: 'hidden' }}>
                      {suggestions.map(job => (
                        <div
                          key={job._id}
                          style={{ padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}
                          onMouseDown={() => handleSuggestionClick(job.title)}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <strong>{job.title}</strong>
                          <span style={{ opacity: 0.5, marginLeft: '0.5rem', fontSize: '0.78rem' }}>{job.company}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              )}
              <div
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => setActiveMainTab('notifications')}
                title="Notifications"
              >
                <span style={{ fontSize: '1.6rem' }}>🔔</span>
                <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.6rem', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid var(--color-bg-primary)' }}>3</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Tab Navigation ── */}
        <div className="dashboard-tabs" style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {[
            { key: 'overview',       label: 'Overview',        show: true },
            { key: 'discovery',      label: 'Discover ✨',     show: user.role === 'seeker' },
            { key: 'ats',            label: 'My Journey 📑',   show: user.role === 'seeker' },
            { key: 'saved',          label: 'Wishlist ❤️',     show: user.role === 'seeker' },
            { key: 'messages',       label: 'Messages 💬',     show: user.role === 'seeker' },
            { key: 'interviews',     label: 'Interviews 📅',   show: user.role === 'seeker' },
            { key: 'notifications',  label: 'Alerts 🔔',       show: user.role === 'seeker' },
            { key: 'analytics',      label: 'Analytics 📊',    show: user.role === 'seeker' },
            { key: 'career',         label: 'Career 🚀',       show: user.role === 'seeker' },
            { key: 'settings',       label: 'Settings ⚙️',     show: true },
          ].filter(t => t.show).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveMainTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeMainTab === tab.key ? '3px solid var(--color-accent)' : '3px solid transparent',
                color: activeMainTab === tab.key ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '0.88rem',
                fontWeight: activeMainTab === tab.key ? '700' : '500',
                cursor: 'pointer',
                padding: '0.6rem 0.9rem',
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                flexShrink: 0,
                fontFamily: 'var(--font-primary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {activeMainTab === 'settings' ? (
          <ProfileSettings user={user} />
        ) : activeMainTab === 'discovery' ? (
          <SmartDiscovery user={user} />
        ) : activeMainTab === 'ats' ? (
          <ApplicationATS applications={applications} />
        ) : activeMainTab === 'saved' ? (
          <SavedJobs />
        ) : activeMainTab === 'messages' ? (
          <Messages user={user} />
        ) : activeMainTab === 'interviews' ? (
          <InterviewManager applications={applications} />
        ) : activeMainTab === 'notifications' ? (
          <Notifications />
        ) : activeMainTab === 'analytics' ? (
          <AnalyticsInsights applications={applications} />
        ) : activeMainTab === 'career' ? (
          <CareerPath user={user} />
        ) : user.role === 'recruiter' ? (
          <RecruiterDashboard />
        ) : (
          <SeekerDashboard applications={applications} user={user} t={t} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
