import {
  Switch,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import theme from "./theme";
import InitialComponent from "./Initial";
import backend from "./server";
import { Addlist, Heatmap } from "./Components";

function Recommender({ token, setToken, userId }) {
  const [recommendation, setRecommendation] = useState(null);
  const [addlist, setAddlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({ score: "-", mae: "-", n: "-" });
  const updateAndRecommend = async (feedback) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (feedback === 1) {
      setAddlist([...addlist, recommendation]);
    }
    await backend.update(userId, recommendation.id, feedback);
    const new_recommendation_data = await backend.recommend(userId);
    const new_metrics = new_recommendation_data["metrics"];
    const new_recommendation = new_recommendation_data["recommendation"];
    new_recommendation.weights = new_recommendation_data.weights;
    setRecommendation({ ...new_recommendation });
    setMetrics(new_metrics);
    setIsLoading(false);
  };
  return recommendation ? (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="space-between"
      bgcolor="secondary.dark"
    >
      <Box flex display="flex" alignItems="stretch" flexGrow={1}>
        <Box
          width="20%"
          display="flex"
          flexDirection="column"
          bgcolor="background.default"
          pt="4vh"
          px="2vw"
        >
          <Box flexGrow={1}>
            <Box mb="2vh">
              <Typography variant="h4">Metrics</Typography>
            </Box>
            <Box my="2vh">
              <Typography>n: {metrics.n}</Typography>
            </Box>
            <Box my="2vh">
              <Typography>score: {metrics.score}</Typography>
            </Box>
            <Box my="2vh">
              <Typography>mae: {metrics.mae}</Typography>
            </Box>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Box mb="2vh">
              <Typography variant="h4">
                Controls (under developement)
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" flexGrow="1">
              <Box display="flex" alignItems="center" my="2vh">
                <Typography variant="p">Sampling Method: Thompson</Typography>
              </Box>
              <Box display="flex" alignItems="center" my="2vh">
                <Typography variant="p">Popularity Heuristic</Typography>
                <Switch color="primary" />
              </Box>
              <Box display="flex" alignItems="center" my="2vh">
                <Typography variant="p">Regularization (L2)</Typography>
                <Switch color="primary" />
              </Box>
            </Box>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Box mb="2vh">
              <Typography variant="h4">Info</Typography>
            </Box>
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                my="2vh"
              >
                <Typography variant="body2">
                  This model uses feature transformation and ridge regression to
                  predict the outcome of a song. It then uses the chosen
                  sampling strategy to optimally pick from the predictions.
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" my="2vh">
                <Typography variant="body2">
                  If you wish to completely delete your data from the server you
                  can click below.
                </Typography>
              </Box>
              <Box flexGrow="1" justifySelf="end">
                <Button fullWidth variant="outlined">
                  Delete Data (Under Developement)
                </Button>
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
            <CircularProgress size="5vw" />
            <Box display="flex" height="4vh" />
            <Typography variant="h5">Crunching Numbers</Typography>
            <Typography color="text.secondary">beep boop</Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box pt="8vh">
              <Typography variant="h2" color="text.primary">
                {recommendation.name}
              </Typography>
              <Typography variant="h4" color="text.secondary" align="center">
                {recommendation.artists.replace(/[[\]']/g, "")}
              </Typography>
            </Box>
            <Heatmap weights={recommendation.weights} />

            <Box display="flex" my="2vh" width="100%" px="2vw">
              <Box width="50%">
                <Button
                  variant="contained"
                  fullWidth
                  mr="1vw"
                  border={1}
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"center"}
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
      <Box height="5vh" bgcolor="secondary.main">
        <SpotifyPlayer
          key={recommendation.id + token}
          token={token}
          uris={["spotify:track:" + recommendation.id]}
          autoPlay={true}
          styles={{
            activeColor: "#000",
            bgColor: theme.palette.secondary.main,
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#fff",
            sliderHandleColor: "fff",
            sliderTrackColor: theme.palette.secondary.light,
            sliderHeight: "1vh",
            height: "3vh",
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
