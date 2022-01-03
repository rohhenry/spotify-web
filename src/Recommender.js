import {
  Switch,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import theme from "./theme";
import InitialComponent from "./Initial";
import backend from "./server";
import { Addlist } from "./Components";

function Recommender({ token, setToken, userId }) {
  const [recommendation, setRecommendation] = useState(null);
  const [addlist, setAddlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({ score: "-", mae: "-" });
  const updateAndRecommend = async (feedback) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (feedback == 1) {
      setAddlist([...addlist, recommendation]);
    }
    await backend.update(userId, recommendation.id, feedback);
    const new_recommendation_data = await backend.recommend(userId);
    const new_metrics = {};
    new_metrics.score = new_recommendation_data.score;
    new_metrics.mae = new_recommendation_data.mae;
    const new_recommendation = new_recommendation_data["recommendation"];
    setRecommendation(new_recommendation);
    setMetrics(new_metrics);
    setIsLoading(false);
  };
  return recommendation ? (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
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
          {isLoading ? (
            <CircularProgress />
          ) : (
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
                onClick={() => updateAndRecommend(1)}
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
                onClick={() => updateAndRecommend(-1)}
              >
                <Typography variant="h3">Skip</Typography>
              </Button>
            </Box>
          )}

          <Box
            height="20%"
            width="100%"
            display="flex"
            bgcolor="secondary.main"
          >
            <Box flexGrow={1} m="1vh">
              <Typography variant="h5">Metrics</Typography>
              <Typography>score: {metrics.score}</Typography>
              <Typography>mae: {metrics.mae}</Typography>
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
        <Addlist tracks={addlist} />
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
              await updateAndRecommend(1);
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
    <InitialComponent
      setAddlist={setAddlist}
      setRecommendation={setRecommendation}
      userId={userId}
    />
  );
}

export default Recommender;
