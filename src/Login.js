import React from "react";

console.log(process.env.REACT_APP_BACKEND_URL);
function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="btn-spotify"
          href={`${process.env.REACT_APP_BACKEND_URL}/auth/login`}
        >
          Login with Spotify
        </a>
      </header>
    </div>
  );
}

export default Login;
