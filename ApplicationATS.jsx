import React, { useState } from 'react';

const ApplicationATS = ({ applications }) => {
  const [selectedApp, setSelectedApp] = useState(null);

  const stages = [
    { label: 'Applied', color: '#60a5fa' },
    { label: 'Under Review', color: '#f59e0b' },
    { label: 'Shortlisted', color: '#8b5cf6' },
    { label: 'Interview', color: '#10b981' },
    { label: 'Rejected', color: '#ef4444' }
  ];

  const getStatusIndex = (status) => {
    if (status === 'Applied') return 0;
    if (status === 'Reviewed') return 1;
    if (status === 'Shortlisted') return 2;
    if (status === 'Interview') return 3;
    if (status === 'Accepted') return 3; // For demo, treat accepted as end of positive flow
    if (status === 'Rejected') return 4;
    return 0;
  };

  return (
    <div className="ats-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 350px) 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* List of Applications */}
      <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>My Applications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => (
            <div 
              key={app._id} 
              onClick={() => setSelectedApp(app)}
              style={{ 
                padding: '1.2rem', 
                borderRadius: '12px', 
                cursor: 'pointer',
                background: selectedApp?._id === app._id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedApp?._id === app._id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem' }}>{app.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>{app.company}</p>
              <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '10px', 
                  background: app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: app.status === 'Rejected' ? '#ef4444' : '#10b981',
                  fontWeight: 'bold'
                }}>
                  {app.status}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No applications yet.</div>
          )}
        </div>
      </div>

      {/* Timeline View */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {selectedApp ? (
          <div>
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0' }}>{selectedApp.title}</h2>
                  <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.7 }}>{selectedApp.company} • {selectedApp.location}</p>
                </div>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Withdraw Application</button>
              </div>
            </div>

            <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Application Journey</h3>
            
            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '11px', top: '0', bottom: '0', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>

              {stages.map((stage, idx) => {
                const currentIdx = getStatusIndex(selectedApp.status);
                const isCompleted = idx < currentIdx || (selectedApp.status !== 'Rejected' && idx === currentIdx);
                const isCurrent = idx === currentIdx;
                const isRejected = selectedApp.status === 'Rejected' && idx === 4;
                const isFuture = idx > currentIdx && selectedApp.status !== 'Rejected';

                // Skip "Rejected" node if not rejected
                if (stage.label === 'Rejected' && selectedApp.status !== 'Rejected') return null;

                return (
                  <div key={idx} style={{ marginBottom: '2.5rem', position: 'relative', opacity: isFuture ? 0.3 : 1 }}>
                    {/* Circle */}
                    <div style={{ 
                      position: 'absolute', 
                      left: '-30px', 
                      top: '0', 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: isCompleted ? stage.color : '#1e293b',
                      border: `4px solid ${isCurrent ? 'white' : 'transparent'}`,
                      boxShadow: isCurrent ? `0 0 15px ${stage.color}` : 'none',
                      zIndex: 2
                    }}></div>

                    <div>
                      <h4 style={{ margin: '0 0 0.3rem 0', color: isCompleted ? 'white' : 'rgba(255,255,255,0.4)' }}>
                        {stage.label}
                        {isCurrent && <span style={{ marginLeft: '1rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', verticalAlign: 'middle' }}>CURRENT STAGE</span>}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>
                        {idx === 0 ? `Submitted on ${new Date(selectedApp.appliedAt).toLocaleDateString()}` : 
                         idx === 3 && selectedApp.interviewDate ? `Scheduled for ${new Date(selectedApp.interviewDate).toLocaleDateString()} at ${selectedApp.interviewTime}` :
                         `Your application reached the ${stage.label.toLowerCase()} stage.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedApp.status === 'Interview' && selectedApp.interviewLink && (
              <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#10b981' }}>📹 Video Interview Details</h4>
                <p style={{ marginBottom: '1.2rem', fontSize: '0.9rem' }}>You have an upcoming interview. Click the button below to join the virtual meeting room.</p>
                <a href={selectedApp.interviewLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Join Google Meet Now</a>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', opacity: 0.5, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📑</div>
            <p>Select an application from the left to view its detailed tracking timeline.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ApplicationATS;
