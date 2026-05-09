import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const SeekerDashboard = ({ applications, user, t }) => {
  const navigate = useNavigate();

  // Derived stats
  const totalApps = applications.length;
  const interviewCalls = applications.filter(app => app.status === 'Interview').length;

  // Use useMemo so these random values don't re-calculate on every render
  const profileViews = useMemo(() => Math.floor(Math.random() * 50) + 12, []);
  const resumeScore = 88; // Mocked
  const lastUpdated = useMemo(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), []);

  const weeklyActivity = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activity = [2, 5, 3, 8, 4, 1, 0];
    const max = Math.max(...activity, 1); // avoid dividing by 0
    return days.map((day, i) => ({
      day,
      // Ensure bars for 0-count days are still visible (min 4%)
      height: activity[i] === 0 ? 4 : (activity[i] / max) * 100,
      count: activity[i]
    }));
  }, []);

  const getAIHint = () => {
    if (totalApps === 0) return "Start by searching for roles that match your top skills like React or Node.js.";
    if (interviewCalls > 0) return "You have upcoming interviews! Practice common behaviour questions and review the job requirements.";
    if (resumeScore < 90) return "Your resume score is good, but adding quantifiable results (e.g. 'Reduced load time by 30%') could boost it to 95%+.";
    return "Your profile is performing well. Consider reaching out to recruiters at your top-choice companies directly.";
  };

  const goals = {
    applications: { current: totalApps % 20, target: 20 },
    interviews: { current: interviewCalls, target: 5 },
  };

  const statusStyle = (status) => {
    const map = {
      Applied:   { bg: 'rgba(37,99,235,0.12)',   color: '#60a5fa', border: 'rgba(37,99,235,0.25)' },
      Interview: { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
      Accepted:  { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.25)' },
      Rejected:  { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.25)' },
    };
    return map[status] || map.Applied;
  };

  const stats = [
    { label: 'Total Applications', value: totalApps,          color: 'var(--color-text-primary)', borderColor: 'rgba(255,255,255,0.06)', bg: 'transparent' },
    { label: 'Interview Calls',    value: interviewCalls,     color: '#60a5fa', borderColor: 'rgba(59,130,246,0.3)',   bg: 'rgba(59,130,246,0.05)' },
    { label: 'Profile Views',      value: profileViews,       color: '#10b981', borderColor: 'rgba(16,185,129,0.3)',  bg: 'rgba(16,185,129,0.05)' },
    { label: 'Resume Score',       value: `${resumeScore}%`,  color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.3)', bg: 'rgba(139,92,246,0.05)' },
  ];

  return (
    <div className="seeker-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%', animation: 'fadeIn 0.5s ease' }}>

      {/* ── Header Badge ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '0.6rem 1.2rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.2rem' }}>💎</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#60a5fa', letterSpacing: '0.5px' }}>PREMIUM SEEKER PROFILE ACTIVE</span>
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>
          Last updated: Today, {lastUpdated}
        </div>
      </div>

      {/* ── Stats Grid – always 4 equal-height cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              border: `1px solid ${stat.borderColor}`,
              background: stat.bg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              minHeight: '160px',
            }}
          >
            <h4 style={{ opacity: 0.6, fontSize: '0.72rem', textTransform: 'uppercase', margin: 0, letterSpacing: '1px' }}>{stat.label}</h4>
            <span style={{ fontSize: '2.8rem', fontWeight: '900', color: stat.color, lineHeight: 1 }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ── Middle Two-Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* AI Strategic Insight */}
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(59,130,246,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.04, fontSize: '6rem', pointerEvents: 'none' }}>✨</div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--color-accent)', borderRadius: '0 4px 4px 0' }}></div>
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ background: 'var(--color-accent)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>💡</span>
              AI Strategic Insight
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.75', margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
              {getAIHint()}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem' }} onClick={() => navigate('/jobs')}>
                Launch Optimizer →
              </button>
              <button className="btn-secondary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                Full Report
              </button>
            </div>
          </div>

          {/* Momentum Tracker */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📈 Momentum Tracker</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.35rem 0.8rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '30px', border: '1px solid rgba(16,185,129,0.2)', whiteSpace: 'nowrap' }}>
                +18% VELOCITY
              </span>
            </div>
            {/* Chart container — fixed 180px, bars align to bottom */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              {weeklyActivity.map((data, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-accent)', fontWeight: '800', opacity: data.count === 0 ? 0.3 : 1 }}>{data.count}</div>
                  <div style={{
                    width: '100%',
                    maxWidth: '36px',
                    height: `${data.height}%`,
                    minHeight: '4px',
                    background: data.count === 0
                      ? 'rgba(255,255,255,0.06)'
                      : 'linear-gradient(to top, var(--color-accent), #60a5fa)',
                    borderRadius: '6px 6px 0 0',
                    opacity: data.count === 0 ? 0.4 : 0.9,
                    transition: 'all 1s cubic-bezier(0.17,0.67,0.83,0.67)'
                  }}></div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>{data.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Target Milestones */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1rem', letterSpacing: '0.8px', textTransform: 'uppercase', opacity: 0.9 }}>🎯 TARGET MILESTONES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Weekly Applications', current: goals.applications.current, target: goals.applications.target, gradient: 'linear-gradient(90deg, var(--color-accent), #60a5fa)' },
                { label: 'Interview Conversion', current: goals.interviews.current, target: goals.interviews.target, gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
              ].map((goal, i) => {
                const pct = Math.min((goal.current / goal.target) * 100, 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700' }}>{goal.label}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{goal.current} / {goal.target}</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: goal.gradient, borderRadius: '5px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                );
              })}

              <div style={{ padding: '1.2rem', background: 'rgba(59,130,246,0.06)', borderRadius: '12px', textAlign: 'center', border: '1px dashed rgba(59,130,246,0.2)', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#60a5fa' }}>72.4%</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Aggregate Search Power</div>
              </div>
            </div>
          </div>

          {/* Market Position */}
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'linear-gradient(145deg, rgba(139,92,246,0.1), rgba(30,41,59,0.5))', border: '1px solid rgba(139,92,246,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '700' }}>Market Position</h3>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginBottom: '0.6rem', letterSpacing: '-0.5px' }}>TOP 12.5%</div>
            <p style={{ fontSize: '0.85rem', opacity: 0.75, lineHeight: '1.65', margin: 0 }}>
              Your profile rank increased by <strong>2.1%</strong> this week. Highly competitive for <strong>Full Stack</strong> roles.
            </p>
            <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '700', letterSpacing: '0.5px' }}>
              ANALYSE COMPETITION
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Application Pipeline ── */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>Active Application Pipeline</h3>
            <p style={{ margin: '0.3rem 0 0 0', opacity: 0.5, fontSize: '0.83rem' }}>Tracking your most recent 5 professional engagements</p>
          </div>
          <button className="btn-secondary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.83rem', fontWeight: '600', flexShrink: 0 }} onClick={() => navigate('/jobs')}>
            FULL PIPELINE →
          </button>
        </div>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', opacity: 0.4 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📡</div>
            <p style={{ fontSize: '1.1rem' }}>No active signals detected in the pipeline.</p>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/jobs')}>START DISCOVERY</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {applications.slice(0, 5).map((app, index) => {
              const s = statusStyle(app.status);
              const isLast = index === Math.min(applications.length, 5) - 1;
              return (
                <div
                  key={app._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.4rem 0',
                    borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    gap: '1rem',
                  }}
                >
                  {/* Left: Company avatar + info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-accent)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      flexShrink: 0,
                    }}>
                      {app.company?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.title}</h4>
                      <div style={{ fontSize: '0.82rem', opacity: 0.5, marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                        <span>🏢 {app.company}</span>
                        <span>📍 {app.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: status + date + action button — all fixed-width, right-aligned */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                    {/* Status badge + date */}
                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 1rem',
                        borderRadius: '30px',
                        fontSize: '0.7rem',
                        fontWeight: '900',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                        background: s.bg,
                        color: s.color,
                        border: `1px solid ${s.border}`,
                        whiteSpace: 'nowrap',
                      }}>
                        {app.status}
                      </span>
                      <div style={{ fontSize: '0.68rem', opacity: 0.4, marginTop: '0.4rem', fontWeight: '600' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action button — fixed width so all rows line up */}
                    <div style={{ width: '110px', flexShrink: 0 }}>
                      {app.status === 'Interview' ? (
                        <button className="btn-primary" style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                          PREP HUB
                        </button>
                      ) : (
                        <button className="btn-secondary" style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.72rem', opacity: 0.65, border: '1px solid rgba(255,255,255,0.08)' }}>
                          DETAILS
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default SeekerDashboard;
