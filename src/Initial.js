import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import backend from "./server";
import { debounce } from "lodash";
import { Playlists } from "./Components";

const debouncedSearch = debounce(backend.search, 500);

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
          <Box key={option.id} width="100%">
            <Button
              variant="text"
              onClick={() => {
                setValue(option);
                onClick(option);
                setOpen(false);
              }}
            >
              <Box flexDirection="column">
                <Typography color="text.primary" textAlign="left">
                  {option.name}
                </Typography>
                <Typography color="text.secondary" textAlign="left">
                  {option.artists.replace(/[\[\]']/g, "")}
                </Typography>
              </Box>
            </Button>
          </Box>
        );
      }}
    />
  );
};

const InitialComponent = ({ setRecommendation, userId }) => {
  const [tracks, setTracks] = useState([]);

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
          Feed Me Some Data First
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
              <Typography variant="h5">Enter Two Tracks you like: </Typography>
              <Box mt="2vh">
                <SearchBox
                  label="track 1"
                  onClick={(option) => {
                    tracks[0] = { option, feedback: 1 };
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
              <Typography variant="h5">And One Track You Dont:</Typography>
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
          <Typography variant="h3">Or</Typography>
        </Box>
        <Playlists userId={userId} />
      </Box>
      <Box alignSelf="center">
        <Button
          variant="contained"
          onClick={async () => {
            if (!tracks.every((v) => v)) {
              console.log("NEED TO INPUT ALL TRACKS");
              const recommendation = await backend.recommend(userId);
              setRecommendation(recommendation);
            }
            const promises = [];
            tracks.forEach((track) => {
              promises.push(
                backend.update(userId, track.option.id, track.feedback)
              );
            });
            await Promise.all(promises);

            const new_recommendation_data = await backend.recommend(userId);
            const new_recommendation =
              new_recommendation_data["recommendation"];
            setRecommendation(new_recommendation);
          }}
        >
          Let's Go
        </Button>
      </Box>
    </Box>
  );
};

export default InitialComponent;
