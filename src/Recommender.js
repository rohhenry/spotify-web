import { Switch, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import SpotifyPlayer from "react-spotify-web-playback";
import theme from "./theme";
import InitialComponent from "./Initial";
import backend from "./backend";

function Recommender({ token, setToken, userId }) {
  const [recommendation, setRecommendation] = useState(null);

  return recommendation ? (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={theme.palette.secondary.main}
      height="85vh"
      pt="10vh"
      pb="5vh"
      px="10vw"
      justifyContent="space-between"
    >
      <Box
        flex
        display="flex"
        justifyContent={"space-between"}
        alignItems="stretch"
        height="100%"
        mb="5vh"
      >
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          alignItems="center"
          justifyContent="space-between"
          mr="5vw"
        >
          <Box p="2vw">
            <Typography variant="h3" color="primary">
              Custom ML
            </Typography>
          </Box>
          <Box display="flex">
            <Box
              width="20vw"
              height="20vh"
              p="5vh"
              mr="1vw"
              borderRadius={10}
              border={1}
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
              flex={1}
              onClick={() =>
                backend
                  .update(recommendation.id, 1)
                  .then((new_recommendation) =>
                    setRecommendation(new_recommendation)
                  )
              }
              bgcolor={theme.palette.tertiary.main}
              sx={{
                "&:hover": { backgroundColor: theme.palette.tertiary.light },
              }}
            >
              <Typography color="primary" variant="h3">
                Add
              </Typography>
            </Box>
            <Box
              width="20vw"
              height="20vh"
              ml="1vw"
              p="5vh"
              borderRadius={10}
              border={1}
              borderColor="primary.main"
              display="flex"
              flex={1}
              alignItems={"center"}
              justifyContent={"center"}
              onClick={() =>
                backend
                  .update(recommendation.id, -1)
                  .then((new_recommendation) =>
                    setRecommendation(new_recommendation)
                  )
              }
              bgcolor={theme.palette.secondary.main}
              sx={{
                "&:hover": { backgroundColor: theme.palette.secondary.light },
              }}
            >
              <Typography color="primary" variant="h3">
                Skip
              </Typography>
            </Box>
          </Box>
          <Box
            height="20%"
            width="100%"
            display="flex"
            border={1}
            borderColor="primary.main"
          >
            <Box flexGrow={1} m="1vh">
              <Typography variant="h5" color={theme.palette.primary.main}>
                Metrics
              </Typography>
            </Box>
            <Box borderRight={1} borderColor="primary.main"></Box>
            <Box
              flexGrow={4}
              m="1vh"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography variant="h5" color={theme.palette.primary.main}>
                Controls
              </Typography>
              <Box display="flex">
                <Box display="flex" flexDirection="column">
                  <Switch color="tertiary" />
                  <Typography variant="p" color={theme.palette.primary.main}>
                    Popularity Heuristic
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          bgcolor={theme.palette.secondary.main}
          border={1}
          borderColor="primary.main"
          width="25%"
          display="flex"
          flexDirection="column"
          p={2}
        >
          <Box
            alignSelf="center"
            display="flex"
            flexDirection="column"
            flexGrow="1"
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="column" flexGrow="1">
              <Typography color="primary" variant="h5" align="center">
                Saved Tracks
              </Typography>
            </Box>
            <Box></Box>
            <Box
              alignSelf="center"
              width="8vw"
              height="1vh"
              p="2vh"
              borderRadius={4}
              border={1}
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
              bgcolor={theme.palette.tertiary.main}
              sx={{
                "&:hover": { backgroundColor: theme.palette.tertiary.light },
              }}
            >
              <Typography color="primary" variant="h5" align="center">
                Export
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box border={1} borderColor="primary.main">
        <SpotifyPlayer
          key={recommendation.id}
          token={token}
          uris={["spotify:track:" + recommendation.id]}
          autoPlay={true}
          styles={{
            activeColor: "#000",
            bgColor: "#000",
            color: "#fff",
            loaderColor: "#000",
            sliderColor: "#fff",
            sliderHandleColor: "fff",
            sliderTrackColor: theme.palette.secondary.light,
            sliderHeight: "1vh",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
            errorColor: "#fff",
          }}
          callback={async (s) => {
            console.log(s);
            if (
              s.progressMs === 0 &&
              s.type === "player_update" &&
              s.isPlaying === false
            ) {
              backend
                .update(recommendation.id, 1)
                .then((new_recommendation) =>
                  setRecommendation(new_recommendation)
                );
            } else if (
              s.status === "ERROR" &&
              s.errorType === "authentication_error"
            ) {
              console.log("fetching refresh");
              setToken(await backend.refreshToken(userId));
            }
          }}
        />
      </Box>
    </Box>
  ) : (
    <InitialComponent setRecommendation={setRecommendation} />
  );
}

export default Recommender;
