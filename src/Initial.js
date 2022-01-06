import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import server from "./server";
import spotifyApi from "./spotify";
import { debounce } from "lodash";
import { Playlists } from "./Components";

const debouncedSearch = debounce(server.search, 500);

const SearchBox = ({ label, onClick }) => {
  let [search_string, setSearchString] = useState("");
  const [search_results, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(true);
  const query = async (search_string) => {
    console.log(search_string);
    setSearchString(search_string);
    setSearchResults([]);
    if (search_string === "") {
      setValue(null);
      return;
    }
    setLoading(true);
    await debouncedSearch(search_string, (res) => {
      console.log(res);
      setSearchResults(res);
      setLoading(false);
    });
  };
  return (
    <Autocomplete
      value={value}
      onChange={(a, b) => {
        console.log("changes");
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={search_results}
      inputValue={search_string}
      open={search_string.length > 0 && open}
      onInputChange={(e, v) => {
        query(v);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loading={loading}
      loadingText="Loading..."
      noOptionsText="Track Not Found"
      filterOptions={(x) => x}
      autoComplete
      fullWidth
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderOption={(props, option) => {
        return (
          <Button
            key={option.id}
            fullWidth
            variant="text"
            onClick={() => {
              setValue(option);
              onClick(option);
              setOpen(false);
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="start"
              flexGrow={1}
            >
              <Typography color="text.primary" textAlign="left">
                {option.name}
              </Typography>
              <Typography color="text.secondary" textAlign="left">
                {option.artists.replace(/[[\]']/g, "")}
              </Typography>
            </Box>
          </Button>
        );
      }}
    />
  );
};

const BackButton = ({ onClick }) => {
  return (
    <Box py="1vh">
      <Button fullWidth variant="contained" onClick={onClick}>
        <ArrowBackIcon />
      </Button>
    </Box>
  );
};

const InitialComponent = ({ setRecommendation, userId }) => {
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [choice, setChoice] = useState(null);

  const uploadSelectedPlaylist = async () => {
    const data = await spotifyApi.getPlaylist(selectedPlaylist.id);
    const ids = data.tracks.items.map((item) => item.track.id);
    await server.update(userId, "", "", ids);
  };

  const uploadTracks = async () => {
    const promises = [];
    tracks.forEach((track) => {
      track?.option &&
        promises.push(server.update(userId, track.option.id, track.feedback));
    });
    await Promise.all(promises);
  };

  console.log(tracks);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
    >
      <Box p="5vw">
        <Typography variant="h3" align="center">
          {`Welcome! `}
        </Typography>
        <Typography variant="h4" align="center" color="secondary.light">
          feed me some data to start
        </Typography>
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
          <Typography variant="h5">Creating Model</Typography>
          <Typography color="text.secondary"></Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <Box
            width="100vw"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {choice === "manual" && (
              <Paper>
                <Box
                  display="flex"
                  flexDirection="column"
                  pt="4vh"
                  pb="1vh"
                  px="2vw"
                >
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h5">
                      Search For Two Tracks You Like
                    </Typography>
                    <Box mt="2vh">
                      <SearchBox
                        label="track 1"
                        onClick={(option) => {
                          tracks[0] = { option: option, feedback: 1 };
                          setTracks([...tracks]);
                        }}
                      />
                    </Box>
                    <Box my="2vh">
                      <SearchBox
                        label="track 2"
                        onClick={(option) => {
                          tracks[1] = { option, feedback: 1 };
                          setTracks([...tracks]);
                        }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h5">
                      And One Track You Don't Like
                    </Typography>
                    <Box my="2vh">
                      <SearchBox
                        label="track 1"
                        onClick={(option) => {
                          tracks[2] = { option, feedback: -1 };
                          setTracks([...tracks]);
                        }}
                      />
                    </Box>
                  </Box>
                  <BackButton
                    onClick={() => {
                      setChoice(null);
                      setErrorText("");
                      setTracks([]);
                      setSelectedPlaylist(null);
                    }}
                  />
                </Box>
              </Paper>
            )}

            {choice === "import" && (
              <Box width="30vw">
                <Playlists
                  userId={userId}
                  selectedPlaylist={selectedPlaylist}
                  setSelectedPlaylist={setSelectedPlaylist}
                />
                <Paper>
                  <Box pb="1vh" px="2vw">
                    <Typography variant="h5">
                      And One Track You Don't Like
                    </Typography>
                    <Box my="2vh">
                      <SearchBox
                        label="track 1"
                        onClick={(option) => {
                          tracks[0] = { option, feedback: -1 };
                          setTracks([...tracks]);
                        }}
                      />
                    </Box>
                    <BackButton
                      onClick={() => {
                        setChoice(null);
                        setErrorText("");
                        setTracks([]);
                        setSelectedPlaylist(null);
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}

            {!choice && (
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setChoice("manual");
                    setErrorText("");
                  }}
                >
                  Manual Search And Add
                </Button>
                <Box m="2vw">
                  <Typography variant="h4">or</Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setChoice("import");
                    setErrorText("");
                  }}
                >
                  Import a Playlist From Spotify
                </Button>
              </Box>
            )}

            <Box m="2vw">
              <ArrowForwardIcon size="large" />
            </Box>
            <Box alignSelf="center">
              <Button
                variant="contained"
                size="large"
                onClick={async () => {
                  if (!choice) {
                    setErrorText("Select a choice first");
                    return;
                  }
                  if (choice === "manual") {
                    if (tracks.length !== 3) {
                      setErrorText("Click me after adding all 3 tracks");
                      return;
                    }
                    setLoading(true);
                    await uploadTracks();
                  }
                  if (choice === "import") {
                    if (!selectedPlaylist || tracks.length !== 1) {
                      setErrorText(
                        "Click me after a playlist and a track you dislike are set"
                      );
                      return;
                    }
                    setLoading(true);
                    await uploadSelectedPlaylist();
                  }

                  const new_recommendation_data = await server.recommend(
                    userId
                  );
                  const new_recommendation =
                    new_recommendation_data["recommendation"];
                  new_recommendation.weights = new_recommendation_data.weights;
                  setRecommendation(new_recommendation);
                  setLoading(false);
                }}
              >
                {errorText || `Let's Go`}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InitialComponent;
