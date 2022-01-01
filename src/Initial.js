import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import backend from "./backend";
import { debounce } from "lodash";

const debouncedSearch = debounce(backend.search, 1000);

const SearchBox = ({ label, onClick }) => {
  let [search_string, setSearchString] = useState("");
  const [search_results, setSearchResults] = useState([]);
  const [value, setValue] = useState(null);
  const query = async (search_string) => {
    console.log(search_string);
    setSearchString(search_string);
    if (search_string === "") {
      setSearchResults([]);
      return;
    }
    await debouncedSearch(search_string, (res) => {
      console.log(res);
      setSearchResults(res);
    });
  };
  return (
    <Autocomplete
      value={value}
      onChange={(a, b) => {
        console.log("wieo");
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={search_results}
      inputValue={search_string}
      onInputChange={(e, v) => {
        query(v);
      }}
      getOptionLabel={(option) => option.name}
      noOptionsText="Track Not Found"
      filterOptions={(x) => x}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderOption={(props, option) => {
        return (
          <Box>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setValue(option);
                onClick(option);
              }}
            >
              <Box flexDirection="column">
                <Typography>{option.name}</Typography>
                <Typography>{option.artists}</Typography>
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
      alignContent="center"
      width="100vw"
      height="100vh"
    >
      <Box display="flex" alignContent="center" justifyContent={"center"}>
        <Box display="flex" flexDirection="column">
          <Paper>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4">Enter Two Tracks you like: </Typography>
              <SearchBox
                label="track 1"
                onClick={(option) => {
                  tracks[0] = { option, feedback: 1 };
                  setTracks([...tracks]);
                }}
              />
              <SearchBox
                label="track 2"
                onClick={(option) => {
                  tracks[1] = { option, feedback: 1 };
                  setTracks([...tracks]);
                }}
              />
            </Box>
            <Box>
              <Typography variant="h4">And One Track You Dont:</Typography>
              <SearchBox
                label="track 1"
                onClick={(option) => {
                  tracks[2] = { option, feedback: -1 };
                  setTracks([...tracks]);
                }}
              />
            </Box>
          </Paper>
        </Box>
        <Box>
          <Typography variant="h3">Or</Typography>
        </Box>
        <Box>
          <Button variant="contained">
            Import A Playlist (NOT AVAILABLE YET)
          </Button>
        </Box>
      </Box>
      <Box alignSelf="center">
        <Button
          variant="contained"
          onClick={async () => {
            if (!tracks.every((v) => v)) {
              console.log("NEED TO INPUT ALL TRACKS");
            }
            const promises = [];
            tracks.map((track) => {
              promises.push(
                backend.update(userId, track.option.id, track.feedback)
              );
            });
            await Promise.all(promises);

            const recommendation = await backend.recommend(userId);
            setRecommendation(recommendation);
          }}
        >
          Start
        </Button>
      </Box>
    </Box>
  );
};

export default InitialComponent;
