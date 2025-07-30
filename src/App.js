import React, { useState } from 'react';
import { Conversation } from './components/cvi/components/conversation';
import './App.css';

function App() {
  const [conversationUrl, setConversationUrl] = useState(null);

  // Call Netlify function to create the conversation
  const createConversation = async () => {
    try {
      const res = await fetch('/.netlify/functions/create-conversation', {
        method: 'POST',
      });
      if (!res.ok) {
        console.error('Function error:', await res.text());
        alert('Greg is currently chatting with someone else. Please try again later.');
        return null;
      }
      const { conversation_url } = await res.json();
      return conversation_url;
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please try again later.');
      return null;
    }
  };

  // When user clicks the launcher
  const handleChatLaunch = async () => {
    const url = await createConversation();
    if (!url) return;

    setConversationUrl(url);
    // Tell the host page to expand our iframe
    window.parent.postMessage({ type: 'tavus-expand' }, '*');
  };

  // When user closes the chat
  const handleCloseChat = () => {
    setConversationUrl(null);
    // Tell the host page to shrink iframe back to launcher size
    window.parent.postMessage({ type: 'tavus-collapse' }, '*');
  };

  // Daily callFrame arrives
  const handleCallFrame = (callFrame) => {
    console.log('[handleCallFrame] callFrame received:', callFrame);
  };

  return (
    <div className="app-container">
      {!conversationUrl ? (
        <div
          id="chat-launch-container"
          onClick={handleChatLaunch}
          style={{ cursor: 'pointer' }}
        >
          <img
            id="chat-launch-img-desktop"
            src="https://cdn.prod.website-files.com/5fcaa1865b722c42c67cde53/6883b10b48fcce90ac2e95d0_Start%20Video%20Call.gif"
            alt="Start Chat Desktop"
          />
          <div id="mobile-gif-wrapper">
            <img
              id="chat-launch-img-mobile"
              src="https://cdn.prod.website-files.com/5fcaa1865b722c42c67cde53/6883a6f85d050bf75ec010a9_Mobile%20-%20Start%20Video%20Call.gif"
              alt="Start Chat Mobile"
            />
          </div>
        </div>
      ) : (
        <div id="tavus-chat-wrapper" className="chat-wrapper">
          <button id="close-chat-btn" onClick={handleCloseChat}>
            &times;
          </button>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              paddingTop: '40px',
              boxSizing: 'border-box',
            }}
          >
            <Conversation
              url={conversationUrl}
              onLeave={handleCloseChat}
              onCallFrame={handleCallFrame}
              style={{
                width: '100%',
                height: 'calc(100% - 40px)',
                borderRadius: 10,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
