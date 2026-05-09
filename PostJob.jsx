import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Auth.css'; // Reusing auth styles for consistency

const JOB_TEMPLATES = [
  {
    name: "Google - Sr. Software Engineer",
    data: {
      title: "Senior Software Engineer (L5)",
      company: "Google",
      location: "Mountain View, CA (Remote)",
      type: "Full-time",
      salary: "$180k - $240k",
      description: "Join the Google Cloud team to build next-generation infrastructure. You will be responsible for designing and implementing scalable services that power millions of users.",
      requirements: "8+ years of experience in distributed systems.\nExpertise in Go, C++, or Java.\nStrong background in cloud architecture."
    }
  },
  {
    name: "Microsoft - Azure Solutions Architect",
    data: {
      title: "Azure Solutions Architect",
      company: "Microsoft",
      location: "Redmond, WA (Hybrid)",
      type: "Full-time",
      salary: "$160k - $210k",
      description: "Help our customers transform their businesses with Microsoft Azure. You will design complex cloud solutions and lead technical migrations.",
      requirements: "Azure Solutions Architect Expert certification.\nExperience with Kubernetes and Terraform.\nExcellent client-facing skills."
    }
  },
  {
    name: "Wipro - Sr. Java Full Stack",
    data: {
      title: "Senior Java Full Stack Developer",
      company: "Wipro",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹25L - ₹40L",
      description: "Work on cutting-edge digital transformation projects for global clients. You will lead a team of developers and ensure high-quality code delivery.",
      requirements: "Deep expertise in Spring Boot and React/Angular.\nExperience with Microservices architecture.\nStrong SQL and NoSQL database knowledge."
    }
  },
  {
    name: "Jio - AI/ML Engineer",
    data: {
      title: "AI/ML Engineer (5G Platforms)",
      company: "Jio",
      location: "Mumbai, India",
      type: "Full-time",
      salary: "₹20L - ₹35L",
      description: "Innovate at the intersection of AI and 5G. You will develop machine learning models to optimize network performance and user experience on Jio's massive infrastructure.",
      requirements: "PhD or Masters in Computer Science or related field.\nProficiency in Python, PyTorch, or TensorFlow.\nExperience with large-scale data processing."
    }
  }
];

const PostJob = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const editJob = location.state?.jobToEdit;

  // Load existing data if editing
  useEffect(() => {
    if (editJob) {
      setFormData({
        title: editJob.title,
        company: editJob.company,
        location: editJob.location,
        type: editJob.type,
        salary: editJob.salary || '',
        description: editJob.description,
        requirements: Array.isArray(editJob.requirements) ? editJob.requirements.join('\n') : editJob.requirements
      });
    }
  }, [editJob]);

  // Redirect if not authenticated or not a recruiter
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (!loading && user && user.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateSelect = (e) => {
    const selectedTemplate = JOB_TEMPLATES.find(t => t.name === e.target.value);
    if (selectedTemplate) {
      setFormData(selectedTemplate.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting job form...", formData);
    setError('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      // Convert requirements string to array for the backend
      const requirementsArray = formData.requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      if (requirementsArray.length === 0) {
        throw new Error("Please provide at least one requirement.");
      }

      const jobToPost = {
        ...formData,
        requirements: requirementsArray
      };

      console.log("Saving to API...", jobToPost);
      if (editJob) {
        await axios.put(`/api/jobs/${editJob._id}`, jobToPost, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("🎉 Job Updated Successfully!");
      } else {
        await axios.post('/api/jobs', jobToPost, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("🎉 Job Posted Successfully!");
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Post Job Error:", err);
      const msg = err.response?.data?.message || err.message || 'Failed to post job. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '4rem auto' }}></div>;

  return (
    <div className="auth-container" style={{ padding: '4rem 0' }}>
      <div className="auth-panel glass-panel" style={{ maxWidth: '800px', width: '90%' }}>
        <h2>{editJob ? 'Update Job Listing' : 'Post a New Opportunity'}</h2>
        <p className="auth-subtitle">{editJob ? 'Refine your job requirements' : 'Find the best talent for your team'}</p>

        <div className="input-group" style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
          <label className="input-label" style={{ color: 'var(--color-accent)' }}>✨ Use a Professional Template</label>
          <select className="input-field" onChange={handleTemplateSelect} defaultValue="">
            <option value="" disabled>Select a template to auto-fill...</option>
            {JOB_TEMPLATES.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Job Title</label>
            <input type="text" name="title" placeholder="Senior Software Engineer" className="input-field" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Company Name</label>
            <input type="text" name="company" placeholder="CareerNest Inc." className="input-field" value={formData.company} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Location</label>
            <input type="text" name="location" placeholder="Remote / New York, NY" className="input-field" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Job Type</label>
            <select name="type" className="input-field" value={formData.type} onChange={handleChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Salary Range</label>
            <input type="text" name="salary" placeholder="$120k - $150k" className="input-field" value={formData.salary} onChange={handleChange} required />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ margin: 0 }}>Job Description</label>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px' }} 
                onClick={() => setFormData({...formData, description: 'Generated by AI ✨:\n\nWe are looking for an innovative and highly motivated professional to join our dynamic team. In this role, you will be responsible for leading cross-functional projects, driving technical excellence, and collaborating with stakeholders to deliver world-class solutions. Ideal candidates will thrive in a fast-paced environment and have a passion for continuous learning.'})}
              >
                ✨ AI Generate
              </button>
            </div>
            <textarea name="description" placeholder="Describe the role and responsibilities..." className="input-field" style={{ minHeight: '150px' }} value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ margin: 0 }}>Requirements (One per line)</label>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px' }} 
                onClick={() => setFormData({...formData, requirements: formData.requirements + (formData.requirements ? '\n' : '') + 'Strong Problem Solving Skills\nExcellent Communication\nAgile Methodology\nTeam Leadership'})}
              >
                💡 Suggest Skills
              </button>
            </div>
            <textarea name="requirements" placeholder="Bachelor's in CS&#10;3+ years of React experience..." className="input-field" style={{ minHeight: '100px' }} value={formData.requirements} onChange={handleChange} required></textarea>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isLoading}>
              {isLoading ? 'Saving...' : (editJob ? 'Update Listing' : 'Publish Job Listing')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
