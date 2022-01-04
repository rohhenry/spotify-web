import React from "react";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import { Box, Button, Paper } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
console.log(process.env.REACT_APP_BACKEND_URL);
function Login({ loading, setLoading }) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
      p={10}
    >
      <Box
        pb="5vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box>
          <Typography variant="h3" align="center">
            Spotify Track Recommender
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
        >
          <Box>
            <Typography variant="h5" align="center">
              by Henry Roh
            </Typography>
          </Box>
          <Button
            onClick={(event) =>
              (window.location.href = "https://www.linkedin.com/in/henry-roh")
            }
          >
            <LinkedInIcon />
          </Button>
          <Button
            onClick={(event) =>
              (window.location.href = "https://github.com/rohhenry")
            }
          >
            <GitHubIcon />
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <CircularProgress size="5vw" justifySelf="center" />
          <Box display="flex" height="4vh" />
          <Typography variant="h5">Logging In</Typography>
          <Typography color="text.secondary">
            Heroku containers may take up to 10 seconds to wake up
          </Typography>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-evenly">
          <Box display="flex" flexDirection="column">
            <Box mb="2vh">
              <Paper>
                <Typography variant="h4">Demo: </Typography>

                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                  title="video"
                  height="300"
                  width="1200"
                />
              </Paper>
            </Box>

            <Box mb="2vh">
              <Paper>
                <Typography variant="h4">About: </Typography>
                <Typography paragraph>
                  {`
                This app takes your preferences and helps you create new playlists with machine learning. 
                The goal is to introduce you to new, diverse, songs. Unlike traditional
                recommendation algorithms which relies heavily on collaborative
                filtering, this algorithm is purely content based. You will need
                a spotify premium account to use.

                You can erase your data at anytime
                
                For better performance clone the repo and run this app locally`}
                </Typography>
              </Paper>
            </Box>
            <Box mb="2vh">
              <Paper>
                <Typography variant="h4">Features: </Typography>
                <Typography style={{ wordWrap: "break-word" }}>
                  song suggestions hyperparameter tuning importing / exporting
                  playlists This is a spotify track recommendation webapp.
                </Typography>
              </Paper>
            </Box>
            <Box mb="2vh">
              <Paper>
                <Typography variant="h4">Tech Stack: </Typography>
                <Typography style={{ wordWrap: "break-word" }}>
                  Frontend: JavaScript, react, material ui github pages Backend:
                  python, flask, heroku, google firestore Tools: sklearn, numpy,
                  pandas, spotify api
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Paper>
                <Typography variant="h4">
                  Features Under Developement{" "}
                </Typography>
                <Typography style={{ wordWrap: "break-word" }}>
                  importing tracks, exporting tracks, server optimizations, more
                  hyperparameter controls, allow non-spotify users to use
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            // href={`${process.env.REACT_APP_BACKEND_URL}/auth/login`}
            onClick={(event) => {
              setLoading(true);
              window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
            }}
          >
            Login with Spotify
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Login;
