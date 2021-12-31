import React from "react";
import { Typography, useTheme } from "@mui/material";
import { Box, Button, Paper } from "@mui/material";

console.log(process.env.REACT_APP_BACKEND_URL);
function Login() {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
      p={10}
    >
      <Box p="5vw">
        <Typography variant="h3" align="center">
          Spotify Playlist Builder by Henry
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-evenly">
        <Box display="flex" flexDirection="column">
          <Box mb="2vh">
            <Paper>
              <Typography variant="h4">About: </Typography>
              <Typography style={{ wordWrap: "break-word" }}>
                This is a spotify track recommendation webapp. You need a
                spotify premium account to use.
              </Typography>
            </Paper>
          </Box>
          <Box mb="2vh">
            <Paper>
              <Typography variant="h4">Features: </Typography>
              <Typography style={{ wordWrap: "break-word" }}>
                song suggestions hyperparameter tuning importing / exporting
                playlists This is a spotify track recommendation webapp. You
                need a spotify premium account to use.
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper>
              <Typography variant="h4">Tech Used: </Typography>
              <Typography style={{ wordWrap: "break-word" }}>
                Frontend: JavaScript, react, material ui, github pages Backend:
                python, sklearn, numpy, flask, heroku
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          href={`${process.env.REACT_APP_BACKEND_URL}/auth/login`}
        >
          Login with Spotify
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
