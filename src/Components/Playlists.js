import React, { useState, useEffect } from "react";
import spotifyApi from "../spotify";
import {
  Box,
  Paper,
  Button,
  TextField,
  ToggleButton,
  Typography,
  ToggleButtonGroup,
} from "@mui/material";

const Playlists = ({ userId, selectedPlaylist, setSelectedPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    spotifyApi.getUserPlaylists(userId).then((data) => {
      console.log(data);
      setPlaylists(data.items || []);
    });
  }, [userId]);

  return (
    <Paper>
      <Box p="2vw" flexGrow={1}>
        <Box mb="2vh">
          <Typography variant="h5">Select One Of Your Playlists</Typography>
        </Box>
        <ToggleButtonGroup
          fullWidth
          orientation="vertical"
          value={selectedPlaylist}
          exclusive
          onChange={(e, v) => {
            console.log("hi");
            setSelectedPlaylist(v);
          }}
        >
          {playlists.map((playlist) => (
            <ToggleButton
              key={playlist.id}
              fullWidth
              onClick={() => {}}
              value={playlist}
              color="primary"
            >
              <Box display="flex" flexGrow={1}>
                <Typography
                  color={
                    selectedPlaylist?.id === playlist.id
                      ? "primary"
                      : "text.secondary"
                  }
                  textAlign="left"
                >
                  {playlist.name}
                </Typography>
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
};
export default Playlists;
