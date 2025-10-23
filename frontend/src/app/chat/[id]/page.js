'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MessageList from '../../../components/MessageList';
import MessageInput from '../../../components/MessageInput';
import { getConversationMembers } from '../../../services/conversationService';
import styles from './page.module.css';

export default function ChatPage({ params }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const conversationId = params.id;
  
  // State for conversation data
  const [conversation, setConversation] = useState(null);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [conversationError, setConversationError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch conversation data from API
  const fetchConversationData = async () => {
    try {
      setConversationLoading(true);
      setConversationError(null);
      
      const token = localStorage.getItem('group_chat_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await getConversationMembers(conversationId, token);
      
      if (response.success) {
        // Transform API data to match our UI structure
        const conversationData = {
          id: conversationId,
          name: `Conversation ${conversationId}`,
          avatar: `C${conversationId}`,
          isOnline: true,
          isGroup: response.data.length > 2,
          memberCount: response.data.length,
          members: response.data,
          messages: [
            {
              id: 1,
              text: "Welcome to your new conversation! Start chatting now.",
              sender: "System",
              timestamp: new Date(),
              isOwn: false,
              status: 'delivered'
            }
          ]
        };
        
        setConversation(conversationData);
        setMessages(conversationData.messages);
      } else {
        throw new Error(response.message || 'Failed to fetch conversation data');
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setConversationError(error.message);
    } finally {
      setConversationLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch conversation data when component mounts
  useEffect(() => {
    if (isAuthenticated() && conversationId) {
      fetchConversationData();
    }
  }, [isAuthenticated, conversationId]);

  // Show loading while checking authentication or fetching conversation
  if (loading || conversationLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>{loading ? 'Loading...' : 'Loading conversation...'}</p>
      </div>
    );
  }

  // Don't render chat if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Show error if conversation failed to load
  if (conversationError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Error Loading Conversation</h3>
        <p>{conversationError}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchConversationData}
        >
          Try Again
        </button>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/conversations')}
        >
          Back to Conversations
        </button>
      </div>
    );
  }

  // Don't render if conversation data is not loaded
  if (!conversation) {
    return null;
  }

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      const newMsg = {
        id: Date.now(), // Use timestamp as unique ID
        text: messageText,
        sender: user?.name || "You",
        timestamp: new Date(),
        isOwn: true,
        status: 'sending'
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // TODO: Send message to API
      // For now, just simulate message status update
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMsg.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMsg.id 
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }, 2000);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/conversations')}
          title="Back to conversations"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
        </button>
        
        <div className={styles.conversationInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>{conversation.avatar}</span>
            {conversation.isOnline && !conversation.isGroup && (
              <div className={styles.onlineIndicator}></div>
            )}
          </div>
          
          <div className={styles.conversationDetails}>
            <h2 className={styles.conversationName}>{conversation.name}</h2>
            <p className={styles.conversationStatus}>
              {conversation.isGroup 
                ? `${conversation.memberCount} members` 
                : conversation.isOnline ? 'Online' : 'Last seen recently'
              }
            </p>
          </div>
        </div>
        
        <div className={styles.chatActions}>
          <button className={styles.actionButton} title="Voice call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
          
          <button className={styles.actionButton} title="Video call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          
          <button className={styles.actionButton} title="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.chatBody}>
        <MessageList 
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          placeholder={`Message ${conversation.name}...`}
        />
      </div>
    </div>
  );
}
