'use client';

import styles from './ConversationItem.module.css';

export default function ConversationItem({ conversation, onClick, formatTime }) {
  const {
    name,
    lastMessage,
    timestamp,
    unreadCount,
    avatar,
    isOnline,
    isGroup,
    memberCount,
    lastMessageSender
  } = conversation;

  return (
    <div className={styles.conversationItem} onClick={onClick}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>{avatar}</span>
        </div>
        {isOnline && !isGroup && (
          <div className={styles.onlineIndicator}></div>
        )}
      </div>
      
      <div className={styles.conversationContent}>
        <div className={styles.conversationHeader}>
          <h3 className={styles.conversationName}>{name}</h3>
          <span className={styles.timestamp}>{formatTime(timestamp)}</span>
        </div>
        
        <div className={styles.conversationPreview}>
          <p className={styles.lastMessage}>
            {isGroup && lastMessageSender !== 'You' && (
              <span className={styles.senderName}>{lastMessageSender}: </span>
            )}
            {lastMessage}
          </p>
          {unreadCount > 0 && (
            <div className={styles.unreadBadge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
        
        {isGroup && (
          <div className={styles.groupInfo}>
            <span className={styles.memberCount}>{memberCount} members</span>
            <div className={styles.groupIndicator}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.5-2c-.47-.62-1.21-.99-2.01-.99H9.46c-.8 0-1.54.37-2.01.99L4.5 14.37V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H13c.8 0 1.54.37 2.01.99L16.5 10.5l1.5-2c.47-.62 1.21-.99 2.01-.99h.54c.8 0 1.54.37 2.01.99L24.5 14.37V22h-2v-6H20z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
