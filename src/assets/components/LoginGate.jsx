import React from 'react';
import styles from './LoginGate.module.css';

const LoginGate = ({handleLogin}) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>SPOTIFYND</h1>
            <button className={styles.button} onClick={handleLogin}>
                Log in to Auth
            </button>
            <div className={styles.footer}>
                Made with React by Pedro Rojo.
            </div>
        </div>
    );
}

export default LoginGate;