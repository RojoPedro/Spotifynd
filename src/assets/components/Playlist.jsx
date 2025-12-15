import React from "react";

const Playlist = ({tracks,title}) =>{
    return (
        <>  
            <h2>{title}</h2>
            <>-- -- -- -- -- -- -- -- -- -- -- --</>
            {tracks.length ? 
            tracks.map(track=>{ return (<div key={track.id}>
                                    <h3>{track.name}</h3>
                                    <p>{track.artist} | {track.album}</p>
                                </div>)}) : 
            <p>No tracks in playlist</p>}
        </>
    )
}

export default Playlist;