import React, { useState } from 'react';
import { Conversation } from './components/cvi/components/conversation';
import './App.css';

function App() {
  const [conversationUrl, setConversationUrl] = useState(null);

  // Call backend
  const createConversation = async () => {
    try {
      const res = await fetch('/.netlify/functions/create-conversation', {
        method: 'POST',
      });
      if (!res.ok) {
        console.error('Function error:', await res.text());
        alert('Greg is currently chatting with another client. Please try again later.');
        return null;
      }
      const { conversation_url } = await res.json();
      return conversation_url;
    } catch (err) {
      console.error('Network error:', err);
      alert('Greg is currently chatting with another client. Please try again later.');
      return null;
    }
  };

  // Launch conversation and store URL
  const handleChatLaunch = async () => {
    const url = await createConversation();
    console.log('Conversation URL received:', url);
    if (url) setConversationUrl(url);
  };

  // Called when conversation leaves
  const handleCloseChat = () => {
    setConversationUrl(null);
  };

  // Called once a real callFrame is available
  const handleCallFrame = (callFrame) => {
    console.log('[handleCallFrame] callFrame received:', callFrame);
  };

  return (
    <div className="app-container">
      {!conversationUrl && (
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
      )}

      {conversationUrl && (
        <div
          id="tavus-chat-wrapper"
          className="chat-wrapper"
        >
          <button
            id="close-chat-btn"
            onClick={handleCloseChat}
          >
            &times;
          </button>

          <div>
            <Conversation
              url={conversationUrl}
              onLeave={handleCloseChat}
              onCallFrame={handleCallFrame}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
