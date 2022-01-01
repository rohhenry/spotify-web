import { Switch, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import SpotifyPlayer from "react-spotify-web-playback";
import theme from "./theme";
import InitialComponent from "./Initial";
import backend from "./backend";

function Recommender({ token, setToken, userId }) {
  const [recommendation, setRecommendation] = useState(null);

  const updateAndRecommend = async (feedback) => {
    await backend.update(userId, recommendation.id, feedback);
    const new_recommendation = backend.recommend(userId);
  };
  return recommendation ? (
    <Box
      display="flex"
      flexDirection="column"
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
            <Typography variant="h3">Custom ML</Typography>
          </Box>
          <Box display="flex">
            <Button
              variant="contained"
              fullWidth
              p="5vh"
              mr="1vw"
              border={1}
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
              flex={1}
              onClick={() =>
                backend
                  .update(userId, recommendation.id, 1)
                  .then((new_recommendation) =>
                    setRecommendation(new_recommendation)
                  )
              }
            >
              <Typography variant="h3">Add</Typography>
            </Button>
            <Button
              variant="outlined"
              fullWidth
              ml="1vw"
              p="5vh"
              bgcolor="secondary.main"
              display="flex"
              flex={1}
              alignItems={"center"}
              justifyContent={"center"}
              onClick={() =>
                backend
                  .update(userId, recommendation.id, -1)
                  .then((new_recommendation) =>
                    setRecommendation(new_recommendation)
                  )
              }
            >
              <Typography variant="h3">Skip</Typography>
            </Button>
          </Box>
          <Box
            height="20%"
            width="100%"
            display="flex"
            bgcolor="secondary.main"
          >
            <Box flexGrow={1} m="1vh">
              <Typography variant="h5">Metrics</Typography>
            </Box>
            <Box borderRight={1}></Box>
            <Box
              flexGrow={4}
              m="1vh"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography variant="h5">Controls</Typography>
              <Box display="flex">
                <Box display="flex" flexDirection="column">
                  <Switch color="primary" />
                  <Typography variant="p">Popularity Heuristic</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          bgcolor="secondary.main"
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
                Added Tracks
              </Typography>
            </Box>
            <Box></Box>
            <Button
              alignSelf="center"
              width="8vw"
              height="1vh"
              p="2vh"
              borderRadius={4}
              border={1}
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
              variant="contained"
            >
              Export
            </Button>
          </Box>
        </Box>
      </Box>
      <Box height="10vh">
        <SpotifyPlayer
          key={recommendation.id}
          token={token}
          uris={["spotify:track:" + recommendation.id]}
          autoPlay={true}
          styles={{
            activeColor: "#000",
            bgColor: theme.palette.secondary.main,
            color: "#fff",
            loaderColor: "#000",
            sliderColor: "#fff",
            sliderHandleColor: "fff",
            sliderTrackColor: theme.palette.secondary.light,
            sliderHeight: "1vh",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
            errorColor: "#f00",
          }}
          callback={async (s) => {
            console.log(s);
            if (
              s.progressMs === 0 &&
              s.type === "player_update" &&
              s.isPlaying === false
            ) {
              backend
                .update(userId, recommendation.id, 1)
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
    <InitialComponent setRecommendation={setRecommendation} userId={userId} />
  );
}

export default Recommender;
