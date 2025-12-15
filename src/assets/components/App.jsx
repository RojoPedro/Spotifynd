import React ,{useState} from "react";
import Playlist from "./Playlist.jsx";
import SearchBar from "./SearchBar.jsx";
import SearchResults from "./SearchResults.jsx";
import Track from "./Track.jsx";
import Tracklist from "./Tracklist.jsx";

const App = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [tracks, setTracks] = useState([])
    const [playlistTitle, setPlaylistTitle] = useState("My Playlist")

    const onSearch = () => { 
        //search functionality will go here
        const fakeFetch = [
            {name: "Il Metodo Migliore", artist: "Hammon", album: "Scammers", id: 1},
            {name: "Favolacce", artist: "Nayt", album: "Sensibile", id: 2}]; 
        setSearchResults(fakeFetch)
    }

    const onTrackAdded = (track) => {
        //add track functionality will go here
        setTracks(prev => [track,...prev])
    }

    return (
        <div>
            <SearchBar />
            <SearchResults toRender={searchResults} onAdded={onTrackAdded}/>
            <Playlist tracks={tracks} title={playlistTitle}/>
            {/* <Track />
            <Tracklist /> */}
            <button>Save to Spotify</button>
            <button onClick={onSearch}>Search</button>
        </div>
    )
}

export default App;
