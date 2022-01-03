import React, { useState, useEffect } from "react";
import spotifyApi from "../spotify";
import { Box, Paper, Button, TextField, Typography } from "@mui/material";
import server from "../server";

const Playlists = ({ userId }) => {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    spotifyApi.getUserPlaylists(userId).then((data) => {
      console.log(data);
      setPlaylists(data.items || []);
    });
  }, [userId]);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={async () => {
          console.log(playlists);
        }}
      >
        Import A Playlist (NOT AVAILABLE YET)
      </Button>
      <Paper>
        {playlists.map((playlist) => (
          <Box key={playlist.id}>
            <Button
              onClick={async () => {
                const data = await spotifyApi.getPlaylist(playlist.id);
                const ids = data.tracks.items.map((item) => item.track.id);
                server.update(userId, "", "", ids);
              }}
            >
              {playlist.name}
            </Button>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};
export default Playlists;
