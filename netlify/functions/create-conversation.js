import 'dotenv/config'; 
import fetch from 'node-fetch';

const API_KEY      = process.env.TAVUS_API_KEY;
const PERSONA_ID   = 'p9e1dcbc5d4d';
const REPLICA_ID   = 'r3716387d56a';
const CALLBACK_URL = 'https://services.leadconnectorhq.com/hooks/AYspqufCjo27pWzGNkQJ/...';

export async function handler() {
  try {
    const res = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        persona_id:  PERSONA_ID,
        replica_id:  REPLICA_ID,
        callback_url: CALLBACK_URL,
        properties: {
          participant_left_timeout: 10,
          max_call_duration: 600,
          participant_absent_timeout: 30,
        },
      }),
    });
    if (!res.ok) {
      return { statusCode: res.status, body: await res.text() };
    }
    const { conversation_url } = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ conversation_url }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
