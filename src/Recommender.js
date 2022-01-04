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
import { Addlist, Heatmap } from "./Components";

function Recommender({ token, setToken, userId }) {
  const [recommendation, setRecommendation] = useState(null);
  const [addlist, setAddlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [play, setPlay] = useState(true);
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
    new_recommendation.weights = new_recommendation_data.weights;
    setRecommendation({ ...new_recommendation });
    setMetrics(new_metrics);
    setIsLoading(false);
    setPlay(true);
  };
  return recommendation ? (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="space-between"
      bgcolor="secondary.dark"
    >
      <Box flex display="flex" alignItems="stretch" height="100%">
        <Box
          width="20%"
          display="flex"
          flexDirection="column"
          bgcolor="background.default"
          p="5vh"
        >
          <Box flexGrow={1} m="1vh">
            <Typography variant="h5">Metrics</Typography>
            <Typography>score: {metrics.score}</Typography>
            <Typography>mae: {metrics.mae}</Typography>
          </Box>
          <Box borderRight={1}></Box>
          <Box
            flexGrow={4}
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

        {isLoading ? (
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
            <Typography variant="h5">Crunching Numbers</Typography>
            <Typography color="text.secondary">Heroku is slow</Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            alignItems="center"
            justifyContent="space-between"
            height="100%"
          >
            <Box pt="4vw">
              <Typography variant="h2" color="text.primary">
                {recommendation.name}
              </Typography>
              <Typography variant="h4" color="text.secondary" align="center">
                {recommendation.artists.replace(/[\[\]']/g, "")}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <Heatmap weights={recommendation.weights} />
              <Typography variant="h6" align="center" color="text.secondary">
                Model Parameters
              </Typography>
            </Box>
            <Box display="flex" my="2vh" width="100%">
              <Box width="50%">
                <Button
                  variant="contained"
                  fullWidth
                  mr="1vw"
                  border={1}
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexGrow={1}
                  onClick={() => updateAndRecommend(1)}
                >
                  <Typography variant="h3">Add</Typography>
                </Button>
              </Box>
              <Box width="50%">
                <Button
                  variant="contained"
                  fullWidth
                  ml="1vw"
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"center"}
                  color="secondary"
                  onClick={() => updateAndRecommend(-1)}
                >
                  <Typography color="text.primary" variant="h3">
                    Skip
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        <Addlist tracks={addlist} />
      </Box>
      <Box>
        <SpotifyPlayer
          key={recommendation.id}
          token={token}
          uris={["spotify:track:" + recommendation.id]}
          autoPlay={true}
          play={play}
          styles={{
            activeColor: "#000",
            bgColor: theme.palette.secondary.main,
            color: "#fff",
            loaderColor: "#fff",
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
      token={token}
      setRecommendation={setRecommendation}
      userId={userId}
    />
  );
}

export default Recommender;
