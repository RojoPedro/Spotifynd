import React from "react";
import styles from './SearchBar.module.css';

const SearchBar = ({searchFunc, setSearchTerm}) => {
    return (
        <div className={styles.searchContainer}>
            <label className={styles.label}>Search a song:</label>
            <input 
                className={styles.input}
                type="text" 
                placeholder="Artist, song, or album..."
                onChange={({target}) => {
                    setSearchTerm(target.value);
                    searchFunc(target.value)
                }
                }
            />
        </div>
    );
}

export default SearchBar;