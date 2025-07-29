// src/App.js
import React, { useState } from 'react';
import { Conversation } from './components/cvi/components/conversation';  // your updated Conversation
import './App.css';

const API_KEY      = '4727eea2c4a84ce18d7775d72c04186f';
const PERSONA_ID   = 'p9e1dcbc5d4d';
const REPLICA_ID   = 'r3716387d56a';
const CALLBACK_URL = 'https://services.leadconnectorhq.com/hooks/AYspqufCjo27pWzGNkQJ/webhook-trigger/47ad6677-ef4a-4ede-8b24-84b1b557fc4a';

function App() {
  const [conversationUrl, setConversationUrl] = useState(null);

  // Create a new Tavus conversation
  const createConversation = async () => {
    try {
      const res = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':     API_KEY,
        },
        body: JSON.stringify({
          persona_id:  PERSONA_ID,
          replica_id:  REPLICA_ID,
          callback_url: CALLBACK_URL,
          properties: {
            participant_left_timeout: 5,
            max_call_duration: 100,
            participant_absent_timeout: 30
          },
        }),
      });
      if (!res.ok) {
        alert('Greg is currently chatting with another client. Please try again later.');
        return null;
      }
      const { conversation_url } = await res.json();
      return conversation_url;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      return null;
    }
  };

  // Launch conversation and store URL
  const handleChatLaunch = async () => {
    const url = await createConversation();
    console.log('Conversation URL received:', url);
    if (url) setConversationUrl(url);
    else console.warn('Failed to create conversation');
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
            className="chat-launch-img"
          />
          <img
            id="chat-launch-img-mobile"
            src="https://cdn.prod.website-files.com/5fcaa1865b722c42c67cde53/6883a6f85d050bf75ec010a9_Mobile%20-%20Start%20Video%20Call.gif"
            alt="Start Chat Mobile"
            className="chat-launch-img"
          />
        </div>
      )}

      {conversationUrl && (
        <div
          id="tavus-chat-wrapper"
          className="chat-wrapper"
          style={{
            position:   'fixed',
            bottom:     25,
            right:      25,
            width:      '50vw',
            maxWidth:   '95%',
            height:     '70vw',
            maxHeight:  '95%',
            borderRadius:   10,
            backgroundColor: 'black',
            overflow:    'hidden',
            zIndex:      9998,
          }}
        >
          <button
            id="close-chat-btn"
            className="close-btn"
            onClick={handleCloseChat}
            style={{
              position:   'absolute',
              top:        10,
              right:      10,
              zIndex:     10000,
              border:     'none',
              borderRadius: '50%',
              width:      36,
              height:     36,
              fontSize:   20,
              fontWeight: 'bold',
              background: 'white',
              color:      'black',
              cursor:     'pointer',
              boxShadow:  '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            &times;
          </button>

          <div
            style={{
              width:           '100%',
              height:          '100%',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            <Conversation
              url={conversationUrl}
              onLeave={handleCloseChat}
              onCallFrame={handleCallFrame}
              style={{
                width:        '100%',
                height:       '100%',
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
