import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { max, min } from "lodash";

const lookup = [
  [-8, 0, 1, 2, 3, 4],
  [0, -8, 5, 6, 7, 8],
  [1, 5, -8, 9, 10, 11],
  [2, 6, 5, -8, 12, 13],
  [3, 7, 10, 12, -8, 14],
  [4, 8, 11, 13, 14, -8],
];

const feature_names = [
  "1",
  "danceability",
  "energy",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "valence",
  "danceability x energy",
  "danceability x speechiness",
  "danceability x acousticness",
  "danceability x instrumentalness",
  "danceability x valence",
  "energy x speechiness",
  "energy x acousticness",
  "energy x instrumentalness",
  "energy x valence",
  "speechiness x acousticness",
  "speechiness x instrumentalness",
  "speechiness x valence",
  "acousticness x instrumentalness",
  "acousticness x valence",
  "instrumentalness x valence",
  "n/a",
];

const Square = ({ name = "", heat, scalingFunction, space, setText }) => {
  const [hover, setHover] = useState(false);
  const size = 2.5;
  return (
    <div
      style={{
        borderRadius: `20%`,
        borderStyle: hover ? "solid" : "none",
        borderColor: `rgba(0,0,0,1)`,
        borderWidth: "0.3rem",
        marginBottom: `${space}rem`,
        marginTop: `${space}rem`,
        height: `${size}vw`,
        width: `${size}vw`,
        backgroundColor: heat
          ? `rgba(30, 215, 96, ${scalingFunction(heat)})`
          : "#212121",
      }}
      onMouseEnter={() => {
        heat && setHover(true);
        setText(name + " " + (heat ? heat.toFixed(2) : ""));
      }}
      onMouseLeave={() => {
        setHover(false);
        setText("");
      }}
    />
  );
};

const Heatmap = ({ weights }) => {
  const width = 6;
  const height = 6;
  const space = 1;
  const heat = weights;
  const scalingFunction = (v) => {
    return (v + -1 * min(heat)) / (-1 * min(heat) + max(heat));
  };
  const [text, setText] = useState("Hover a square to for more info");
  const posToHeat = (x, y) => {
    const offset = lookup[y][x];
    if (offset === -8) {
      return undefined;
    }
    return weights[7 + lookup[y][x]];
  };
  const posToName = (x, y) => {
    return feature_names[7 + lookup[y][x]];
  };
  return (
    <Box display="flex" flexDirection="column">
      <Box
        bgcolor="#121212"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex">
          {[...Array(width).keys()].map((x) => {
            return (
              <Box mx={`${space / 2}rem`}>
                {[...Array(height).keys()].map((y) => (
                  <Square
                    heat={posToHeat(x, y)}
                    scalingFunction={scalingFunction}
                    space={space}
                    setText={setText}
                    name={posToName(x, y)}
                  />
                ))}
              </Box>
            );
          })}
        </Box>
        <Box width="0.1vw" mx="1vw" bgcolor="primary.main" height="20vw"></Box>
        <Box display="flex" flexDirection="column" mx={`${space / 2}rem`}>
          {[...Array(height).keys()].map((x) => (
            <Box>
              <Square
                heat={weights[1 + x]}
                scalingFunction={scalingFunction}
                space={space / 2}
                setText={setText}
                name={feature_names[1 + x]}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box display="flex" mx="1vw" justifyContent="space-between">
        <Typography variant="h7" color="text.secondary">
          {`Model Weights:`}
        </Typography>
        <Typography variant="h7" color="text.hint">
          {`${text}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default Heatmap;
