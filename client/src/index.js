import React from "react";
import ReactDOM from "react-dom";
import { Route, Router } from "react-router-dom";
import { mergeAll, omit, pick } from "ramda";

import history from "./utils/history";
import client from "./utils/client";
// pages
import App from "./pages/App";
import Home from "./pages/Home";

const INITIAL_STATE = {
  gameId: "",
  cards: [],
  started: false,
  isAdmin: false,
  error: "",
};

class AppClient extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    // initialize the clients onmessage
    client.setUpdateFunc(this.handleOnMessage);
  }

  handleOnMessage = (message) => {
    try {
      const data = JSON.parse(message.data);
      console.log("AppClient -> handleOnMessage -> data", data);

      if (data.type === "error") {
        throw new Error(data.message);
      }
      if (data.type === "create") {
        this.setState({ isAdmin: true });
      }
      if (data.type === "join") {
        this.setState({ isAdmin: false });
      }
      if (data.type === "restart") {
        const { cards } = data;

        this.setState({ started: false, cards });
      }

      const gameData = mergeAll([omit(["type"], data), { error: "" }]);

      this.setState((prevState) => ({ ...prevState, ...gameData }));
    } catch (err) {
      this.setState({ error: err, gameId: "" });
    }
  };

  render() {
    const response = pick(["gameId", "error"], this.state);

    return (
      <Router history={history}>
        <Route
          exact
          path="/"
          render={(routeProps) => <Home {...routeProps} response={response} />}
        />
        <Route
          exact
          path="/:gameId"
          render={(routeProps) => <App {...routeProps} {...this.state} />}
        />
      </Router>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <AppClient />
  </React.StrictMode>,
  document.getElementById("root")
);
