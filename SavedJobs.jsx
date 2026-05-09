import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/jobs/saved', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching saved jobs:', err);
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleToggleSave = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/jobs/${jobId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(savedJobs.filter(j => j._id !== jobId));
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const toggleCompare = (jobId) => {
    if (selectedForCompare.includes(jobId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== jobId));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, jobId]);
    } else {
      alert('You can compare up to 3 jobs at a time.');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }}></div>;

  return (
    <div className="saved-jobs-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Saved Jobs & Wishlist</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-secondary" 
            style={{ background: compareMode ? 'var(--color-accent)' : 'transparent', color: compareMode ? 'white' : 'inherit' }}
            onClick={() => {
              setCompareMode(!compareMode);
              if (compareMode) setSelectedForCompare([]);
            }}
          >
            {compareMode ? 'Cancel Comparison' : '⚖️ Compare Jobs'}
          </button>
          {compareMode && selectedForCompare.length >= 2 && (
            <button className="btn-primary" onClick={() => alert('Opening Detailed Comparison Matrix...')}>Analyze Matches</button>
          )}
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', opacity: 0.6 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📑</div>
          <p>Your wishlist is empty. Start bookmarking jobs that catch your eye!</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/jobs')}>Explore Jobs</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {savedJobs.map(job => {
            // Mock "Expiring Soon" logic
            const isExpiring = Math.random() > 0.7;
            
            return (
              <div key={job._id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', border: compareMode && selectedForCompare.includes(job._id) ? '2px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)' }}>
                {isExpiring && (
                  <div style={{ position: 'absolute', top: '-10px', right: '1rem', background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(239,68,68,0.3)' }}>
                    🔥 EXPIRING SOON
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{job.title}</h4>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }} 
                    onClick={() => handleToggleSave(job._id)}
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>
                
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.7 }}>{job.company} • {job.location}</p>
                <div style={{ fontSize: '0.8rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--color-accent)' }}>💰 {job.salary || 'Competitive'}</span>
                  <span style={{ opacity: 0.6 }}>🕒 {job.type}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button className="btn-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }} onClick={() => navigate(`/jobs/${job._id}`)}>Apply Now</button>
                  {compareMode ? (
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.5rem 1rem', background: selectedForCompare.includes(job._id) ? 'rgba(59, 130, 246, 0.2)' : 'transparent' }}
                      onClick={() => toggleCompare(job._id)}
                    >
                      {selectedForCompare.includes(job._id) ? '✅ Added' : '⚖️ Compare'}
                    </button>
                  ) : (
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate(`/jobs/${job._id}`)}>Details</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {compareMode && selectedForCompare.length > 0 && (
        <div className="glass-panel" style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center', zIndex: 1000, border: '1px solid var(--color-accent)' }}>
          <div style={{ fontSize: '0.9rem' }}>Comparing <strong>{selectedForCompare.length}</strong> roles</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedForCompare.map(id => (
              <div key={id} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>💼</div>
            ))}
          </div>
          <button className="btn-primary" disabled={selectedForCompare.length < 2} onClick={() => alert('Launching Comparison Dashboard...')}>Compare Now</button>
        </div>
      )}

    </div>
  );
};

export default SavedJobs;
