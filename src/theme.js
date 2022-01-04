import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "Comic Sans",
      "Montserrat",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    type: "light",
    primary: {
      main: "#1DB954",
      light: "#1ed760",
      contrastText: "#ffffff",
    },

    background: {
      default: "#000000",
      paper: "#212121",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cbcbcb",
      disabled: "#ffffff",
      hint: "#ffffff",
    },
    secondary: {
      main: "#212121",
      light: "#535353",
      dark: "#121212",
    },
  },
  components: {
    // Name of the component
    // MuiBox: {
    //   styleOverrides: {
    //     // Name of the slot
    //     root: {
    //       // Some CSS
    //       fontSize: "1rem",
    //     },
    //   },
    // },
    // MuiToggleButton: {
    //   styleOverrides: {
    //     root: {
    //       color: "primary",
    //     },
    //   },
    // },
    // MuiToggleButtonGroup: {
    //   styleOverrides: {
    //     root: {
    //       color: "primary",
    //     },
    //   },
    // },
  },
});

export default theme;
