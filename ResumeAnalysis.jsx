import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResumeAnalysis = () => {
  const { jobId, applicantId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.post(`/api/jobs/analyze/${applicantId}`);
        setAnalysis(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error analyzing resume:', err);
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [applicantId]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'white' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1.5rem', fontSize: '1.2rem' }}>AI is analyzing candidate profile...</p>
    </div>
  );

  if (!analysis) return <div className="error-msg">Analysis failed</div>;

  return (
    <div className="analysis-page" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={() => navigate(`/jobs/${jobId}/applicants`)} style={{ marginBottom: '2rem' }}>
        &larr; Back to Applicants
      </button>

      <div className="glass-panel" style={{ padding: '3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #3b82f6, #10b981)' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AI Resume Insight</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Automated matching analysis for this position</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              border: '6px solid var(--color-accent)', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              background: 'rgba(59, 130, 246, 0.1)'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>{analysis.score}%</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>MATCH</span>
            </div>
          </div>
        </div>

        <div className="analysis-summary" style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Executive Summary</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--color-text-primary)' }}>{analysis.summary}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✅</span> Key Strengths
            </h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)' }}>
              {analysis.strengths.map((s, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{s}</li>)}
            </ul>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Potential Gaps
            </h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)' }}>
              {analysis.gaps.map((g, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{g}</li>)}
            </ul>
          </div>
        </div>

        <div className="recommendation-box" style={{ 
          padding: '2rem', 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
          textAlign: 'center',
          border: '1px solid var(--glass-border)'
        }}>
          <p style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>AI Recommendation</p>
          <h2 style={{ fontSize: '2rem', color: analysis.score > 85 ? 'var(--color-success)' : 'var(--color-accent)' }}>{analysis.recommendation}</h2>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;
