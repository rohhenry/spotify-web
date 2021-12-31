import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
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
    primary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#19144",
      contrastText: "#  ",
    },
    secondary: {
      main: "#191414",
      light: "#242526",
    },
    tertiary: {
      light: "#1ed760",
      main: "#1DB954",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

export default theme;
