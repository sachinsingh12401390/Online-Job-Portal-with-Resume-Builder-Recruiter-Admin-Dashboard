import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/notifications/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application_update': return '📝';
      case 'new_job': return '🚀';
      case 'message': return '💬';
      case 'interview_scheduled': return '📅';
      default: return '🔔';
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }}></div>;

  return (
    <div className="notifications-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Notification Center</h3>
        {notifications.length > 0 && (
          <button 
            className="btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            onClick={clearAll}
          >
            Clear All
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif._id} 
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className="glass-panel" 
              style={{ 
                padding: '1.2rem 2rem', 
                display: 'flex', 
                gap: '1.5rem', 
                alignItems: 'center',
                background: notif.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(59, 130, 246, 0.05)',
                borderLeft: `4px solid ${notif.isRead ? 'transparent' : 'var(--color-accent)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{getIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: notif.isRead ? 'inherit' : 'white' }}>{notif.title}</h4>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, lineHeight: '1.4' }}>{notif.message}</p>
              </div>
              {!notif.isRead && (
                <div style={{ width: '10px', height: '10px', background: 'var(--color-accent)', borderRadius: '50%' }}></div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="glass-panel" style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Notification Preferences</h4>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
            Push Notifications
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
            Email Alerts
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
            SMS Reminders
          </label>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
