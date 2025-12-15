import React ,{useState, useEffect} from "react";
import { redirectToAuthCodeFlow, getAccessToken } from "../../services/spotifyAuth.js";

// Base URL per le API Spotify; preferisci mettere VITE_SPOTIFY_API_URL in .env.local
const SPOTIFY_API_URL = import.meta.env.VITE_SPOTIFY_API_URL || 'https://api.spotify.com/v1';

import Playlist from "./Playlist.jsx";
import SearchBar from "./SearchBar.jsx";
import SearchResults from "./SearchResults.jsx";
import Track from "./Track.jsx";
import Tracklist from "./Tracklist.jsx";
import LoginGate from "./LoginGate.jsx";

const App = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [userId, setUserId] = useState(null); // ⬅️ NUOVO: Necessario per salvare playlist
    const [isLoading, setIsLoading] = useState(false); // ⬅️ NUOVO: Stato di caricamento

    const [searchResults, setSearchResults] = useState([]);
    const [tracks, setTracks] = useState([])
    const [playlistTitle, setPlaylistTitle] = useState("My Playlist")
    const [savedPlaylist, setSavedPlaylist] = useState([])

    // Funzione per recuperare l'ID Utente (necessaria prima di creare la playlist)
    const fetchUserId = async (token) => {
        try {
            const response = await fetch(`${SPOTIFY_API_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Errore nel recupero ID utente");
            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error("Errore nel recupero ID Utente:", error);
            // In caso di 401 (Unauthorized), potresti forzare un re-login
            return null;
        }
    };

    //FUNZIONALITÀ DI LOGIN ALL'AVVIO DELL'APP
    useEffect(() => {
        const checkAuthAndGetToken = async () => {
            console.log('[Auth] Checking for stored token or code in URL...');
            let token = localStorage.getItem("access_token");
            const expiration = localStorage.getItem("token_expiration");
            const code = new URLSearchParams(window.location.search).get("code");

            // Caso 1: Token valido in localStorage
            if (token && Date.now() < expiration) {
                setAccessToken(token);
                setUserId(await fetchUserId(token)); // ⬅️ Recupera ID
                return;
            }

            // Caso 2: Scambio Codice (Ritorno da Spotify)
            if (code) {
                setIsLoading(true);
                try {
                    console.log('[Auth] Found code in URL, exchanging for token...');
                    const newToken = await getAccessToken(code); // Usiamo la funzione importata
                    console.log('[Auth] Token exchange succeeded');
                    setAccessToken(newToken);
                    
                    const id = await fetchUserId(newToken); // ⬅️ Recupera ID
                    setUserId(id); 

                    // Pulisce l'URL
                    window.history.pushState({}, null, window.location.pathname);
                } catch (error) {
                    console.error("Login fallito:", error);
                    // Mostra feedback utente e suggerisci di riprovare il login
                    alert('Login fallito: ' + (error.message || 'Controlla la console per dettagli'));
                    // Assicuriamoci di pulire eventuali residui
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('token_expiration');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        checkAuthAndGetToken();
    }, []); 

    // Funzione di login da passare al componente LoginGate
    const handleLogin = () => {
        redirectToAuthCodeFlow();
    };
    
    // ...

    // ...

const onSearch = async (term) => {
    if (!accessToken) {
        alert("Devi effettuare l'accesso per cercare tracce.");
        return;
    }
    if (!term) {
        setSearchResults([]);
        return;
    }
    
    setIsLoading(true);
    
    try {
        const response = await fetch(`${SPOTIFY_API_URL}/search?q=${term}&type=track`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (!response.ok) throw new Error("Errore API nella ricerca");
        
        const data = await response.json();
        
        const results = data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri // URI è fondamentale per il salvataggio!
        }));
        
        setSearchResults(results); 
        
    } catch (error) {
        console.error("Errore nella ricerca Spotify:", error);
        alert("Errore nella ricerca. Controlla la console.");
        setSearchResults([]);
    } finally {
        setIsLoading(false);
    }
}

// ...

    const onTrackAdded = (track) => {
        if(tracks.find(t => t.id === track.id)) return; // Evita duplicati
        //add track functionality will go here
        setTracks(prev => [track,...prev])
    }

    const onTrackRemoved = (trackId) => {
        //remove track functionality will go here
        setTracks(prev => prev.filter(track => track.id !== trackId))
    }

   // ... all'interno di const App = () => { ...

// Sostituzione completa della tua funzione onSavePlaylist
const onSavePlaylist = async () => {
    // 1. Controlli Preliminari
    if (!tracks.length || !playlistTitle) {
        alert("Aggiungi tracce e un titolo prima di salvare.");
        return;
    }
    if (!accessToken || !userId) {
        alert("Utente non connesso o ID utente non disponibile. Riprova il login.");
        return;
    }
    
    setIsLoading(true); 

    // Prepara l'array di URI delle tracce
    const trackUris = tracks.map(track => track.uri); 

    try {
        // --- FASE 1: CREAZIONE PLAYLIST (POST /users/{user_id}/playlists) ---
        console.log(`[Save] Creating playlist titled: ${playlistTitle} for user: ${userId}`);
        const createResponse = await fetch(`${SPOTIFY_API_URL}/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistTitle,
                description: "Made with Spotifynd app",
                public: false // La rendiamo privata per Jammming
            })
        });

        if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(`Errore creazione playlist: ${errorData.error.message || createResponse.statusText}`);
        }
        
        const playlistData = await createResponse.json();
        const playlistId = playlistData.id; // ⬅️ Otteniamo l'ID della nuova playlist!
        
        // --- FASE 2: AGGIUNGI LE TRACCE (POST /playlists/{playlist_id}/tracks) ---
        console.log(`[Save] Adding ${trackUris.length} tracks to playlist ID: ${playlistId}`);
        const addResponse = await fetch(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackUris 
            })
        });

        if (!addResponse.ok) {
            const errorData = await addResponse.json();
            throw new Error(`Errore aggiunta tracce: ${errorData.error.message || addResponse.statusText}`);
        }
        
        // --- FASE 3: PULIZIA E FEEDBACK ---
        alert(`Playlist "${playlistTitle}" salvata con successo su Spotify!`);
        
        // Resetta gli stati locali dopo il salvataggio
        setTracks([]); 
        setPlaylistTitle("My Playlist");
        
    } catch (error) {
        console.error("Salvataggio fallito:", error);
        alert(`Salvataggio fallito. Dettagli: ${error.message}. Controlla i permessi (scope: 'playlist-modify-private' è necessario!).`);
    } finally {
        setIsLoading(false);
    }
}

    return (
        <div>
            {!accessToken? 
                <LoginGate handleLogin={handleLogin}/>
            :
                <div>
                    <SearchBar searchFunc={onSearch}/>
                    <SearchResults toRender={searchResults} onAdded={onTrackAdded}/>
                    <Playlist tracks={tracks} title={playlistTitle} onRemove={onTrackRemoved} setTitle={setPlaylistTitle}/>
                    {/* <Track />
                    <Tracklist /> */}
                    <button onClick={onSavePlaylist}>Save {playlistTitle} to Spotify</button>
                </div>}
        </div>
    )
}

export default App;
