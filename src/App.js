import React, { useState, useEffect } from 'react';
import SpotifyWebApi from './spotify-web-api-js';
import Spotify from './spotify-player';
import './App.css';

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = "2d8b9cb8479a4de8b6eb8a863d30af0a";
const CLIENT_SECRET = "fe023b67330a45608aa2eca95f1f327b";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [player, setPlayer] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => localStorage.setItem("token", data.access_token));
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    spotifyApi.searchTracks(searchTerm, { limit: 7 }).then((data) => {
      setSearchResults(data.tracks.items);
    });
  };

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    player?.pause().then(() => {
      player?.setVolume(0.5).then(() => {
        player?.resume().then(() => {
          player?.play({ uris: [track.uri] });
        });
      });
    });
  };

  return (
    <div className="App">
      <div id="Spotify">
        <h1>Spotify Player</h1>
          <div className="floating">
            <img id="Logo-Spotify" className="giro" src={require("./Logo-Spotify.png")}></img>
          </div>
          <div id="buscador-Spotify">
            <input type="text" placeholder="Search for a track" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress = {event => {
              if(event.key === "Enter"){
                console.log("enter");
                handleSearch();
              }
            }}/>
            <button onClick={handleSearch}>Search</button>
          </div>
          <ul id="resultado">
              {searchResults.map((track) => ( 
                <li key={track.id}><button onClick={() => {
                  document.querySelector("#track").setAttribute('src','https://open.spotify.com/embed/track/'+(track.uri).substring((track.uri).lastIndexOf(":")+1))
                  document.querySelector("#track").className="";
              }}>Play</button>
                {track.name} by {track.artists[0].name}
                </li>
              ))}
          </ul>
            <iframe id="track" allow="encrypted-media" className="hidden" src="" width="500" height="200" frameBorder="0"></iframe>
      </div>
      <div id="YouTube">
        <h1>YouTube Player</h1>
        <div className="floating">
          <img id="Logo-YouTube" className="giro" src={require("./Logo-YouTube.png")}></img>
        </div>
      </div>
    </div>  
  );
}

export default App;