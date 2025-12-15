import React from "react";

const SearchResults = ({toRender,onAdded}) =>{

    return (
        <>
            {toRender.map(track=>{
                return (<div key={track.id}>
                    <h3>{track.name}</h3>
                    <p>{track.artist} | {track.album}</p>
                    <button onClick={()=>onAdded(track)}>Add</button>
                </div>)
            })}
        </>
    ) 
}

export default SearchResults;