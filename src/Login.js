import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { Box, Button, Paper } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
console.log(process.env.REACT_APP_BACKEND_URL);
function Login({ loading, setLoading, setUserId }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
      py="8vh"
      px="9vw"
    >
      <Box
        pb="2vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box>
          <Typography variant="h3" align="center">
            Spotify Track Tour
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
          <CircularProgress size="5vw" />
          <Box display="flex" height="4vh" />
          <Typography variant="h5">Logging In</Typography>
          <Typography color="text.secondary">
            Heroku containers may take up to 30 seconds to wake up
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography color="text.secondary">
            Awaiting Spotify public app approval for logging into your own
            account.
          </Typography>
          <Typography color="text.secondary">
            For now please use this demo account to explore
          </Typography>
          <Box alignSelf="center" pt="2vh" pb="5vh">
            <Button
              size="large"
              variant="contained"
              color="primary"
              // href={`${process.env.REACT_APP_BACKEND_URL}/auth/login`}
              onClick={(event) => {
                setLoading(true);
                setUserId("12175261097");
                // window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
              }}
            >
              Login In Using Demo Spotify Account
            </Button>
          </Box>
          <Box alignSelf="end">
            <Box display="flex" justifyContent="space-between">
              <Paper>
                <Box p="2vw">
                  <Typography variant="h5" mb="2vh">
                    Demo:
                  </Typography>
                  <iframe
                    src="https://www.youtube.com/embed/d1e8UxtSVxU"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    title="video"
                    height="300"
                    width="600"
                  />
                </Box>
              </Paper>
              <Box width="30%" display="flex">
                <Paper>
                  <Box p="2vw">
                    <Typography variant="h5" mb="2vh">
                      About:
                    </Typography>
                    <Typography mb="1vh" color="text.secondary">
                      This app takes your preferences and helps you create new
                      playlists with a custom machine learning model.
                    </Typography>
                    <Typography mb="1vh" color="text.secondary">
                      The goal is to introduce you to new, diverse, songs in an
                      interactive way
                    </Typography>
                    <Typography mb="1vh" color="text.secondary">
                      Unlike traditional recommendation algorithms which relies
                      heavily on collaborative filtering, this algorithm is
                      purely content based and all the models parameters are
                      displayed.
                    </Typography>
                    <Typography mb="1vh" color="text.secondary">
                      You will need a spotify premium account to use.{" "}
                    </Typography>
                    <Typography mb="1vh" color="text.secondary">
                      For better performance clone the repo and run this app
                      locally
                    </Typography>
                  </Box>
                </Paper>
              </Box>
              <Box display="flex" flexDirection="column">
                <Box flexGrow={1}>
                  <Paper>
                    <Box p="2vw">
                      <Typography variant="h5" mb="2vh">
                        Features:{" "}
                      </Typography>
                      <Typography color="text.secondary">
                        • Spotify integration
                      </Typography>
                      <Typography color="text.secondary">
                        • Song recommendation / playback
                      </Typography>
                      <Typography color="text.secondary">
                        • model weight / parameter inspection
                      </Typography>
                      <Typography color="text.secondary">
                        • hyperparameter tuning
                      </Typography>
                      <Typography color="text.secondary">
                        • importing playlists
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
                <Box flexGrow={1} mt="3vh">
                  <Paper>
                    <Box p="2vw">
                      <Typography variant="h5" mb="2vh">
                        Tech Stack:
                      </Typography>
                      <Typography color="text.secondary">
                        Frontend: JavaScript, react, material ui github pages
                      </Typography>
                      <Typography color="text.secondary">
                        Backend: python, flask, heroku, google firestore
                      </Typography>
                      <Typography color="text.secondary">
                        Tools: sklearn, numpy, pandas, spotify api
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Login;
