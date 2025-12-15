import React from "react";
import styles from './Playlist.module.css';

const Playlist = ({tracks, title, onRemove, setTitle}) => {
    return (
        <div className={styles.playlistContainer}>
            <input 
                className={styles.titleInput}
                value={title} 
                onChange={({target}) => setTitle(target.value)} 
                type="text"
                placeholder="My Awesome Playlist"
            />
            <hr className={styles.divider} />
            <div className={styles.tracksContainer}>
                {tracks.length ? (
                    tracks.map(track => (
                        <div key={track.id} className={styles.trackCard}>
                            <div className={styles.trackInfo}>
                                <h3 className={styles.trackName}>{track.name}</h3>
                                <p className={styles.trackDetails}>{track.artist} | {track.album}</p>
                            </div>
                            <button className={styles.removeButton} onClick={() => onRemove(track.id)}>
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={styles.emptyState}>No tracks in playlist yet</p>
                )}
            </div>
        </div>
    );
}

export default Playlist;