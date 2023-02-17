import React, { useState, useEffect } from 'react';
import SpotifyWebApi from './spotify-web-api-js';
import './App.css';

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = "2d8b9cb8479a4de8b6eb8a863d30af0a";
const CLIENT_SECRET = "fe023b67330a45608aa2eca95f1f327b";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
      .then(data => localStorage.setItem("Spotify token", data.access_token));
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    spotifyApi.searchTracks(searchTerm, { limit: 7 }).then((data) => {
      setSearchResults(data.tracks.items);
    });
  };

  return (
    <div className="App">
      <div id="Spotify">
        <h1>Spotify Player</h1>
        <div className="floating">
          <img id="Logo-Spotify" alt="Logo Spotify" className="giro" src={require("./Logo-Spotify.png")}></img>
        </div>
        <div id="buscador-Spotify">
          <input type="text" placeholder="Search for a track" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={event => {
            if (event.key === "Enter") {
              console.log("enter");
              handleSearch();
            }
          }} />
          <button onClick={handleSearch}><svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0, 500) scale(0.1,-0.1)" fill="#000000" stroke="none">
              <path d="M2085 4474 c-709 -76 -1277 -596 -1417 -1297 -32 -161 -32 -433 0
              -594 64 -320 215 -605 439 -829 230 -230 503 -376 833 -445 154 -33 439 -33
              597 -1 180 36 371 108 507 191 37 22 71 41 74 41 4 0 198 -191 432 -423 483
              -481 471 -472 610 -471 100 0 160 24 225 89 65 65 89 125 89 225 0 141 10 128
              -473 613 -411 412 -425 428 -412 450 107 169 183 359 223 562 32 157 32 431 0
              592 -129 648 -623 1144 -1267 1273 -98 20 -368 34 -460 24z m325 -489 c235
              -35 449 -144 620 -315 333 -333 423 -838 225 -1258 -62 -131 -127 -224 -225
              -322 -333 -332 -838 -423 -1256 -226 -348 165 -583 476 -639 846 -73 477 164
              942 594 1164 213 110 443 148 681 111z"/>
            </g>
          </svg></button>
        </div>
        <ul id="resultado">
          {searchResults.map((track) => (
            <li key={track.id} onClick={() => {
              document.querySelector("#track").setAttribute('src', 'https://open.spotify.com/embed/track/' + (track.uri).substring((track.uri).lastIndexOf(":") + 1))
              document.querySelector("#track").className = "";
            }}><button id="boton-play" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><g><path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"></path></g></svg></button>
              {track.name} by {track.artists[0].name}
            </li>
          ))}
        </ul>
        <iframe title="track" id="track" allow="encrypted-media" className="hidden" src="" width="500" height="200" frameBorder="0"></iframe>
      </div>
      <div id="YouTube">
        <h1>YouTube Player</h1>
        <div className="floating">
          <img id="Logo-YouTube" alt="Logo YouTube" className="giro" src={require("./Logo-YouTube.png")}></img>
        </div>
      </div>
    </div>
  );
}

export default App;