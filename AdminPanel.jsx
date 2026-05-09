import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import './AdminPanel.css';

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="admin-stat-card glass-panel">
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    <div className="stat-label">{label}</div>
    {trend && <div className="stat-trend" style={{ color: trend > 0 ? '#34d399' : '#f87171' }}>
      {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% this month
    </div>}
    <div className="stat-bar"><div className="stat-bar-fill" style={{ background: color, width: '70%' }}></div></div>
  </div>
);

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ title, fields, data, onSave, onClose }) => {
  const [form, setForm] = useState({ ...data });
  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>✏️ {title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: '1rem' }}>
          {fields.map(f => (
            <div className="input-group" key={f.key} style={{ marginBottom: '1rem' }}>
              <label className="input-label">{f.label}</label>
              {f.type === 'select' ? (
                <select className="input-field" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} className="input-field" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn-secondary auth-submit" style={{ flex: 1 }} onClick={() => onSave(form)}>💾 Save Changes</button>
            <button className="btn-sm btn-danger" style={{ padding: '0.75rem 1.5rem' }} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Add Modal ────────────────────────────────────────────────────────────────
const AddModal = ({ title, fields, defaultData, onSave, onClose }) => {
  const [form, setForm] = useState({ ...defaultData });
  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>➕ {title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: '1rem' }}>
          {fields.map(f => (
            <div className="input-group" key={f.key} style={{ marginBottom: '1rem' }}>
              <label className="input-label">{f.label} <span style={{ color: 'var(--color-error)' }}>*</span></label>
              {f.type === 'select' ? (
                <select className="input-field" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} className="input-field" placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn-secondary auth-submit" style={{ flex: 1 }} onClick={() => { if (Object.values(form).every(v => v !== '')) onSave(form); }}>✅ Add</button>
            <button className="btn-sm btn-danger" style={{ padding: '0.75rem 1.5rem' }} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminPanel = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // ── Admin Auth ──────────────────────────────────────────────────────────────
  const [adminUser, setAdminUser] = useState(null);
  useEffect(() => {
    const stored = sessionStorage.getItem('adminAuth');
    if (!stored) { navigate('/admin-login'); } else { setAdminUser(JSON.parse(stored)); }
  }, [navigate]);

  const handleAdminLogout = () => { sessionStorage.removeItem('adminAuth'); navigate('/admin-login'); };

  // Helper for headers
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${adminUser?.token}` } });

  // ── Toast ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('analytics');
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // ── Users State ─────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [editUser, setEditUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchFilter = userFilter === 'all' || u.role === userFilter || u.status.toLowerCase() === userFilter;
    return matchSearch && matchFilter;
  });

  const saveUser = async (updated) => {
    try {
      // Assuming a generic profile update or status update endpoint
      // For now, let's just update local state if backend doesn't have a specific admin user update route
      setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
      setEditUser(null); showToast('User updated successfully!');
    } catch (err) { showToast('Update failed', 'error'); }
  };

  const addUser = async (data) => {
    try {
      await axios.post('/api/auth/register', data);
      showToast('New user registered!');
      setShowAddUser(false);
    } catch (err) { showToast('Failed to add user', 'error'); }
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    showToast('User status updated!');
  };

  const deleteUser = async (id) => {
    if (window.confirm('Permanently remove this user?')) {
      // In a real app, you'd call axios.delete(`/api/auth/users/${id}`, getAuthHeader());
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast('User deleted.', 'error');
    }
  };

  // ── Content State ───────────────────────────────────────────────────────────
  const [content, setContent] = useState([]);

  // Auto Update logic
  const prevDataRef = useRef({ jobsCount: 0, appsCount: 0 });

  useEffect(() => {
    if (!adminUser) return;

    const fetchData = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          axios.get('/api/auth/users'),
          axios.get('/api/jobs')
        ]);

        const fetchedJobs = jobsRes.data;
        const fetchedUsers = usersRes.data;

        // Calculate applications per user
        const appsCountMap = {};
        let totalApps = 0;
        fetchedJobs.forEach(job => {
          if (job.applicants && Array.isArray(job.applicants)) {
            job.applicants.forEach(app => {
              totalApps++;
              const uid = app.user?._id || app.user;
              appsCountMap[uid] = (appsCountMap[uid] || 0) + 1;
            });
          }
        });

        const mappedUsers = fetchedUsers.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.isVerified || u.role === 'admin' ? 'Active' : 'Suspended',
          joined: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A',
          applications: appsCountMap[u._id] || 0
        }));

        const mappedJobs = fetchedJobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.company,
          type: job.type || 'Job Posting',
          status: 'Published',
          author: job.recruiter?.name || 'Unknown',
          date: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : 'N/A'
        }));

        setUsers(mappedUsers);
        setContent(mappedJobs);

        // Check for notifications
        const currentJobsCount = mappedJobs.length;
        const currentAppsCount = totalApps;
        const prev = prevDataRef.current;

        if (prev.jobsCount > 0 && currentJobsCount > prev.jobsCount) {
          showToast('🔔 New job posted!', 'success');
        }
        if (prev.appsCount > 0 && currentAppsCount > prev.appsCount) {
          showToast('🔔 New application received!', 'success');
        }

        prevDataRef.current = { jobsCount: currentJobsCount, appsCount: currentAppsCount };

      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, [adminUser]);

  const [contentFilter, setContentFilter] = useState('all');
  const [editContent, setEditContent] = useState(null);
  const [showAddContent, setShowAddContent] = useState(false);

  const filteredContent = content.filter(c => contentFilter === 'all' || c.status.toLowerCase() === contentFilter);

  const saveContent = async (updated) => {
    try {
      await axios.put(`/api/jobs/${updated.id}`, updated, getAuthHeader());
      showToast('Job updated successfully!');
      setEditContent(null);
    } catch (err) { showToast('Update failed', 'error'); }
  };

  const addContent = async (data) => {
    try {
      // We need to provide dummy requirements etc for the Job model
      const payload = {
        ...data,
        location: 'Remote',
        description: 'New job posted via Admin Panel',
        requirements: ['Contact admin for details'],
        salary: 'Competitive'
      };
      await axios.post('/api/jobs', payload, getAuthHeader());
      showToast('New job posted!');
      setShowAddContent(false);
    } catch (err) { showToast('Failed to add job', 'error'); }
  };

  const updateContentStatus = (id, status) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast(`Content marked as ${status}.`, status === 'Flagged' ? 'error' : 'success');
  };

  const deleteContent = async (id) => {
    if (window.confirm('Permanently remove this job?')) {
      try {
        await axios.delete(`/api/jobs/${id}`, getAuthHeader());
        showToast('Job deleted.', 'error');
      } catch (err) { showToast('Delete failed', 'error'); }
    }
  };

  // ── Analytics (live from state) ─────────────────────────────────────────────
  const analytics = {
    totalUsers:       users.length,
    activeUsers:      users.filter(u => u.status === 'Active').length,
    seekers:          users.filter(u => u.role === 'seeker').length,
    recruiters:       users.filter(u => u.role === 'recruiter').length,
    totalJobs:        content.length,
    publishedJobs:    content.filter(c => c.status === 'Published').length,
    pendingJobs:      content.filter(c => c.status === 'Pending').length,
    flaggedJobs:      content.filter(c => c.status === 'Flagged').length,
    totalApplications:users.reduce((s, u) => s + (u.applications || 0), 0),
  };

  const chartData    = [35, 52, 48, 71, 65, 88, 79, 94, 70, 100, 85, 92];
  const chartLabels  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  if (!adminUser) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}><div className="spinner"></div></div>;

  return (
    <div className="admin-panel-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Edit User Modal */}
      {editUser && (
        <EditModal
          title="Edit User"
          data={editUser}
          fields={[
            { key: 'name',   label: 'Full Name'  },
            { key: 'email',  label: 'Email',  type: 'email' },
            { key: 'role',   label: 'Role',   type: 'select', options: ['seeker','recruiter'] },
            { key: 'status', label: 'Status', type: 'select', options: ['Active','Suspended'] },
          ]}
          onSave={saveUser}
          onClose={() => setEditUser(null)}
        />
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <AddModal
          title="Add New User"
          defaultData={{ name:'', email:'', role:'seeker', status:'Active' }}
          fields={[
            { key: 'name',   label: 'Full Name',  placeholder: 'John Doe' },
            { key: 'email',  label: 'Email',       type: 'email', placeholder: 'user@email.com' },
            { key: 'role',   label: 'Role',        type: 'select', options: ['seeker','recruiter'] },
            { key: 'status', label: 'Status',      type: 'select', options: ['Active','Suspended'] },
          ]}
          onSave={addUser}
          onClose={() => setShowAddUser(false)}
        />
      )}

      {/* Edit Content Modal */}
      {editContent && (
        <EditModal
          title="Edit Content"
          data={editContent}
          fields={[
            { key: 'title',   label: 'Job Title' },
            { key: 'company', label: 'Company' },
            { key: 'type',    label: 'Type',   type: 'select', options: ['Job Posting','Internship','Part-time'] },
            { key: 'status',  label: 'Status', type: 'select', options: ['Published','Pending','Flagged'] },
          ]}
          onSave={saveContent}
          onClose={() => setEditContent(null)}
        />
      )}

      {/* Add Content Modal */}
      {showAddContent && (
        <AddModal
          title="Add New Job Posting"
          defaultData={{ title:'', company:'', type:'Job Posting', status:'Published' }}
          fields={[
            { key: 'title',   label: 'Job Title',  placeholder: 'e.g. React Developer' },
            { key: 'company', label: 'Company',    placeholder: 'e.g. TechCorp' },
            { key: 'type',    label: 'Type',       type: 'select', options: ['Job Posting','Internship','Part-time'] },
            { key: 'status',  label: 'Status',     type: 'select', options: ['Published','Pending','Flagged'] },
          ]}
          onSave={addContent}
          onClose={() => setShowAddContent(false)}
        />
      )}

      <div className="admin-container glass-panel">
        {/* ── Header ── */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">🛡️ Admin Panel</h1>
            <p className="admin-subtitle">Logged in as <strong style={{ color: '#f87171' }}>{adminUser.name}</strong> ({adminUser.id})</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-badge">Administrator</div>
            <button className="btn-sm btn-danger" onClick={handleAdminLogout} style={{ padding: '0.5rem 1rem' }}>🚪 Logout</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="admin-tabs">
          {[
            { key: 'analytics', icon: '📊', label: 'Analytics' },
            { key: 'users',     icon: '👥', label: `Manage Users (${users.length})` },
            { key: 'content',   icon: '📋', label: `Manage Content (${content.length})` },
          ].map(tab => (
            <button key={tab.key} className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════ ANALYTICS ════════════ */}
        {activeTab === 'analytics' && (
          <div className="admin-section">
            <h2 className="section-heading">📊 Live Platform Analytics</h2>
            <div className="admin-stats-grid">
              <StatCard icon="👥" label="Total Users"       value={analytics.totalUsers}        color="#3b82f6" trend={12} />
              <StatCard icon="✅" label="Active Users"      value={analytics.activeUsers}       color="#10b981" trend={8}  />
              <StatCard icon="🎯" label="Job Seekers"       value={analytics.seekers}           color="#8b5cf6" trend={15} />
              <StatCard icon="🏢" label="Recruiters"        value={analytics.recruiters}        color="#f59e0b" trend={5}  />
              <StatCard icon="💼" label="Total Job Posts"   value={analytics.totalJobs}         color="#ef4444" trend={20} />
              <StatCard icon="📨" label="Total Applications" value={analytics.totalApplications} color="#06b6d4" trend={18} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '3px solid #10b981' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{analytics.publishedJobs}</div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Published Jobs</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '3px solid #fbbf24' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{analytics.pendingJobs}</div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Pending Review</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '3px solid #f87171' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>{analytics.flaggedJobs}</div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Flagged Content</div>
              </div>
            </div>

            <div className="analytics-chart-placeholder glass-panel">
              <h3>📈 Monthly User Growth</h3>
              <div className="chart-bars">
                {chartData.map((h, i) => (
                  <div key={i} className="chart-bar-wrap" title={`${chartLabels[i]}: ${h}%`}>
                    <div className="chart-bar" style={{ height: `${h}%` }}></div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '0.25rem', textAlign: 'center' }}>{chartLabels[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════ MANAGE USERS ════════════ */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-top">
              <h2 className="section-heading">👥 Manage Users</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select className="input-field admin-search" style={{ width: '150px' }} value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
                  <option value="all">All Users</option>
                  <option value="seeker">Seekers</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
                <input type="text" placeholder="Search name or email..." className="input-field admin-search" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                <button className="btn-sm btn-success" style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }} onClick={() => setShowAddUser(true)}>➕ Add User</button>
              </div>
            </div>

            <div className="admin-summary-bar">
              <span>Showing <strong>{filteredUsers.length}</strong> of {users.length}</span>
              <span>Active: <strong style={{ color: '#34d399' }}>{analytics.activeUsers}</strong></span>
              <span>Suspended: <strong style={{ color: '#f87171' }}>{users.filter(u => u.status === 'Suspended').length}</strong></span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Apps</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr key={u.id}>
                      <td style={{ opacity: 0.4 }}>{idx + 1}</td>
                      <td><strong>{u.name}</strong></td>
                      <td style={{ opacity: 0.7 }}>{u.email}</td>
                      <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                      <td><span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span></td>
                      <td style={{ textAlign: 'center' }}>{u.applications}</td>
                      <td style={{ opacity: 0.6 }}>{u.joined}</td>
                      <td className="action-btns">
                        <button className="btn-sm btn-info" onClick={() => setEditUser(u)}>✏️ Edit</button>
                        <button className={`btn-sm ${u.status === 'Active' ? 'btn-warn' : 'btn-success'}`} onClick={() => toggleUserStatus(u.id)}>
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button className="btn-sm btn-danger" onClick={() => deleteUser(u.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No users match your search.</div>}
            </div>
          </div>
        )}

        {/* ════════════ MANAGE CONTENT ════════════ */}
        {activeTab === 'content' && (
          <div className="admin-section">
            <div className="section-top">
              <h2 className="section-heading">📋 Manage Content</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select className="input-field admin-search" style={{ width: '160px' }} value={contentFilter} onChange={(e) => setContentFilter(e.target.value)}>
                  <option value="all">All Content</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                </select>
                <button className="btn-sm btn-success" style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }} onClick={() => setShowAddContent(true)}>➕ Add Content</button>
              </div>
            </div>

            <div className="admin-summary-bar">
              <span>Total: <strong>{content.length}</strong></span>
              <span>Published: <strong style={{ color: '#34d399' }}>{analytics.publishedJobs}</strong></span>
              <span>Pending: <strong style={{ color: '#fbbf24' }}>{analytics.pendingJobs}</strong></span>
              <span>Flagged: <strong style={{ color: '#f87171' }}>{analytics.flaggedJobs}</strong></span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Title</th><th>Company</th><th>Author</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredContent.map((c, idx) => (
                    <tr key={c.id}>
                      <td style={{ opacity: 0.4 }}>{idx + 1}</td>
                      <td><strong>{c.title}</strong></td>
                      <td style={{ opacity: 0.7 }}>{c.company}</td>
                      <td style={{ opacity: 0.7 }}>{c.author}</td>
                      <td><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                      <td style={{ opacity: 0.6 }}>{c.date}</td>
                      <td className="action-btns">
                        <button className="btn-sm btn-info" onClick={() => setEditContent(c)}>✏️ Edit</button>
                        {c.status !== 'Published' && <button className="btn-sm btn-success" onClick={() => updateContentStatus(c.id, 'Published')}>✅ Approve</button>}
                        {c.status !== 'Flagged'   && <button className="btn-sm btn-warn"    onClick={() => updateContentStatus(c.id, 'Flagged')}>🚩 Flag</button>}
                        <button className="btn-sm btn-danger" onClick={() => deleteContent(c.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredContent.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No content matches your filter.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
