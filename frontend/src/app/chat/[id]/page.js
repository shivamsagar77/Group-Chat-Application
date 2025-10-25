'use client';

import { useState, useRef, use, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MessageList from '../../../components/MessageList';
import MessageInput from '../../../components/MessageInput';
import { getMessages, sendMessage } from '../../../services/messageService';
import styles from './page.module.css';

export default function ChatPage({ params }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;
  
  // State for messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(null);
  const [memberName, setMemberName] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessagesError(null);
      
      const token = localStorage.getItem('group_chat_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Using conversationId as memberId (this should be the actual member ID)
      console.log('Fetching messages for user:', user.id, 'member:', conversationId);
      const response = await getMessages(user.id, conversationId, token);
      
      if (response.success) {
        // Set member name from response
        if (response.data.member_name) {
          setMemberName(response.data.member_name);
        }
        
        // Transform API data to match our UI structure
        const transformedMessages = response.data.messages ? response.data.messages.map((message, index) => ({
          id: message.id || index + 1,
          text: message.message || message.text,
          sender: message.sender_name || message.sender || "",
          timestamp: new Date(message.created_at || message.timestamp || Date.now()),
          isOwn: message.user_id === user.id,
          status: 'delivered'
        })) : [];
        
        setMessages(transformedMessages);
      } else {
        throw new Error(response.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessagesError(error.message);
      
      // Show welcome message if no messages found
      setMessages([{
        id: 1,
        text: "Welcome to your conversation! Start chatting now.",
        sender: "System",
        timestamp: new Date(),
        isOwn: false,
        status: 'delivered'
      }]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch messages when component mounts
  useEffect(() => {
    if (isAuthenticated() && user?.id && conversationId) {
      fetchMessages();
    }
  }, [isAuthenticated, user?.id, conversationId]);

  // Show loading
  if (loading || messagesLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>{loading ? 'Loading...' : 'Loading messages...'}</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    router.push('/login');
    return null;
  }

  // Show error if messages failed to load
  if (messagesError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Error Loading Messages</h3>
        <p>{messagesError}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchMessages}
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleSendMessage = async (messageText) => {
    if (messageText.trim()) {
      const newMsg = {
        id: Date.now(), // Use timestamp as unique ID
        text: messageText,
        sender: user?.name || "You",
        timestamp: new Date(),
        isOwn: true,
        status: 'sending'
      };
      
      // Add message to UI immediately
      setMessages(prev => [...prev, newMsg]);
      
      try {
        const token = localStorage.getItem('group_chat_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        if (!user?.id) {
          throw new Error('User ID not found');
        }

        // Send message to API
        const response = await sendMessage({
          user_id: user.id,
          message: messageText,
          member_id: conversationId
        }, token);

        if (response.success) {
          // Update message status to sent
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newMsg.id 
                ? { ...msg, status: 'sent' }
                : msg
            )
          );
        } else {
          throw new Error(response.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Update message status to failed
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMsg.id 
              ? { ...msg, status: 'failed' }
              : msg
          )
        );
      }
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
            <span className={styles.avatarText}>
              {memberName ? memberName.charAt(0).toUpperCase() : 'C'}
            </span>
            <div className={styles.onlineIndicator}></div>
          </div>
          
          <div className={styles.conversationDetails}>
            <h2 className={styles.conversationName}>
              {memberName || `Chat ${conversationId}`}
            </h2>
            <p className={styles.conversationStatus}>Online</p>
          </div>
        </div>
        
        {/* Simple chat - no extra buttons needed */}
      </div>
      
      <div className={styles.chatBody}>
        <MessageList 
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          placeholder={`Message ${memberName || `Chat ${conversationId}`}...`}
        />
      </div>
    </div>
  );
}
