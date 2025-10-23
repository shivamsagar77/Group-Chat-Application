'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ConversationItem from '../../components/ConversationItem';
import { getUserConversations, getUsersForChat, createNewConversation } from '../../services/conversationService';
import styles from './page.module.css';

export default function ConversationsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // State for conversations data
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);
  
  // State for new chat modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Fetch conversations data from API
  const fetchConversations = async () => {
    try {
      setConversationsLoading(true);
      setConversationsError(null);
      
      const token = localStorage.getItem('group_chat_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const response = await getUserConversations(user.id, token);
      
      if (response.success) {
        // Transform API data to match our UI structure
        const transformedConversations = response.data.map((conversation, index) => ({
          id: conversation.id || index + 1,
          name: `Conversation ${conversation.id || index + 1}`,
          lastMessage: "No messages yet",
          timestamp: new Date(conversation.created_at || Date.now()),
          unreadCount: 0,
          avatar: `C${conversation.id || index + 1}`,
          isOnline: true,
          lastMessageSender: "System",
          isGroup: false
        }));
        
        setConversations(transformedConversations);
      } else {
        throw new Error(response.message || 'Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversationsError(error.message);
    } finally {
      setConversationsLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch available users for new chat
  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      const token = localStorage.getItem('group_chat_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await getUsersForChat(user.id, token);
      
      if (response.success) {
        setAvailableUsers(response.data);
        setShowNewChatModal(true);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // Handle new chat button click
  const handleNewChatClick = () => {
    fetchAvailableUsers();
  };

  // Handle user selection for new chat
  const handleUserSelect = async (selectedUser) => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      const token = localStorage.getItem('group_chat_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Create new conversation
      const response = await createNewConversation(user.id, selectedUser.id, token);
      
      if (response.success) {
        // Close modal
        setShowNewChatModal(false);
        
        // Refresh conversations list
        await fetchConversations();
        
        // Navigate to the new chat
        router.push(`/chat/${response.conversationId}`);
      } else {
        throw new Error(response.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch conversations when component mounts
  useEffect(() => {
    if (isAuthenticated() && user?.id) {
      fetchConversations();
    }
  }, [isAuthenticated, user?.id]);

  // Show loading while checking authentication or fetching conversations
  if (loading || conversationsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>{loading ? 'Loading...' : 'Loading conversations...'}</p>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Show error if conversations failed to load
  if (conversationsError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Error Loading Conversations</h3>
        <p>{conversationsError}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchConversations}
        >
          Try Again
        </button>
      </div>
    );
  }


  const handleConversationClick = (conversation) => {
    router.push(`/chat/${conversation.id}`);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={styles.conversationsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conversations</h1>
        <div className={styles.headerActions}>
          <button 
            className={styles.newChatButton} 
            title="New Chat"
            onClick={handleNewChatClick}
            disabled={usersLoading}
          >
            {usersLoading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={styles.conversationsList}>
        {conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h3>No Conversations Yet</h3>
            <p>Start a new conversation to begin chatting!</p>
            <button 
              className={styles.newChatButton}
              onClick={handleNewChatClick}
              disabled={usersLoading}
            >
              {usersLoading ? 'Loading...' : 'Start New Chat'}
            </button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={() => handleConversationClick(conversation)}
              formatTime={formatTime}
            />
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Start New Chat</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowNewChatModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {usersLoading ? (
                <div className={styles.loadingMessage}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Creating conversation...</p>
                </div>
              ) : usersError ? (
                <div className={styles.errorMessage}>
                  <p>{usersError}</p>
                  <button 
                    className={styles.retryButton}
                    onClick={fetchAvailableUsers}
                  >
                    Try Again
                  </button>
                </div>
              ) : availableUsers.length === 0 ? (
                <div className={styles.emptyMessage}>
                  <p>No users available for new chat</p>
                </div>
              ) : (
                <div className={styles.usersList}>
                  {availableUsers.map((user) => (
                    <div 
                      key={user.id}
                      className={styles.userItem}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className={styles.userAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.userInfo}>
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
