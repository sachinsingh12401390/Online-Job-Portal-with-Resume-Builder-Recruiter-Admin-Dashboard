import React from 'react';

const AnalyticsInsights = ({ applications }) => {
  // Mock analytics data
  const totalApps = applications.length;
  const responses = applications.filter(app => app.status !== 'Applied').length;
  const interviews = applications.filter(app => app.status === 'Interview' || app.status === 'Accepted').length;
  const successRate = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;
  const profileViews = 42;

  const getAIDeepDive = () => {
    if (successRate < 10) return "Your application volume is good, but your interview conversion rate is lower than industry average (15%). Recommendation: Your resume might be failing the ATS screening. Use our CV Architect to optimize for keywords.";
    if (successRate < 20) return "You're on the right track! Your profile is attracting interest. To reach the top 5% of candidates, consider adding a portfolio link or personal projects to your profile.";
    return "Outstanding performance! Your profile is highly competitive. Continue engaging with recruiters in the Messages tab to finalize offers.";
  };

  return (
    <div className="analytics-insights" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Row: Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Success Rate</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: successRate > 15 ? '#10b981' : '#f59e0b' }}>{successRate}%</div>
          <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: '0.5rem 0 0 0' }}>Interviews / Applications</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Response Rate</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#60a5fa' }}>{totalApps > 0 ? Math.round((responses / totalApps) * 100) : 0}%</div>
          <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: '0.5rem 0 0 0' }}>Active Reviews / Total</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Profile Traffic</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6' }}>{profileViews}</div>
          <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: '0.5rem 0 0 0' }}>Recruiter views this month</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Funnel Chart (Mockup) */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>📊 Application Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,0.05)', height: '40px', borderRadius: '4px' }}>
                <div style={{ width: '100%', height: '100%', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Applications ({totalApps})</div>
             </div>
             <div style={{ position: 'relative', width: '85%', background: 'rgba(255,255,255,0.05)', height: '40px', borderRadius: '4px', margin: '0 auto' }}>
                <div style={{ width: '100%', height: '100%', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Under Review ({responses})</div>
             </div>
             <div style={{ position: 'relative', width: '60%', background: 'rgba(255,255,255,0.05)', height: '40px', borderRadius: '4px', margin: '0 auto' }}>
                <div style={{ width: '100%', height: '100%', background: 'rgba(16, 185, 129, 0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Interviews ({interviews})</div>
             </div>
             <div style={{ position: 'relative', width: '30%', background: 'rgba(255,255,255,0.05)', height: '40px', borderRadius: '4px', margin: '0 auto' }}>
                <div style={{ width: '100%', height: '100%', background: 'rgba(245, 158, 11, 0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Offers (1)</div>
             </div>
          </div>
        </div>

        {/* AI Career Insights */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-accent)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ AI Career Consultant
          </h3>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--color-accent)', marginBottom: '1.5rem' }}>
             <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
               {getAIDeepDive()}
             </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <h4 style={{ fontSize: '0.9rem', opacity: 0.6, margin: 0 }}>Strategic Next Steps:</h4>
             <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><strong>Optimize:</strong> Run your resume through our AI Screen again with a focus on "Cloud Architecture".</li>
                <li><strong>Network:</strong> You have 5 recruiters who viewed your profile but didn't message. Try a proactive reach-out.</li>
                <li><strong>Upskill:</strong> Jobs you're targeting are 40% more likely to require "Next.js" experience.</li>
             </ul>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsInsights;
