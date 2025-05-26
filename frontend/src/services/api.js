import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function sendMessage(message, sessionId) {
  const { data } = await axios.post(`${API_URL}/chat`, {
    session_id: sessionId,
    message,
  });
  return data;
}
