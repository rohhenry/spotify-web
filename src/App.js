import { ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Recommender from "./Recommender";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import backend from "./backend";

function App() {
  const [token, setToken] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const uid = queryParams.get("userId");
  const [userId, _] = useState(uid);

  console.log("userId: ", userId);
  useEffect(() => {
    userId && backend.getToken(userId).then((token) => setToken(token));
  }, [userId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {token === "" ? (
        <Login />
      ) : (
        <Recommender userId={userId} token={token} setToken={setToken} />
      )}
    </ThemeProvider>
  );
}

export default App;
