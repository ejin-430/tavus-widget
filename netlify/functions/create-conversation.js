exports.handler = async (event) => {
  const API_KEY = process.env.TAVUS_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: 'Missing TAVUS_API_KEY' };
  }

  try {
    const res = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':     API_KEY,
      },
      body: JSON.stringify({
        persona_id: 'p9e1dcbc5d4d',
        replica_id: 'r3716387d56a',
        callback_url: 'https://services.leadconnectorhq.com/hooks/AYspqufCjo27pWzGNkQJ/webhook-trigger/47ad6677-ef4a-4ede-8b24-84b1b557fc4attp//services.leadconnectorhq.com/hooks/…s:',
        properties: { 
            participant_left_timeout: 5, 
            max_call_duration: 100, 
            participant_absent_timeout: 30 
        },
      }),
    });

    const text = await res.text();
    if (!res.ok) return { statusCode: res.status, body: text };

    const { conversation_url } = JSON.parse(text);
    return { statusCode: 200, body: JSON.stringify({ conversation_url }) };
  } catch (err) {
    return { statusCode: 502, body: err.toString() };
  }
};
