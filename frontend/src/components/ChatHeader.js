'use client';

import { useState } from 'react';
import styles from './ChatHeader.module.css';

export default function ChatHeader({ groupName, memberCount, isOnline }) {
  const [showMembers, setShowMembers] = useState(false);

  const members = [
    { name: "Alice Johnson", status: "online", avatar: "AJ" },
    { name: "Bob Smith", status: "online", avatar: "BS" },
    { name: "Carol Davis", status: "away", avatar: "CD" },
    { name: "You", status: "online", avatar: "YO" }
  ];

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.groupInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>PT</span>
          </div>
          <div className={styles.groupDetails}>
            <h2 className={styles.groupName}>{groupName}</h2>
            <p className={styles.memberCount}>
              {isOnline ? `${memberCount} members online` : `${memberCount} members`}
            </p>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.actionButton}
            onClick={() => setShowMembers(!showMembers)}
            title="Group members"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.5-2c-.47-.62-1.21-.99-2.01-.99H9.46c-.8 0-1.54.37-2.01.99L4.5 14.37V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H13c.8 0 1.54.37 2.01.99L16.5 10.5l1.5-2c.47-.62 1.21-.99 2.01-.99h.54c.8 0 1.54.37 2.01.99L24.5 14.37V22h-2v-6H20z"/>
            </svg>
          </button>
          
          <button className={styles.actionButton} title="Video call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          
          <button className={styles.actionButton} title="Voice call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
          
          <button className={styles.actionButton} title="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {showMembers && (
        <div className={styles.membersDropdown}>
          <div className={styles.membersList}>
            {members.map((member, index) => (
              <div key={index} className={styles.memberItem}>
                <div className={styles.memberAvatar}>
                  <span className={styles.memberAvatarText}>{member.avatar}</span>
                  <div className={`${styles.statusIndicator} ${styles[member.status]}`}></div>
                </div>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{member.name}</span>
                  <span className={styles.memberStatus}>
                    {member.status === 'online' ? 'Online' : 
                     member.status === 'away' ? 'Away' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
