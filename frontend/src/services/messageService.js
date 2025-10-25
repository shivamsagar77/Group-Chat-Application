import { API_URLS, HTTP_HEADERS } from '../constants/api';

// Get all messages between two users
export const getMessages = async (userId, memberId, token) => {
  try {
    const response = await fetch(`${API_URLS.MESSAGES}/get_all_messages_of_member_id?user_id=${userId}&member_id=${memberId}`, {
      method: 'GET',
      headers: HTTP_HEADERS.AUTH(token)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (messageData, token) => {
  try {
    const response = await fetch(`${API_URLS.MESSAGES}/send_message`, {
      method: 'POST',
      headers: HTTP_HEADERS.AUTH(token),
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
