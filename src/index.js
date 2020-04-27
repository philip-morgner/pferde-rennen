import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Websocket from "./websocket";

import App from "./pages/App";
import Home from "./pages/Home";

const appRouter = () => {
  const client = new Websocket();

  return (
    <Router>
      <Route exact path="/" render={() => <Home client={client} />} />
      <Route exact path="/:gameId" render={() => <App client={client} />} />
    </Router>
  );
};

const MyApp = appRouter();

ReactDOM.render(
  <React.StrictMode>
    <MyApp />
  </React.StrictMode>,
  document.getElementById("root")
);
