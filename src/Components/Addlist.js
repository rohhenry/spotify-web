import React from "react";
import {
  Button,
  Box,
  Typography,
  ListItem,
  List,
  ListItemButton,
  Paper,
} from "@mui/material";

const Addlist = ({ tracks }) => {
  return (
    <Box
      bgcolor="background.default"
      width="20%"
      display="flex"
      flexDirection="column"
      pt="4vh"
      px="2vh"
      pb="2vh"
    >
      <Box display="flex" flexDirection="column" mb="10%">
        <Typography variant="h4">Added Tracks</Typography>
      </Box>
      <Box flexGrow={1} sx={{ maxHeight: "100%", overflow: "auto" }} mb="2vh">
        <Paper elevation={0}>
          <List>
            {tracks.map((track, i) => (
              <ListItem disablePadding>
                <ListItemButton>
                  <Box display="flex" alignItems="center">
                    <Box width="2vw" mr="1vw">
                      <Typography color="text.secondary" align="right">
                        {i + 1}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                      flexGrow={1}
                    >
                      <Typography color="text.primary" textAlign="left">
                        {track.name}
                      </Typography>
                      <Typography color="text.secondary" textAlign="left">
                        {track.artists.replace(/[\[\]']/g, "")}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Button variant="contained">Export</Button>
    </Box>
  );
};

export default Addlist;
