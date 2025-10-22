'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ConversationItem from '../../components/ConversationItem';
import styles from './page.module.css';

export default function ConversationsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

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

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Sample conversations data
  const [conversations] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      lastMessage: "Hey! How's the project going?",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      unreadCount: 2,
      avatar: "AJ",
      isOnline: true,
      lastMessageSender: "Alice Johnson"
    },
    {
      id: 2,
      name: "Bob Smith",
      lastMessage: "Great! Just finished the backend API integration.",
      timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
      unreadCount: 0,
      avatar: "BS",
      isOnline: true,
      lastMessageSender: "Bob Smith"
    },
    {
      id: 3,
      name: "Carol Davis",
      lastMessage: "When do you think we can have a demo ready?",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      unreadCount: 1,
      avatar: "CD",
      isOnline: false,
      lastMessageSender: "Carol Davis"
    },
    {
      id: 4,
      name: "David Wilson",
      lastMessage: "Perfect! I'll prepare the presentation slides then.",
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      unreadCount: 0,
      avatar: "DW",
      isOnline: true,
      lastMessageSender: "David Wilson"
    },
    {
      id: 5,
      name: "Emma Brown",
      lastMessage: "Sounds like a plan! Let's schedule a team meeting.",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      unreadCount: 3,
      avatar: "EB",
      isOnline: false,
      lastMessageSender: "Emma Brown"
    },
    {
      id: 6,
      name: "Project Team Alpha",
      lastMessage: "Great work everyone! 🚀",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      unreadCount: 0,
      avatar: "PT",
      isOnline: true,
      isGroup: true,
      memberCount: 4,
      lastMessageSender: "You"
    }
  ]);

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
          <button className={styles.newChatButton} title="New Chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.conversationsList}>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={() => handleConversationClick(conversation)}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
}
