import React, { useState } from "react";
import { Box } from "@mui/system";
import theme from "./theme";
import { TextField, Typography } from "@mui/material";
import backend from "./backend";
import { debounce } from "lodash";

const debouncedSearch = debounce(backend.search, 200);

const InitialComponent = ({ setRecommendation }) => {
  let [search_string, setSearchString] = useState("");
  const [search_results, setSearchResults] = useState([]);
  const query = async (e) => {
    search_string = e.target.value;
    setSearchString(search_string);
    if (e.target.value === "") {
      setSearchResults([]);
      return;
    }
    await debouncedSearch(search_string, setSearchResults);
  };

  return (
    <Box
      display="flex"
      justifyContent={"center"}
      alignSelf={"center"}
      flexDirection="column"
      bgcolor={theme.palette.tertiary.main}
    >
      <Typography color="primary">Enter two songs you like: </Typography>
      <TextField
        value={search_string}
        onChange={query}
        autoComplete="off"
        autoFocus
      />
      <TextField value={search_string} onChange={query} autoComplete="off" />
      {search_results.map((track_info, i) => (
        <React.Fragment key={i}>
          <Box
            bgcolor={theme.palette.secondary.main}
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            onClick={() =>
              backend
                .update(track_info.id, 1)
                .then((new_recommendation) =>
                  setRecommendation(new_recommendation)
                )
            }
            borderWidth={1}
            borderColor="black"
          >
            <Typography color="primary">{track_info.name}</Typography>
            <Typography color="primary">{track_info.artists}</Typography>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default InitialComponent;
