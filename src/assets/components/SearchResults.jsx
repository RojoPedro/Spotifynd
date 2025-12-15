import React from "react";
import styles from './SearchResults.module.css';

const SearchResults = ({toRender, onAdded}) => {
    return (
        <div className={styles.resultsContainer}>
            {toRender.length ? (
                toRender.map(track => (
                    <div key={track.id} className={styles.trackCard}>
                        <div className={styles.trackInfo}>
                            <h3 className={styles.trackName}>{track.name}</h3>
                            <p className={styles.trackDetails}>{track.artist} | {track.album}</p>
                        </div>
                        <button className={styles.addButton} onClick={() => onAdded(track)}>
                            Add
                        </button>
                    </div>
                ))
            ) : (
                <p className={styles.emptyState}>Search for songs to add to your playlist</p>
            )}
        </div>
    );
}

export default SearchResults;