import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './JobBoard.css';

const DUMMY_JOBS = [
  {
    _id: 'dummy1',
    title: 'Senior Software Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a Senior Software Engineer to join our core product team. You will be responsible for designing and implementing scalable backend services and collaborating with frontend teams to deliver a seamless user experience.',
    salary: '$120k - $160k',
  },
  {
    _id: 'dummy2',
    title: 'Product Designer',
    company: 'CreativePulse',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our design team to help build beautiful and intuitive user interfaces. You will work closely with product managers and engineers to bring innovative ideas to life through high-fidelity mockups and prototypes.',
    salary: '$90k - $130k',
  },
  {
    _id: 'dummy3',
    title: 'Data Analyst',
    company: 'Insights Inc.',
    location: 'Austin, TX',
    type: 'Contract',
    description: 'We are seeking a detail-oriented Data Analyst to help us derive meaningful insights from our growing datasets. You will be responsible for building dashboards, performing SQL queries, and presenting findings to stakeholders.',
    salary: '$40 - $60 / hr',
  },
  {
    _id: 'dummy4',
    title: 'Marketing Manager',
    company: 'GrowthSphere',
    location: 'Chicago, IL',
    type: 'Full-time',
    description: 'As a Marketing Manager, you will lead our digital marketing efforts, including SEO/SEM, social media, and email campaigns. Your goal will be to drive user acquisition and improve brand awareness.',
    salary: '$80k - $110k',
  },
];

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs');
        const data = res.data.length > 0 ? res.data : DUMMY_JOBS;
        setJobs(data);
        
        // Handle search query from URL
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
          setSearchQuery(search);
          filterJobs(search, data);
        } else {
          setFilteredJobs(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setJobs(DUMMY_JOBS);
        setFilteredJobs(DUMMY_JOBS);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [location.search]);

  const filterJobs = (query, allJobs = jobs) => {
    const lowerQuery = query.toLowerCase();
    const filtered = allJobs.filter(job => {
      const titleMatch = job.title?.toLowerCase().includes(lowerQuery);
      const companyMatch = job.company?.toLowerCase().includes(lowerQuery);
      const descMatch = job.description?.toLowerCase().includes(lowerQuery);
      
      let reqMatch = false;
      if (Array.isArray(job.requirements)) {
        reqMatch = job.requirements.some(req => req.toLowerCase().includes(lowerQuery));
      } else if (typeof job.requirements === 'string') {
        reqMatch = job.requirements.toLowerCase().includes(lowerQuery);
      }
      
      return titleMatch || companyMatch || descMatch || reqMatch;
    });
    setFilteredJobs(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Use the functional version of filtering to ensure we have the right jobs
    const lowerQuery = query.toLowerCase();
    const filtered = jobs.filter(job => {
      const titleMatch = job.title?.toLowerCase().includes(lowerQuery);
      const companyMatch = job.company?.toLowerCase().includes(lowerQuery);
      const descMatch = job.description?.toLowerCase().includes(lowerQuery);
      
      let reqMatch = false;
      if (Array.isArray(job.requirements)) {
        reqMatch = job.requirements.some(req => req.toLowerCase().includes(lowerQuery));
      } else if (typeof job.requirements === 'string') {
        reqMatch = job.requirements.toLowerCase().includes(lowerQuery);
      }
      
      return titleMatch || companyMatch || descMatch || reqMatch;
    });
    setFilteredJobs(filtered);
  };

  return (
    <div className="job-board-container">
      <div className="job-board-header">
        <h1>Career Opportunities</h1>
        <p>Discover roles that match your skills and ambitions</p>
        
        <form className="job-search-bar glass-panel" style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0 auto', padding: '0.5rem', display: 'flex', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Search by title, company, or keyword..." 
            className="input-field" 
            style={{ margin: 0, flex: 1, border: 'none', background: 'transparent' }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loader" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
          Loading opportunities...
        </div>
      ) : (
        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <h3>No jobs found matching "{searchQuery}"</h3>
              <p style={{ opacity: 0.6 }}>Try adjusting your keywords or browse all jobs.</p>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSearchQuery(''); setFilteredJobs(jobs); }}>
                Clear Search
              </button>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="job-card glass-panel">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                <p className="job-company">{job.company} • {job.location}</p>
                <p className="job-desc-preview">{job.description.substring(0, 160)}...</p>
                <div className="job-card-footer">
                  <span className="job-salary">{job.salary || 'Salary not specified'}</span>
                  <Link to={`/jobs/${job._id}`} className="btn-secondary">View Details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
