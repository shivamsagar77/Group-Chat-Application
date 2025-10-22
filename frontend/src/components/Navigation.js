'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = isAuthenticated() 
    ? [
        { href: '/conversations', label: 'Conversations', icon: '💬' },
        { href: '/profile', label: 'Profile', icon: '👤' }
      ]
    : [
        { href: '/login', label: 'Login', icon: '🔐' },
        { href: '/signup', label: 'Sign Up', icon: '👤' },
        { href: '/forgot-password', label: 'Reset Password', icon: '🔑' }
      ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💬</span>
          <span className={styles.logoText}>Group Chat</span>
        </div>
        
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
          
          {isAuthenticated() && (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || 'User'}</span>
                <span className={styles.userStatus}>Online</span>
              </div>
              <button 
                className={styles.logoutButton}
                onClick={logout}
                title="Logout"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
