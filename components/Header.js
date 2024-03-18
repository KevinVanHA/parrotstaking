import React from 'react';
import styles from '../styles/Header.module.css'; // Assuming you have a CSS module for styling
import { ConnectWallet } from "@thirdweb-dev/react";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Space Authority Staking Platform</h1>
        <nav className={styles.menu}>
          <ul>
            <li><a href="#" className={styles.menuItem}>Home</a></li>
            <li><a href="#" className={styles.menuItem}>About</a></li>
            <li><a href="#" className={styles.menuItem}>Staking</a></li>
            <ConnectWallet theme="dark"/>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
