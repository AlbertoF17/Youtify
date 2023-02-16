import React, { useState, useEffect } from 'react';
import SpotifyWebApi from './spotify-web-api-js';
import Spotify from './spotify-player';
import './App.css';

const spotifyApi = new SpotifyWebApi();

var access_token = 'BQCjFpbXPRDbqc2-wIbRWT_nSKWmdokFqzyxmhg3akAK1R-elJN0LpUU9ozod_fcgGwW73biVvlOctxa-HgUkGkIBQQyueZSO0fo3z9Jh7vKnWS5fmsY';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    // This is called when the Spotify Web Playback SDK is ready to be used
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = access_token;
      const newPlayer = new Spotify.Player({
        name: 'React Spotify Player',
        getOAuthToken: (cb) => { cb(token); }
      });

      // Ready
      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      setPlayer(newPlayer);
    };
  }, []);

  useEffect(() => {
    spotifyApi.setAccessToken(access_token);
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
  
  /*const getURI = (track) => {
    var URI = 'https://open.spotify.com/track/'+(track.uri).substring(track.uri).lastIndexOf(":");
  }
  `https://open.spotify.com/track/${(track.uri).substring((track.uri).lastIndexOf(":") + 1)}`*/

  return (
    <div className="App">
      <div id="Spotify">
        <h1>Spotify Player</h1>
          <div className="floating">
            <img id="Logo-Spotify" className="giro" src={require("./Logo-Spotify.png")}></img>
          </div>
          <div id="buscador-Spotify">
            <input type="text" placeholder="Search for a track" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          <img id="Logo-YouTube" className="giro" src={require("./Logo-YouTube.webp")}></img>
        </div>
      </div>
    </div>  
  );
}

export default App;