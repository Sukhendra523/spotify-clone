import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Login from "./Login";
import { getTokenFromResponse } from "./spotify";
import spotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";
import Player from "./Player";

function App() {
  const [{ user, token }, dispatch] = useDataLayerValue();
  const spotify = new spotifyWebApi();
  useEffect(() => {
    const hash = getTokenFromResponse();
    window.location.hash = "";
    const _token = hash.access_token;
    if (_token) {
      spotify.setAccessToken(_token);

      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      spotify.getPlaylist("37i9dQZEVXcJZyENOWUFo7").then((response) =>
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
      );

      spotify.getMyTopArtists().then((response) =>
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: response,
        })
      );

      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify,
      });

      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user: user,
        });
      });

      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });
      });
    }
  }, []);
  return (
    <div className="app">
      {token ? <Player spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
