import React from "react";
import styles from './SearchBar.module.css';

const SearchBar = ({searchFunc, setSearchTerm, serachTerm}) => {
    return (
        <div className={styles.searchContainer}>
            <label className={styles.label}>Search a song:</label>
            <input 
                value={searchTerm}
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