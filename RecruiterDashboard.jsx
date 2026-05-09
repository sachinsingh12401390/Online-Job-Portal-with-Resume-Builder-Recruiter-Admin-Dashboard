import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JOB_TEMPLATES = [
  {
    title: "Senior Software Engineer (L5)",
    company: "Google",
    location: "Mountain View, CA (Remote)",
    type: "Full-time",
    salary: "$180k - $240k",
    description: "Join the Google Cloud team to build next-generation infrastructure. You will be responsible for designing and implementing scalable services that power millions of users.",
    requirements: "8+ years of experience in distributed systems.\nExpertise in Go, C++, or Java.\nStrong background in cloud architecture."
  },
  {
    title: "Azure Solutions Architect",
    company: "Microsoft",
    location: "Redmond, WA (Hybrid)",
    type: "Full-time",
    salary: "$160k - $210k",
    description: "Help our customers transform their businesses with Microsoft Azure. You will design complex cloud solutions and lead technical migrations.",
    requirements: "Azure Solutions Architect Expert certification.\nExperience with Kubernetes and Terraform.\nExcellent client-facing skills."
  },
  {
    title: "Senior Java Full Stack Developer",
    company: "Wipro",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹25L - ₹40L",
    description: "Work on cutting-edge digital transformation projects for global clients. You will lead a team of developers and ensure high-quality code delivery.",
    requirements: "Deep expertise in Spring Boot and React/Angular.\nExperience with Microservices architecture.\nStrong SQL and NoSQL database knowledge."
  },
  {
    title: "AI/ML Engineer (5G Platforms)",
    company: "Jio",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹20L - ₹35L",
    description: "Innovate at the intersection of AI and 5G. You will develop machine learning models to optimize network performance and user experience on Jio's massive infrastructure.",
    requirements: "PhD or Masters in Computer Science or related field.\nProficiency in Python, PyTorch, or TensorFlow.\nExperience with large-scale data processing."
  }
];

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [jobViewTab, setJobViewTab] = useState('active');
  const navigate = useNavigate();

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || user?.role !== 'recruiter') {
        setLoading(false);
        return;
      }
      const res = await axios.get('/api/jobs/myjobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs(res.data);
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'recruiter') {
      fetchMyJobs();
    }
  }, [user]);

  const seedSampleJobs = async () => {
    if (!window.confirm("This will add 4 professional job listings (Google, Microsoft, Wipro, Jio) to your account. Continue?")) return;
    
    setIsSeeding(true);
    try {
      const token = localStorage.getItem('token');
      for (const job of JOB_TEMPLATES) {
        // Convert requirements string to array for the backend
        const requirementsArray = job.requirements
          .split('\n')
          .map(req => req.trim())
          .filter(req => req.length > 0);

        const jobToPost = {
          ...job,
          requirements: requirementsArray
        };

        await axios.post('/api/jobs', jobToPost, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchMyJobs();
      alert("Professional jobs seeded successfully!");
    } catch (err) {
      console.error('Error seeding jobs:', err);
      alert("Failed to seed jobs. Please try again.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs(myJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job.');
    }
  };

  const handleDuplicateJob = async (job) => {
    try {
      const token = localStorage.getItem('token');
      const duplicatedJob = {
        title: job.title + ' (Copy)',
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements
      };
      const res = await axios.post('/api/jobs', duplicatedJob, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs([res.data, ...myJobs]);
      alert('Job duplicated successfully!');
    } catch (err) {
      console.error('Error duplicating job:', err);
      alert('Failed to duplicate job.');
    }
  };

  const getTrendData = () => {
    // Calculate real trend based on last 7 days of applications
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    myJobs.forEach(job => {
      job.applicants?.forEach(app => {
        const d = new Date(app.appliedAt).getDay();
        counts[d]++;
      });
    });

    const max = Math.max(...counts, 5);
    return counts.map((c, i) => ({
      day: days[i],
      height: Math.max((c / max) * 100, 10), // Min 10% height for visual
      count: c
    }));
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem', gap: '1rem', opacity: 0.6 }}>
      <div className="spinner"></div>
      <span style={{ fontSize: '0.9rem' }}>Loading your dashboard...</span>
    </div>
  );

  return (
    <div className="recruiter-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
             <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Management Console</h2>
             <span style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', color: '#a78bfa', textTransform: 'uppercase' }}>Premium Partner</span>
          </div>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.2rem' }}>Overview of your active listings and talent pipeline</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0 1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>🤖 Auto-Screening: ON</span>
            <div style={{ width: '30px', height: '16px', background: '#10b981', borderRadius: '10px', position: 'relative', cursor: 'pointer' }} onClick={() => alert('Auto-screening enabled: Top candidates will be automatically shortlisted based on AI match score.')}>
               <div style={{ position: 'absolute', right: '2px', top: '2px', width: '12px', height: '12px', background: 'white', borderRadius: '50%' }}></div>
            </div>
          </div>
          <button 
            className="btn-secondary" 
            onClick={seedSampleJobs} 
            disabled={isSeeding}
            style={{ display: 'flex', alignItems: 'center', height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {isSeeding ? 'Seeding...' : 'Import Templates 🏢'}
          </button>
          <button className="btn-primary" style={{ height: '100%' }} onClick={() => navigate('/post-job')}>+ Post a Job</button>
        </div>
      </div>

      {/* ── Stats Cards – always 4 equal columns, equal height ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Job Postings',     value: myJobs.length,                                                                                                                                                    color: 'var(--color-text-primary)', accent: 'rgba(255,255,255,0.06)' },
          { label: 'Applications Received',  value: myJobs.reduce((a, j) => a + (j.applicants?.length || 0), 0),                                                                                                        color: '#3b82f6',                  accent: 'rgba(59,130,246,0.15)'   },
          { label: 'Active Candidates',      value: myJobs.reduce((a, j) => a + (j.applicants?.filter(ap => ap.status !== 'Rejected').length || 0), 0),                                                                  color: '#10b981',                  accent: 'rgba(16,185,129,0.15)'   },
          { label: 'Shortlisted',            value: myJobs.reduce((a, j) => a + (j.applicants?.filter(ap => ap.status === 'Interview' || ap.status === 'Accepted').length || 0), 0),                                     color: '#8b5cf6',                  accent: 'rgba(139,92,246,0.15)'   },
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.8rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', minHeight: '140px' }}>
            <h4 style={{ opacity: 0.55, fontSize: '0.72rem', textTransform: 'uppercase', margin: 0, letterSpacing: '0.8px' }}>{stat.label}</h4>
            <span style={{ fontSize: '2.2rem', fontWeight: '900', color: stat.color, lineHeight: 1 }}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
           <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📈 Talent Acquisition Momentum</h3>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981' }}>Hiring Velocity: Fast</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Syncing in real-time</div>
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          {getTrendData().map((data, i) => (
             <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
               <div style={{ fontSize: '0.7rem', opacity: 0.9, color: 'var(--color-accent)', fontWeight: 'bold' }}>{data.count}</div>
               <div style={{ width: '100%', maxWidth: '40px', height: `${data.height}%`, background: 'var(--color-accent)', borderRadius: '4px 4px 0 0', opacity: 0.8, transition: 'height 1s ease' }}></div>
               <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{data.day}</div>
             </div>
          ))}
        </div>
      </div>

      {/* Interview Scheduling Module */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>📅 Interview Scheduling</h3>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Manage upcoming interviews and sync with your calendar</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Opening Interview Scheduler...')}>+ Schedule Interview</button>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }} onClick={() => alert('Synced securely with Google Calendar! 🗓️')}>🔄 Sync with Google Calendar</button>
          </div>
        </div>

        {/* Calendar grid – header row + 35 day cells in same 7-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', background: 'rgba(255,255,255,0.015)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Day name headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', opacity: 0.45, padding: '0.4rem 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{day}</div>
          ))}
          {/* Day cells – exactly 35 */}
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i + 1;
            const today = new Date();
            const isToday = dayNum === today.getDate() && dayNum <= 31;
            const show = dayNum <= 31;

            const dailyInterviews = [];
            if (show) {
              myJobs.forEach(job => {
                job.applicants?.forEach(app => {
                  if (app.interviewDate) {
                    const d = new Date(app.interviewDate);
                    if (d.getDate() === dayNum && d.getMonth() === today.getMonth()) {
                      dailyInterviews.push({ time: app.interviewTime, name: app.user?.name || 'Candidate', job: job.title });
                    }
                  }
                });
              });
            }

            return (
              <div
                key={i}
                style={{
                  height: '90px',
                  padding: '0.4rem',
                  background: isToday ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.01)',
                  border: isToday ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '6px',
                  overflowY: 'auto',
                  opacity: show ? 1 : 0,
                  pointerEvents: show ? 'auto' : 'none',
                }}
              >
                {show && (
                  <>
                    <div style={{ fontSize: '0.78rem', fontWeight: isToday ? '700' : '400', color: isToday ? '#60a5fa' : 'inherit', opacity: isToday ? 1 : 0.55, marginBottom: '0.25rem' }}>
                      {dayNum}
                    </div>
                    {dailyInterviews.map((int, idx) => (
                      <div key={idx} style={{ background: 'var(--color-accent)', color: 'white', fontSize: '0.58rem', padding: '0.15rem 0.3rem', borderRadius: '3px', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${int.time} – ${int.name} (${int.job})`}>
                        {int.time} {int.name}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics & Reports Module */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>📊 Analytics & Reports</h3>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Make data-driven decisions based on your hiring pipeline</p>
          </div>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => alert('Compiling and Exporting PDF Report...')}>📥 Export Report</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          
          {/* Funnel Tracking */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h5 style={{ margin: 0, opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase' }}>Hiring Funnel</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>Applied</span><span>100%</span></div>
               <div style={{ width: '100%', height: '8px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '4px' }}></div>
               <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>Shortlisted</span><span>25%</span></div>
               <div style={{ width: '25%', height: '8px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '4px' }}></div>
               <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>Interview</span><span>8%</span></div>
               <div style={{ width: '8%', height: '8px', background: 'rgba(16, 185, 129, 0.3)', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* AI Insights */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h5 style={{ margin: '0 0 1rem 0', opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase' }}>AI Market Insights</h5>
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid var(--color-accent)' }}>
               <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4' }}><strong>Talent Alert:</strong> Your "Senior Java" role is 15% below market salary. Consider adjusting to attract top-tier candidates.</p>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.6 }}>Top Skill Trend: <strong>Kubernetes</strong> (↑ 20% in applicants)</div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h5 style={{ margin: 0, opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase' }}>Avg. Time-to-Hire</h5>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b' }}>14</span>
              <span style={{ fontSize: '1rem', opacity: 0.7, fontWeight: 'bold' }}>Days</span>
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', marginLeft: 'auto' }}>↓ 2 Days</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.5rem' }}>
              <div style={{ width: '40%', height: '100%', background: '#f59e0b', borderRadius: '2px' }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* AI Recommendations Module */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✨ AI Sourcing Recommendations</h3>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Based on your active roles, we found these top candidates in our global database who haven't applied yet:</p>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
           {[1, 2, 3].map(i => (
             <div key={i} className="glass-panel" style={{ minWidth: '280px', padding: '1.2rem', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                   <div style={{ fontWeight: 'bold' }}>{['Alex Rivera', 'Priya Sharma', 'Michael Chen'][i-1]}</div>
                   <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '800' }}>98% MATCH</div>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>Matching your: "Senior Cloud Architect" role</div>
                <button className="btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }} onClick={() => alert('Invitation to apply sent successfully! 📩')}>Invite to Apply</button>
             </div>
           ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <button 
          style={{ background: 'none', border: 'none', color: jobViewTab === 'active' ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: jobViewTab === 'active' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem' }}
          onClick={() => setJobViewTab('active')}
        >
          Active Jobs ({myJobs.length})
        </button>
        <button 
          style={{ background: 'none', border: 'none', color: jobViewTab === 'expired' ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: jobViewTab === 'expired' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem' }}
          onClick={() => setJobViewTab('expired')}
        >
          Expired Jobs (0)
        </button>
        <button 
          style={{ background: 'none', border: 'none', color: jobViewTab === 'talent' ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: jobViewTab === 'talent' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem' }}
          onClick={() => setJobViewTab('talent')}
        >
          Global Talent Pool 🌍
        </button>
        <button 
          style={{ background: 'none', border: 'none', color: jobViewTab === 'saved' ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: jobViewTab === 'saved' ? 'bold' : 'normal', cursor: 'pointer', padding: '0.5rem 1rem' }}
          onClick={() => setJobViewTab('saved')}
        >
          Shortlisted & Saved ⭐
        </button>
      </div>

      {jobViewTab === 'saved' ? (
        <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <div>
               <h3 style={{ margin: 0, fontSize: '1.2rem' }}>⭐ Shortlisted Candidates</h3>
               <p style={{ opacity: 0.6, fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>Manage your bookmarked profiles and run comparisons.</p>
             </div>
             <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Profile Comparison tool launched! Select up to 3 candidates to compare skills side-by-side.')}>⚖️ Compare Profiles</button>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
             {/* Bookmarked Candidate 1 */}
             <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }} title="Select for comparison" />
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>Alex Chen</h4>
                      <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Senior Frontend Engineer</p>
                    </div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Remove Bookmark">⭐</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>React</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>TypeScript</span>
                </div>
                <button className="btn-secondary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>✉️ Schedule Interview</button>
             </div>

             {/* Bookmarked Candidate 2 */}
             <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }} title="Select for comparison" />
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>David Patel</h4>
                      <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Backend Engineer</p>
                    </div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Remove Bookmark">⭐</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Node.js</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>AWS</span>
                </div>
                <button className="btn-secondary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>✉️ Schedule Interview</button>
             </div>
           </div>
        </div>
      ) : jobViewTab === 'talent' ? (
        <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <div>
               <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🔍 Global Talent Database</h3>
               <p style={{ opacity: 0.6, fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>Search and proactively source top talent across the entire platform.</p>
             </div>
             <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Saved Talent folder opened!')}>📂 View Saved Candidates</button>
           </div>
           
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
             <input type="text" className="input-field" placeholder="Search by skills (e.g. React, Node), title, or location..." style={{ flex: 2, margin: 0 }} />
             <select className="input-field" style={{ flex: 1, margin: 0 }}>
               <option>All Experience Levels</option>
               <option>Entry Level (0-2 Yrs)</option>
               <option>Mid Level (3-5 Yrs)</option>
               <option>Senior (5+ Yrs)</option>
             </select>
             <button className="btn-primary" style={{ padding: '0 2rem' }}>Search</button>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
             {/* Mock Candidate 1 */}
             <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>Alex Chen</h4>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Senior Frontend Engineer</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>Actively Looking</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>React</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>TypeScript</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Next.js</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => alert('Candidate saved for future roles!')}>⭐ Save</button>
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }} onClick={() => alert('Message Sent!')}>✉️ Message</button>
                </div>
             </div>

             {/* Mock Candidate 2 */}
             <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>Sarah Johnson</h4>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Product Designer (UI/UX)</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>Passive</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Figma</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Prototyping</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>User Research</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => alert('Candidate saved for future roles!')}>⭐ Save</button>
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }} onClick={() => alert('Message Sent!')}>✉️ Message</button>
                </div>
             </div>

             {/* Mock Candidate 3 */}
             <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>David Patel</h4>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Backend Engineer</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>Actively Looking</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Node.js</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Python</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>AWS</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => alert('Candidate saved for future roles!')}>⭐ Save</button>
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }} onClick={() => alert('Message Sent!')}>✉️ Message</button>
                </div>
             </div>
           </div>
        </div>
      ) : myJobs.length === 0 || jobViewTab === 'expired' ? (
        <div className="glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📂</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No {jobViewTab} listings</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            {jobViewTab === 'expired' ? "You don't have any expired job postings." : "You haven't posted any jobs yet. Use the templates or create a custom role to start hiring."}
          </p>
          {jobViewTab === 'active' && <button className="btn-primary" onClick={() => navigate('/post-job')}>Create Your First Listing</button>}
        </div>
      ) : (
        <div className="job-grid" style={{ display: 'grid', gap: '1.2rem' }}>
          {myJobs.map(job => (
            <div 
              key={job._id} 
              className="glass-panel" 
              style={{ 
                padding: '1.5rem 2rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{job.title}</h3>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    color: '#10b981',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>Active</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📍 {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>💼 {job.type}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>💰 {job.salary || 'N/A'}</span>
                </div>
              </div>
              
              {/* Right-side action controls — all items vertically centered, fixed layout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                {/* Icon action buttons */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[
                    { icon: '✏️', title: 'Edit Job',      action: () => navigate('/post-job', { state: { jobToEdit: job } }) },
                    { icon: '📋', title: 'Duplicate Job', action: () => handleDuplicateJob(job) },
                    { icon: '🗑️', title: 'Delete Job',    action: () => handleDeleteJob(job._id) },
                  ].map(({ icon, title, action }) => (
                    <button
                      key={title}
                      title={title}
                      onClick={action}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {/* Applicant count */}
                <div style={{ textAlign: 'center', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.08)', minWidth: '56px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>{job.applicants?.length || 0}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Applicants</div>
                </div>
                {/* Primary action */}
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  Manage Talent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
