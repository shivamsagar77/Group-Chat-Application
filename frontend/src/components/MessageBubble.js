'use client';

import { useState } from 'react';
import styles from './MessageBubble.module.css';

export default function MessageBubble({ message, isGrouped, showAvatar }) {
  const [showTimestamp, setShowTimestamp] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={styles.statusIcon}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'sent':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={styles.statusIcon}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={styles.statusIcon}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case 'read':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={styles.statusIcon}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sending':
        return '#9E9E9E';
      case 'sent':
        return '#9E9E9E';
      case 'delivered':
        return '#4CAF50';
      case 'read':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div 
      className={`${styles.messageWrapper} ${message.isOwn ? styles.ownMessage : styles.otherMessage} ${isGrouped ? styles.grouped : ''}`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      {!message.isOwn && showAvatar && (
        <div className={styles.avatar}>
          <span className={styles.avatarText}>
            {message.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
      )}
      
      <div className={styles.messageContent}>
        {!message.isOwn && showAvatar && (
          <div className={styles.senderName}>{message.sender}</div>
        )}
        
        <div className={`${styles.messageBubble} ${message.isOwn ? styles.ownBubble : styles.otherBubble}`}>
          <div className={styles.messageText}>
            {message.text}
          </div>
          
          <div className={`${styles.messageMeta} ${message.isOwn ? styles.ownMeta : styles.otherMeta}`}>
            <span className={styles.timestamp}>
              {formatTime(message.timestamp)}
            </span>
            
            {message.isOwn && (
              <div className={styles.statusContainer}>
                {getStatusIcon(message.status)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {message.isOwn && (
        <div className={styles.ownAvatar}>
          <span className={styles.avatarText}>YO</span>
        </div>
      )}
    </div>
  );
}
