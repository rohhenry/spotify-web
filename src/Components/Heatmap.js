import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { max, min } from "lodash";

const Square = ({ label, heat, scalingFunction, space }) => {
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
        backgroundColor: `rgba(30, 215, 96, ${scalingFunction(heat)})`,
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
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
  return (
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
                  heat={weights[1 + x + x + y]}
                  scalingFunction={scalingFunction}
                  space={space}
                />
              ))}
            </Box>
          );
        })}
      </Box>
      <Box width="0.1vw" mx="1vw" bgcolor="primary.main" height="34vh"></Box>
      <Box display="flex" flexDirection="column" mx={`${space / 2}rem`}>
        {[...Array(width).keys()].map((x) => (
          <Box>
            <Square
              heat={weights[1 + x]}
              scalingFunction={scalingFunction}
              space={space / 2}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Heatmap;
