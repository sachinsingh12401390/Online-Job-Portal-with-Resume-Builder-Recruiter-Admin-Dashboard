import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './JobDetail.css';

const DUMMY_JOBS = [
  {
    _id: 'dummy1',
    title: 'Senior Software Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a Senior Software Engineer to join our core product team. You will be responsible for designing and implementing scalable backend services and collaborating with frontend teams to deliver a seamless user experience.',
    requirements: ['5+ years experience with React and Node.js', 'Experience with AWS/Cloud infrastructure', 'Strong communication skills', 'Ability to lead technical projects'],
    salary: '$120k - $160k',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'dummy2',
    title: 'Product Designer',
    company: 'CreativePulse',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our design team to help build beautiful and intuitive user interfaces. You will work closely with product managers and engineers to bring innovative ideas to life through high-fidelity mockups and prototypes.',
    requirements: ['Portfolio demonstrating UI/UX expertise', 'Proficiency in Figma or Adobe XD', 'Understanding of design systems', 'Excellent visual design skills'],
    salary: '$90k - $130k',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'dummy3',
    title: 'Data Analyst',
    company: 'Insights Inc.',
    location: 'Austin, TX',
    type: 'Contract',
    description: 'We are seeking a detail-oriented Data Analyst to help us derive meaningful insights from our growing datasets. You will be responsible for building dashboards, performing SQL queries, and presenting findings to stakeholders.',
    requirements: ['Strong SQL skills', 'Experience with Python or R', 'Knowledge of visualization tools like Tableau', 'Degree in Math, Stats, or CS'],
    salary: '$40 - $60 / hr',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'dummy4',
    title: 'Marketing Manager',
    company: 'GrowthSphere',
    location: 'Chicago, IL',
    type: 'Full-time',
    description: 'As a Marketing Manager, you will lead our digital marketing efforts, including SEO/SEM, social media, and email campaigns. Your goal will be to drive user acquisition and improve brand awareness.',
    requirements: ['3+ years in Digital Marketing', 'Experience with Google Ads/Analytics', 'Strong content writing skills', 'Data-driven mindset'],
    salary: '$80k - $110k',
    createdAt: new Date().toISOString()
  },
];

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      // Check if it's a dummy job
      if (id && id.startsWith('dummy')) {
        const dummyJob = DUMMY_JOBS.find(j => j._id === id);
        setJob(dummyJob);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    // In a real app, you would pass the auth token in headers
    setApplying(true);
    try {
      const res = await axios.post(`/api/jobs/${id}/apply`, {}, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      setMessage('Application successful!');
      setApplying(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply. Please login.');
      setApplying(false);
    }
  };

  if (loading) return <div className="loader">Loading job details...</div>;
  if (!job) return <div className="error-msg">Job not found</div>;

  return (
    <div className="job-detail-container">
      <button className="btn-secondary back-btn" onClick={() => navigate('/jobs')}>
        &larr; Back to Jobs
      </button>
      
      <div className="job-detail-card glass-panel">
        <div className="job-detail-header">
          <div>
            <h2>{job.title}</h2>
            <p className="job-company-large">{job.company}</p>
          </div>
          <span className="job-type-large">{job.type}</span>
        </div>
        
        <div className="job-meta">
          <span><strong>Location:</strong> {job.location}</span>
          <span><strong>Salary:</strong> {job.salary || 'Not specified'}</span>
          <span><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-requirements">
          <h3>Requirements</h3>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>

        {message && <div className="apply-message">{message}</div>}

        <div className="job-detail-footer">
          <button 
            className="btn-secondary btn-lg" 
            onClick={handleApply} 
            disabled={applying}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
