import React, { useState } from 'react';
import './FloatingChat.css';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('job') || text.includes('work')) {
      return "You can find the latest job opportunities in the 'Jobs' section. We have roles for Software Engineers, Data Scientists, and more!";
    } else if (text.includes('resume') || text.includes('cv')) {
      return "Our ATS-friendly Resume Builder is available in your dashboard. It helps you create a professional CV that stands out!";
    } else if (text.includes('apply')) {
      return "To apply for a job, go to the Jobs section, click on a job that interests you, and hit the 'Apply Now' button.";
    } else if (text.includes('login') || text.includes('account')) {
      return "You can log in or create an account using the buttons in the top right menu to access personalized features.";
    } else if (text.includes('hindi') || text.includes('language')) {
      return "You can switch between English and Hindi using the language selector in the top navigation bar.";
    } else if (text.includes('contact') || text.includes('help')) {
      return "You can contact our support team at support@careernest.ai or visit our office at GT Road, Phagwara.";
    } else if (text.includes('hello') || text.includes('hi')) {
      return "Hello! I'm your CareerNest assistant. How can I help you with your career today?";
    } else {
      return "That's a great question! CareerNest is here to help you build your dream career with AI matching and professional tools. How else can I assist you?";
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const newMessages = [...messages, { text: userMessage, isBot: false }];
    setMessages(newMessages);
    setInput('');

    // Generate and show AI Response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages(prev => [...prev, { text: aiResponse, isBot: true }]);
    }, 800);
  };

  return (
    <div className={`floating-chat ${isOpen ? 'open' : ''}`}>
      <button className="chat-toggle glass-panel" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
      </button>
      
      {isOpen && (
        <div className="chat-window glass-panel">
          <div className="chat-header">
            <div className="header-info">
              <h4>AI Assistant & Support</h4>
              <span className="status-online">Online</span>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.isBot ? 'bot' : 'user'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn-primary">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
