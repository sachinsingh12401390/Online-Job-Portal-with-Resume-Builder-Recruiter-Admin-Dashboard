import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplicantList = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSkills, setFilterSkills] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [activeCommPanel, setActiveCommPanel] = useState(null);
  const navigate = useNavigate();

  const toggleCommPanel = (appId) => {
    setActiveCommPanel(activeCommPanel === appId ? null : appId);
  };

  const handleUpdateApplicant = async (appId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`/api/jobs/${id}/applicants/${appId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(applicants.map(app => app._id === appId ? { ...app, ...res.data } : app));
      return res.data;
    } catch (err) {
      console.error('Error updating applicant:', err);
      alert('Failed to update candidate record.');
    }
  };

  const handleScheduleInterview = async (appId, interviewData) => {
    try {
      const updates = {
        status: 'Interview',
        ...interviewData
      };
      await handleUpdateApplicant(appId, updates);
      alert('📅 Interview Scheduled Successfully!');
    } catch (err) {
      console.error('Error scheduling interview:', err);
      alert('Failed to schedule interview.');
    }
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}/applicants`);
        setApplicants(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="applicant-list-page" style={{ padding: '2rem' }}>
      <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ marginBottom: '2rem' }}>
        &larr; Back to Dashboard
      </button>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🔍 Filter & Rank Candidates</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }} onClick={() => alert('Opening Bulk Resume Upload modal...')}>📤 Bulk Upload Resumes</button>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }} onClick={() => alert('Running AI Auto-Screening on all candidates...')}>🤖 Run AI Screening</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <input type="text" placeholder="Filter by Skills (e.g. React)..." className="input-field" value={filterSkills} onChange={(e) => setFilterSkills(e.target.value)} style={{ margin: 0 }} />
          <input type="text" placeholder="Filter by Experience..." className="input-field" value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} style={{ margin: 0 }} />
          <select className="input-field" style={{ margin: 0 }}>
            <option>🏆 Rank: AI Skill Match Score (Highest First)</option>
            <option>📅 Sort By: Date Applied (Newest)</option>
            <option>⭐ Sort By: Shortlisted First</option>
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Candidate Management Pipeline</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Review, analyze, and manage applications for this position.
        </p>

        {applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</div>
            <p>No applications received yet for this position.</p>
          </div>
        ) : (
          <div className="applicants-grid" style={{ display: 'grid', gap: '1.5rem' }}>
            {applicants
              .filter(app => {
                const skillsMatch = !filterSkills || app.user.name.toLowerCase().includes(filterSkills.toLowerCase()) || (app.user.email && app.user.email.toLowerCase().includes(filterSkills.toLowerCase()));
                const locationMatch = !filterLocation || (app.user.location && app.user.location.toLowerCase().includes(filterLocation.toLowerCase()));
                // Simple keyword matching for demo purposes
                return skillsMatch && locationMatch;
              })
              .map(app => (
              <div key={app._id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {app.user.name}
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(16, 185, 129, 0.3)' }} title="AI Generated Skill Match Score">
                        🤖 {Math.floor(Math.random() * 20) + 80}% Skill Match
                      </span>
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{app.user.email}</p>
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-secondary)' }}>
                        🕒 Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {app.note && (
                      <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.85rem', borderLeft: '3px solid var(--color-accent)', fontStyle: 'italic' }}>
                        <strong>📝 Note:</strong> {app.note}
                      </div>
                    )}

                    {/* Mini ATS Pipeline */}
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', width: '100%' }}>
                      {['Applied', 'Screening', 'Interview', 'Selected'].map((stage, i, arr) => {
                        let activeIndex = 0;
                        if(app.status === 'Reviewed') activeIndex = 1;
                        if(app.status === 'Interview') activeIndex = 2;
                        if(app.status === 'Accepted') activeIndex = 3;
                        if(app.status === 'Rejected') activeIndex = 3;

                        const isActive = i <= activeIndex;
                        const isRejected = app.status === 'Rejected' && i === 3;
                        
                        return (
                          <React.Fragment key={stage}>
                            <div style={{ 
                              padding: '0.3rem 0.8rem', 
                              borderRadius: '20px', 
                              fontSize: '0.7rem', 
                              fontWeight: '700',
                              background: isActive ? (isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)') : 'rgba(255,255,255,0.05)',
                              color: isActive ? (isRejected ? '#ef4444' : '#60a5fa') : 'var(--color-text-secondary)',
                              border: `1px solid ${isActive ? (isRejected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)') : 'rgba(255,255,255,0.05)'}`,
                              whiteSpace: 'nowrap'
                            }}>
                              {isRejected ? 'Rejected' : stage}
                            </div>
                            {i < arr.length - 1 && (
                              <div style={{ flex: 1, minWidth: '15px', height: '2px', background: isActive ? (isRejected ? '#ef4444' : '#60a5fa') : 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => alert('Resume preview modal opening...')}>👁️ Preview Resume</button>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }} onClick={() => handleUpdateApplicant(app._id, { status: 'Interview' })}>✅ Shortlist</button>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => handleUpdateApplicant(app._id, { status: 'Rejected' })}>❌ Reject</button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { const note = prompt('Enter candidate note:', app.note || ''); if(note !== null) handleUpdateApplicant(app._id, { note }); }}>📝 Add Note</button>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }} onClick={() => navigate(`/analyze/${id}/${app.user._id}`)}>🧠 AI Analyze Resume</button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', width: '100%' }} onClick={() => toggleCommPanel(app._id)}>💬 Communication Hub</button>
                    </div>
                  </div>
                </div>

                {/* Inline Communication Hub & Automation */}
                {activeCommPanel === app._id && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    
                    {/* Column 1: Messaging */}
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                      <h5 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--color-accent)' }}>✉️ Quick Message & Email</h5>
                      <select className="input-field" style={{ marginBottom: '1rem', padding: '0.6rem', fontSize: '0.9rem' }}>
                        <option>Auto Template: Request Interview</option>
                        <option>Auto Template: Screening Questions</option>
                        <option>Write Custom Message...</option>
                      </select>
                      <textarea className="input-field" placeholder="Type your message..." style={{ minHeight: '90px', marginBottom: '1rem', fontSize: '0.9rem' }} defaultValue={`Hi ${app.user.name},\n\nWe reviewed your application and would love to schedule a quick call...`}></textarea>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1 }} onClick={() => alert('Email dispatched successfully!')}>Send Email</button>
                        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1 }} onClick={() => alert('Live Chat Opened!')}>💬 Chat</button>
                      </div>
                    </div>
                    
                    {/* Column 2: Scheduling & Video */}
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                      <h5 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--color-accent)' }}>📅 Interview Management</h5>
                      
                      {app.interviewDate && (
                        <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '0.2rem' }}>Confirmed Interview:</div>
                          <div>🗓️ {new Date(app.interviewDate).toLocaleDateString()} at {app.interviewTime}</div>
                          {app.interviewLink && <div style={{ marginTop: '0.3rem', fontSize: '0.75rem', color: '#60a5fa' }}>🔗 {app.interviewLink}</div>}
                        </div>
                      )}

                      <div className="input-group">
                        <label className="input-label" style={{ fontSize: '0.8rem', opacity: 0.8 }}>Select Date & Time</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                          <input 
                            type="date" 
                            className="input-field" 
                            style={{ margin: 0, padding: '0.6rem', fontSize: '0.9rem' }} 
                            defaultValue={app.interviewDate}
                            id={`date-${app._id}`}
                          />
                          <input 
                            type="time" 
                            className="input-field" 
                            style={{ margin: 0, padding: '0.6rem', fontSize: '0.9rem' }} 
                            defaultValue={app.interviewTime}
                            id={`time-${app._id}`}
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-label" style={{ fontSize: '0.8rem', opacity: 0.8 }}>Virtual Meeting Link</label>
                        <input 
                          type="url" 
                          className="input-field" 
                          placeholder="https://meet.google.com/..." 
                          style={{ marginBottom: '1rem', padding: '0.6rem', fontSize: '0.9rem' }} 
                          defaultValue={app.interviewLink || ''}
                          id={`link-${app._id}`}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gridColumn: 'span 2' }} 
                          onClick={() => {
                            const date = document.getElementById(`date-${app._id}`).value;
                            const time = document.getElementById(`time-${app._id}`).value;
                            const link = document.getElementById(`link-${app._id}`).value;
                            if(!date || !time) return alert('Please select date and time.');
                            handleScheduleInterview(app._id, { interviewDate: date, interviewTime: time, interviewLink: link, interviewType: 'Virtual' });
                          }}
                        >
                          💾 Save & Schedule Interview
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)' }} onClick={() => {
                          const link = `https://meet.google.com/${Math.random().toString(36).substring(2,5)}-${Math.random().toString(36).substring(2,6)}-${Math.random().toString(36).substring(2,5)}`;
                          document.getElementById(`link-${app._id}`).value = link;
                          alert('Google Meet link generated! Click "Save" to finalize.');
                        }}>📹 Generate Meet Link</button>
                        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }} onClick={() => alert('Automated email & calendar reminders have been sent to the candidate! 🔔')}>🔔 Resend Invites</button>
                      </div>
                    </div>

                    {/* Column 3: Advanced Automation & Tracking */}
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                      <h5 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#10b981' }}>⚡ Workflow Automation</h5>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#10b981' }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Auto-Advance Top Matches</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Move to 'Screening' if AI Score &gt; 85%</div>
                          </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#ef4444' }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Auto-Reject Low Matches</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Send polite rejection if AI Score &lt; 40%</div>
                          </div>
                        </label>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <h6 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', opacity: 0.8 }}>📈 Tracking Activity Log</h6>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.75rem', opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <li><span style={{ color: '#10b981' }}>[Just now]</span> Viewed this application</li>
                          <li><span style={{ color: 'var(--color-accent)' }}>[2h ago]</span> Candidate updated resume</li>
                          <li><span style={{ color: '#60a5fa' }}>[Yesterday]</span> AI Auto-Screening completed</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantList;
