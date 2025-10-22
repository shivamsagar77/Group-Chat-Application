'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MessageList from '../../../components/MessageList';
import MessageInput from '../../../components/MessageInput';
import styles from './page.module.css';

export default function ChatPage({ params }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const conversationId = params.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render chat if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Get conversation data based on ID
  const getConversationData = (id) => {
    const conversations = {
      1: {
        name: "Alice Johnson",
        avatar: "AJ",
        isOnline: true,
        messages: [
          {
            id: 1,
            text: "Hey! How's the project going?",
            sender: "Alice Johnson",
            timestamp: new Date(Date.now() - 3600000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 2,
            text: "Great! Just finished the backend API integration. The new endpoints are working perfectly.",
            sender: "You",
            timestamp: new Date(Date.now() - 3000000),
            isOwn: true,
            status: 'read'
          },
          {
            id: 3,
            text: "That's awesome! I've been working on the frontend components. The new chat UI is looking really clean.",
            sender: "Alice Johnson",
            timestamp: new Date(Date.now() - 2400000),
            isOwn: false,
            status: 'delivered'
          }
        ]
      },
      2: {
        name: "Bob Smith",
        avatar: "BS",
        isOnline: true,
        messages: [
          {
            id: 1,
            text: "Great! Just finished the backend API integration.",
            sender: "Bob Smith",
            timestamp: new Date(Date.now() - 3000000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 2,
            text: "Awesome work Bob! I've been working on the frontend components. The new chat UI is looking really clean.",
            sender: "You",
            timestamp: new Date(Date.now() - 2400000),
            isOwn: true,
            status: 'read'
          },
          {
            id: 3,
            text: "Thanks! When do you think we can have a demo ready?",
            sender: "Bob Smith",
            timestamp: new Date(Date.now() - 1800000),
            isOwn: false,
            status: 'delivered'
          }
        ]
      },
      3: {
        name: "Carol Davis",
        avatar: "CD",
        isOnline: false,
        messages: [
          {
            id: 1,
            text: "When do you think we can have a demo ready?",
            sender: "Carol Davis",
            timestamp: new Date(Date.now() - 1800000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 2,
            text: "I'm thinking by end of this week. We just need to polish a few details and add some final touches.",
            sender: "You",
            timestamp: new Date(Date.now() - 1200000),
            isOwn: true,
            status: 'read'
          }
        ]
      },
      4: {
        name: "David Wilson",
        avatar: "DW",
        isOnline: true,
        messages: [
          {
            id: 1,
            text: "Perfect! I'll prepare the presentation slides then. This is going to be amazing! 🚀",
            sender: "David Wilson",
            timestamp: new Date(Date.now() - 1200000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 2,
            text: "Sounds like a plan! Let's schedule a team meeting for Friday to go through everything.",
            sender: "You",
            timestamp: new Date(Date.now() - 600000),
            isOwn: true,
            status: 'sent'
          }
        ]
      },
      5: {
        name: "Emma Brown",
        avatar: "EB",
        isOnline: false,
        messages: [
          {
            id: 1,
            text: "Sounds like a plan! Let's schedule a team meeting.",
            sender: "Emma Brown",
            timestamp: new Date(Date.now() - 600000),
            isOwn: false,
            status: 'delivered'
          }
        ]
      },
      6: {
        name: "Project Team Alpha",
        avatar: "PT",
        isOnline: true,
        isGroup: true,
        memberCount: 4,
        messages: [
          {
            id: 1,
            text: "Hey everyone! How's the project going?",
            sender: "Alice Johnson",
            timestamp: new Date(Date.now() - 3600000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 2,
            text: "Great! Just finished the backend API integration. The new endpoints are working perfectly.",
            sender: "Bob Smith",
            timestamp: new Date(Date.now() - 3000000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 3,
            text: "Awesome work Bob! I've been working on the frontend components. The new chat UI is looking really clean.",
            sender: "You",
            timestamp: new Date(Date.now() - 2400000),
            isOwn: true,
            status: 'read'
          },
          {
            id: 4,
            text: "That's fantastic! When do you think we can have a demo ready?",
            sender: "Carol Davis",
            timestamp: new Date(Date.now() - 1800000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 5,
            text: "I'm thinking by end of this week. We just need to polish a few details and add some final touches.",
            sender: "You",
            timestamp: new Date(Date.now() - 1200000),
            isOwn: true,
            status: 'read'
          },
          {
            id: 6,
            text: "Perfect! I'll prepare the presentation slides then. This is going to be amazing! 🚀",
            sender: "Alice Johnson",
            timestamp: new Date(Date.now() - 600000),
            isOwn: false,
            status: 'delivered'
          },
          {
            id: 7,
            text: "Sounds like a plan! Let's schedule a team meeting for Friday to go through everything.",
            sender: "You",
            timestamp: new Date(Date.now() - 300000),
            isOwn: true,
            status: 'sent'
          }
        ]
      }
    };

    return conversations[id] || {
      name: "Unknown User",
      avatar: "U",
      isOnline: false,
      messages: []
    };
  };

  const conversation = getConversationData(conversationId);
  const [messages, setMessages] = useState(conversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: messageText,
        sender: user?.name || "You",
        timestamp: new Date(),
        isOwn: true,
        status: 'sending'
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // Simulate message status update
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
