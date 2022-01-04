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
      loadingText="Loading... (heroku is slow)"
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
                {option.artists.replace(/[\[\]']/g, "")}
              </Typography>
            </Box>
          </Button>
        );
      }}
    />
  );
};

const InitialComponent = ({ setRecommendation, userId }) => {
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadSelectedPlaylist = async () => {
    const data = await spotifyApi.getPlaylist(selectedPlaylist.id);
    const ids = data.tracks.items.map((item) => item.track.id);
    await server.update(userId, "", "", ids);
  };

  const uploadTracks = async () => {
    const promises = [];
    tracks.forEach((track) => {
      track.option &&
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
      <Box
        width="80vw"
        display="flex"
        alignItems="center"
        justifyContent="space-around"
      >
        <Paper>
          <Box display="flex" flexDirection="column" p="2vw" width="30vw">
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
              <Typography variant="h5">And One Track You Don't</Typography>
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
          </Box>
        </Paper>

        <Box m="10vw">
          <Typography variant="h3">or</Typography>
        </Box>
        <Box width="30vw">
          <Playlists
            userId={userId}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
          />
        </Box>
      </Box>
      <Box alignSelf="center">
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              if (
                !selectedPlaylist &&
                (tracks.some((v) => !v) || tracks.length !== 3)
              ) {
                console.log("NEED TO INPUT ALL TRACKS OR USE PLAYLIST");
                return;
              }

              setLoading(true);

              await uploadTracks();
              selectedPlaylist && (await uploadSelectedPlaylist());

              const new_recommendation_data = await server.recommend(userId);
              const new_recommendation =
                new_recommendation_data["recommendation"];
              new_recommendation.weights = new_recommendation_data.weights;
              setRecommendation(new_recommendation);
              setLoading(false);
            }}
          >
            {`Let's Go`}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InitialComponent;
