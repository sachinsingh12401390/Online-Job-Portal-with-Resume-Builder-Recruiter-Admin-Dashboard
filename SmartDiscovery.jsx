import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SmartDiscovery = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    location: 'All',
    remote: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs');
        // Add mock match scores and AI ranking
        const jobsWithScores = res.data.map(job => {
          // Logic: match score based on common keywords between title/desc and user skills
          // For demo, we'll randomize between 65 and 98
          const baseScore = Math.floor(Math.random() * (98 - 65 + 1)) + 65;
          return { ...job, matchScore: baseScore };
        }).sort((a, b) => b.matchScore - a.matchScore);

        setJobs(jobsWithScores);
        setFilteredJobs(jobsWithScores);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(lowerQuery) ||
        job.company.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters.type !== 'All') {
      result = result.filter(job => job.type === filters.type);
    }

    if (filters.remote) {
      result = result.filter(job => job.location.toLowerCase().includes('remote'));
    }

    setFilteredJobs(result);
  }, [searchQuery, filters, jobs]);

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }}></div>;

  return (
    <div className="smart-discovery" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Search & Filters */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by role, skill, or company..." 
              style={{ margin: 0, paddingLeft: '2.5rem' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          </div>
          <button className="btn-primary" style={{ padding: '0 2rem' }}>Smart Search</button>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Job Type:</span>
            <select className="input-field" style={{ margin: 0, padding: '0.4rem 1rem', width: 'auto' }} value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option>All</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={filters.remote} onChange={(e) => setFilters({...filters, remote: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }} />
            Remote Only 🏠
          </label>

          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', opacity: 0.6 }}>
            Showing {filteredJobs.length} AI-ranked opportunities
          </div>
        </div>
      </div>

      {/* Recommended Section (Top Matches) */}
      {filteredJobs.length > 0 && searchQuery === '' && (
        <div>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Recommended for Your Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredJobs.slice(0, 3).map(job => (
              <div key={job._id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--color-accent)', background: 'rgba(59, 130, 246, 0.05)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-accent)', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                  {job.matchScore}% Match
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{job.title}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>{job.company} • {job.location}</p>
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                   {job.requirements?.slice(0, 3).map((req, i) => (
                     <span key={i} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{req}</span>
                   ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <button className="btn-primary" style={{ flex: 4, padding: '0.5rem' }} onClick={() => navigate(`/jobs/${job._id}`)}>Analyze & Apply</button>
                  <button 
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        await axios.post(`/api/jobs/${job._id}/save`, {}, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        alert('Job saved to your wishlist! ❤️');
                      } catch (err) {
                        console.error('Error saving job:', err);
                      }
                    }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Intelligent List */}
      <div>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>All Intelligence-Ranked Opportunities</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredJobs.map(job => (
            <div key={job._id} className="glass-panel" style={{ padding: '1.2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: job.matchScore > 80 ? '#10b981' : '#60a5fa' }}>{job.matchScore}%</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase' }}>Match</div>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{job.title}</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{job.company} • {job.location}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-accent)' }}>AI RANK: #{Math.floor(Math.random() * 5) + 1}</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{job.type}</span>
                </div>
                <button className="btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }} onClick={() => navigate(`/jobs/${job._id}`)}>Analyze & Apply</button>
              </div>
            </div>
          ))}
          {filteredJobs.length === 0 && (
             <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
               <p>No jobs found matching your criteria. Try adjusting your filters.</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default SmartDiscovery;
