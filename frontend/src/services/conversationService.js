import { API_URLS, HTTP_HEADERS } from '../constants/api';

// Get conversation members by conversation ID
export const getConversationMembers = async (conversationId, token) => {
  try {
    const response = await fetch(`${API_URLS.CONVERSATION_MEMBERS}/get_members/${conversationId}`, {
      method: 'GET',
      headers: HTTP_HEADERS.AUTH(token)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching conversation members:', error);
    throw error;
  }
};

// Add member to conversation
export const addConversationMember = async (memberData, token) => {
  try {
    const response = await fetch(`${API_URLS.CONVERSATION_MEMBERS}/add_member`, {
      method: 'POST',
      headers: HTTP_HEADERS.AUTH(token),
      body: JSON.stringify(memberData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding conversation member:', error);
    throw error;
  }
};

// Delete member from conversation
export const deleteConversationMember = async (memberId, token) => {
  try {
    const response = await fetch(`${API_URLS.CONVERSATION_MEMBERS}/delete_member/${memberId}`, {
      method: 'DELETE',
      headers: HTTP_HEADERS.AUTH(token)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting conversation member:', error);
    throw error;
  }
};

// Get user's conversations (conversations where user is a member)
export const getUserConversations = async (userId, token) => {
  try {
    const response = await fetch(`${API_URLS.CONVERSATION_MEMBERS}/get_user_conversations/${userId}`, {
      method: 'GET',
      headers: HTTP_HEADERS.AUTH(token)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw error;
  }
};

// Get users available for new chat
export const getUsersForChat = async (userId, token) => {
  try {
    const response = await fetch(`${API_URLS.GET_USERS_FOR_CHAT}?user_id=${userId}`, {
      method: 'GET',
      headers: HTTP_HEADERS.AUTH(token)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users for chat:', error);
    throw error;
  }
};

// Create new conversation with selected user
export const createNewConversation = async (currentUserId, selectedUserId, token) => {
  try {
    // Generate a unique conversation ID
    const conversationId = Date.now(); // Simple unique ID for now
    
    // Add current user to conversation
    const currentUserResponse = await addConversationMember({
      member_id: conversationId,
      user_id: currentUserId
    }, token);

    if (!currentUserResponse.success) {
      throw new Error('Failed to add current user to conversation');
    }

    // Add selected user to conversation
    const selectedUserResponse = await addConversationMember({
      member_id: conversationId,
      user_id: selectedUserId
    }, token);

    if (!selectedUserResponse.success) {
      throw new Error('Failed to add selected user to conversation');
    }

    return {
      success: true,
      message: 'Conversation created successfully',
      conversationId: conversationId
    };
  } catch (error) {
    console.error('Error creating new conversation:', error);
    throw error;
  }
};
