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
      bgcolor="secondary.main"
      width="25%"
      display="flex"
      flexDirection="column"
      maxHeight="60vh"
      p={2}
    >
      <Box display="flex" flexDirection="column" mb="10%">
        <Typography color="primary" variant="h4" align="center">
          Added Tracks
        </Typography>
      </Box>
      <Box flexGrow={1}>
        <Paper sx={{ maxHeight: "100%", overflow: "auto" }} elevation={0}>
          <List>
            {tracks.map((track, i) => (
              <ListItem>
                <ListItemButton>{i + 1 + ` ` + track.name}</ListItemButton>
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
