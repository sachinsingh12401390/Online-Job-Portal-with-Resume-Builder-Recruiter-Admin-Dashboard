import React from 'react';

const CareerPath = ({ user }) => {
  const userSkills = user.skills || ['React', 'Node.js', 'JavaScript'];
  const targetRole = "Senior Full Stack Engineer";
  
  const skillGaps = [
    { skill: 'React/Next.js', level: 90, required: 95 },
    { skill: 'Node.js/Microservices', level: 75, required: 90 },
    { skill: 'System Design', level: 40, required: 85 },
    { skill: 'Cloud (AWS/Docker)', level: 30, required: 80 },
    { skill: 'Team Leadership', level: 50, required: 70 }
  ];

  const roadmaps = [
    { step: 1, title: "Master System Design", content: "Focus on scalability, load balancing, and database sharding." },
    { step: 2, title: "Cloud Proficiency", content: "Get AWS Certified Developer associate or learn Docker/K8s." },
    { step: 3, title: "Lead Small Projects", content: "Volunteer for project ownership to build leadership experience." }
  ];

  return (
    <div className="career-path" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Skill Gap Analysis */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>🎯 Skill Gap Analysis (Target: {targetRole})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {skillGaps.map((gap, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{gap.skill}</span>
                  <span style={{ opacity: 0.6 }}>{gap.level}% vs {gap.required}% required</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${gap.level}%`, background: 'var(--color-accent)', borderRadius: '5px', zIndex: 2 }}></div>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${gap.required}%`, background: 'rgba(255,255,255,0.1)', borderRadius: '5px', zIndex: 1 }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>💡 AI Advice:</strong> Prioritize <strong>System Design</strong>. It's the biggest gap preventing you from reaching {targetRole} status.
          </div>
        </div>

        {/* Salary Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#10b981' }}>💰 Salary Insights</h3>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
               <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Market Average for {userSkills[0]} Developer</div>
               <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>$115k - $160k</div>
               <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>📈 12% Growth this year</div>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Junior Level</span>
                <span>$85k</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'white', fontWeight: 'bold' }}>
                <span>Your Current Tier</span>
                <span>$110k (Est.)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Architect Level</span>
                <span>$190k+</span>
              </div>
            </div>
          </div>

          {/* Career Roadmap */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--color-accent)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>🚀 AI Career Roadmap</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {roadmaps.map((step, i) => (
                 <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{step.step}</div>
                    <div>
                       <h5 style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem' }}>{step.title}</h5>
                       <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>{step.content}</p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Generate Detailed Roadmap 🗺️</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CareerPath;
