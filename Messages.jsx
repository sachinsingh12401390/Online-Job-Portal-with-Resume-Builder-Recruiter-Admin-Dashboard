import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Messages = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Group messages by conversation partner
        const grouped = {};
        res.data.forEach(msg => {
          const partner = msg.sender._id === user._id ? msg.receiver : msg.sender;
          if (!grouped[partner._id]) {
            grouped[partner._id] = { partner, lastMessage: msg, messages: [] };
          }
          grouped[partner._id].messages.push(msg);
          grouped[partner._id].lastMessage = msg;
        });
        
        const convList = Object.values(grouped);
        setConversations(convList);
        if (convList.length > 0 && !selectedConv) {
          setSelectedConv(convList[0]);
          setMessages(convList[0].messages);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/messages', {
        receiverId: selectedConv.partner._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedMessages = [...messages, res.data];
      setMessages(updatedMessages);
      setNewMessage('');
      
      // Update conversations list
      setConversations(conversations.map(conv => 
        conv.partner._id === selectedConv.partner._id 
        ? { ...conv, lastMessage: res.data, messages: updatedMessages } 
        : conv
      ));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }}></div>;

  return (
    <div className="messages-container" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: '70vh' }}>
      
      {/* Sidebar: Conversations */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Recruiter Chats</h3>
          <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#10b981' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
            Email Sync: Active
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
              No messages yet. When recruiters contact you, they'll appear here.
            </div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.partner._id}
                onClick={() => { setSelectedConv(conv); setMessages(conv.messages); }}
                style={{ 
                  padding: '1.2rem', 
                  cursor: 'pointer', 
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  background: selectedConv?.partner._id === conv.partner._id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0, overflow: 'hidden' }}>
                   {conv.partner.profileImage ? <img src={conv.partner.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : conv.partner.name.charAt(0)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.partner.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage.content}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedConv ? (
          <>
            <div style={{ padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedConv.partner.profileImage ? <img src={selectedConv.partner.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : selectedConv.partner.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '700' }}>{selectedConv.partner.name}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Recruiter at {selectedConv.partner.companyName || 'Top Tech Corp'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => alert('Launching Secure Video Call...')}>📹 Call</button>
              </div>
            </div>

            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.map(msg => (
                <div 
                  key={msg._id} 
                  style={{ 
                    alignSelf: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    padding: '1rem 1.5rem',
                    borderRadius: msg.sender._id === user._id ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    background: msg.sender._id === user._id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.95rem',
                    position: 'relative'
                  }}
                >
                  {msg.content}
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.4rem', textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              
              {/* Mock Interview Invite Node */}
              <div style={{ alignSelf: 'center', margin: '1rem 0', width: '100%', maxWidth: '400px' }}>
                 <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--color-accent)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Interview Invitation</h4>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1rem' }}>{selectedConv.partner.name} has invited you to a technical round.</p>
                    <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => alert('Redirecting to Journey tab...')}>View Details & Confirm</button>
                 </div>
              </div>
              
              <div ref={chatEndRef}></div>
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                className="input-field" 
                style={{ margin: 0 }} 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p>Select a recruiter to start communicating.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Messages;
