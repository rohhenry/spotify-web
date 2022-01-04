import { ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Recommender from "./Recommender";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import backend from "./server";
import spotifyApi from "./spotify";

function App() {
  const [token, setToken] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const uid = queryParams.get("userId");
  const [userId, _] = useState(uid);
  const [loading, setLoading] = useState(false);

  console.log("userId: ", userId);
  useEffect(() => {
    if (userId) {
      setLoading(true);
      backend.getToken(userId).then((token) => {
        console.log(token);
        if (token) {
          spotifyApi.setAccessToken(token);
          setToken(token);
        }
        setLoading(false);
      });
    }
  }, [userId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!token ? (
        <Login loading={loading} setLoading={setLoading} />
      ) : (
        <Recommender userId={userId} token={token} setToken={setToken} />
      )}
    </ThemeProvider>
  );
}

export default App;
