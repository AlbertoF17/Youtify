import React, { useState } from "react";
import axios from "axios";

function YouTubeSearch() {
    const API_KEY = 'AIzaSyDE8dAwALkard3JWb6xxPNtJp6f_5GxwQA';
    const [searchTerm, setSearchTerm] = useState("");
    const [videos, setVideos] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleSearch = async (event) => {
        event.preventDefault();
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=10&type=video&q=${searchTerm}`
        );
        setVideos(response.data.items);
        setSelectedVideo(null);
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
        setVideos(null);
    };

    const handleClearResults = () => {
        setVideos(null);
        setSelectedVideo(null);
    }

    return (
        <div>
            <div id="buscador-Spotify">
                <div>
                    <input id="input-Spotify" type="text" placeholder="Search for a video" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={event => {
                        if (event.key === "Enter") {
                            handleSearch();
                        }
                    }} />
                    <button id="boton-Spotify" onClick={handleSearch}>
                        <svg version="1.1" viewBox="0 0 32 32">
                            <path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14
               s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0
               C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z"/>
                        </svg>
                    </button>
                </div>
            </div>
            {selectedVideo ? (
                <div id="video">
                    <button id="boton-borrar" onClick={handleClearResults}>Borrar</button>
                    <iframe
                        width="800"
                        height="450"
                        src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                        title={selectedVideo.snippet.title}
                        frameBorder = '0'
                    ></iframe>
                    <h2>{selectedVideo.snippet.title}</h2>
                </div>
            ) : videos ? (
                <div id='resultados-YouTube'>
                    <button id="boton-borrar" onClick={handleClearResults}>Borrar Resultados</button>
                    <ul id='lista-resultados'>
                        {videos.map((video) => (
                            <li key={video.id.videoId}>
                                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title}  onClick={() => handleVideoSelect(video)}/>
                                <h2>{video.snippet.title}</h2>
                            </li>
                        ))}
                    </ul>
                </div>
            ):(<div></div>)}
        </div>
    );
}

export default YouTubeSearch;