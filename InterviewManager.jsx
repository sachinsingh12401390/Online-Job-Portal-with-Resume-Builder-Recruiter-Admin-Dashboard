import React from 'react';

const InterviewManager = ({ applications }) => {
  const scheduledInterviews = applications.filter(app => app.status === 'Interview' && app.interviewDate);

  const getPrepTips = () => [
    { title: "Research the Company", content: "Understand their mission, culture, and recent news. Look at their technical stack if applicable." },
    { title: "STAR Method", content: "Prepare examples for behavioral questions using Situation, Task, Action, and Result." },
    { title: "Technical Review", content: "Review core concepts of React, Node.js, and System Design based on the job description." },
    { title: "Ask Questions", content: "Prepare 3-5 thoughtful questions for the interviewer about the team and role." }
  ];

  return (
    <div className="interview-manager" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Left: Scheduled Interviews & Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>📅 Interview Calendar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <div key={d} style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.7rem' }}>{d}</div>)}
               {[...Array(31)].map((_, i) => {
                 const day = i + 1;
                 const hasInterview = scheduledInterviews.some(int => new Date(int.interviewDate).getDate() === day);
                 return (
                   <div key={i} style={{ 
                     height: '40px', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     fontSize: '0.8rem',
                     background: hasInterview ? 'var(--color-accent)' : 'rgba(255,255,255,0.02)',
                     borderRadius: '4px',
                     color: hasInterview ? 'white' : 'inherit',
                     position: 'relative'
                   }}>
                     {day}
                     {hasInterview && <div style={{ position: 'absolute', bottom: '2px', width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>}
                   </div>
                 );
               })}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>🔔 Upcoming Sessions</h3>
            {scheduledInterviews.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No interviews scheduled yet. Keep applying!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scheduledInterviews.map(app => (
                  <div key={app._id} style={{ padding: '1.2rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#60a5fa', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Next Interview</div>
                      <h4 style={{ margin: 0 }}>{app.title}</h4>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{app.company}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>{new Date(app.interviewDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>at {app.interviewTime}</div>
                      {app.interviewLink && <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontSize: '0.75rem', textDecoration: 'none', display: 'block', marginTop: '0.4rem' }}>🔗 Join Call</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Prep Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-accent)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🧠 AI Prep Guide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {getPrepTips().map((tip, i) => (
                <div key={i}>
                  <h5 style={{ margin: '0 0 0.3rem 0', color: 'var(--color-accent)' }}>{tip.title}</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.4' }}>{tip.content}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => alert('Launching AI Mock Interview Simulator...')}>Start Mock Interview 🤖</button>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', color: '#10b981' }}>📌 Reminder Checklist</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Test your microphone and camera.</li>
              <li>Check your internet connection.</li>
              <li>Keep a copy of your resume handy.</li>
              <li>Find a quiet, well-lit space.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};

export default InterviewManager;
