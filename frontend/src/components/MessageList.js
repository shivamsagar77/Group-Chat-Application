'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import styles from './MessageList.module.css';

export default function MessageList({ messages, messagesEndRef }) {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const dateKey = messageDate.toDateString();
      
      if (messageDate.toDateString() === today.toDateString()) {
        grouped['Today'] = grouped['Today'] || [];
        grouped['Today'].push(message);
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        grouped['Yesterday'] = grouped['Yesterday'] || [];
        grouped['Yesterday'].push(message);
      } else {
        const formattedDate = messageDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        grouped[formattedDate] = grouped[formattedDate] || [];
        grouped[formattedDate].push(message);
      }
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={styles.messagesContainer} ref={messagesContainerRef}>
      <div className={styles.messagesList}>
        {Object.entries(groupedMessages).map(([dateLabel, dateMessages]) => (
          <div key={dateLabel} className={styles.dateGroup}>
            <div className={styles.dateSeparator}>
              <span className={styles.dateLabel}>{dateLabel}</span>
            </div>
            
            {dateMessages.map((message, index) => {
              const prevMessage = index > 0 ? dateMessages[index - 1] : null;
              const nextMessage = index < dateMessages.length - 1 ? dateMessages[index + 1] : null;
              
              // Group consecutive messages from the same sender
              const shouldGroupWithPrev = prevMessage && 
                prevMessage.sender === message.sender && 
                (new Date(message.timestamp) - new Date(prevMessage.timestamp)) < 300000; // 5 minutes
              
              const shouldGroupWithNext = nextMessage && 
                nextMessage.sender === message.sender && 
                (new Date(nextMessage.timestamp) - new Date(message.timestamp)) < 300000; // 5 minutes

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isGrouped={shouldGroupWithPrev || shouldGroupWithNext}
                  showAvatar={!shouldGroupWithNext}
                />
              );
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
