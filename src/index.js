import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { mergeAll, omit, isEmpty } from "ramda";

import { websocketUrl_dev as websocketUrl } from "./config";

import App from "./pages/App";
import Home from "./pages/Home";

const INITIAL_GAME_DATA = {
  gameId: "",
  cards: [],
  started: false,
  isAdmin: false,
  error: "",
};

class AppClient extends React.Component {
  state = {
    client: new WebSocket(websocketUrl),
    ...INITIAL_GAME_DATA,
  };

  componentDidMount() {
    const { client } = this.state;
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = this.handleOnMessage;
    client.sendMessage = this.sendMessage;
  }

  sendMessage = (data) => {
    const json = JSON.stringify(data);

    this.state.client.send(json);
  };

  handleOnMessage = (message) => {
    try {
      const data = JSON.parse(message.data);

      if (data.type === "error") {
        throw data.message;
      }
      if (data.type === "create") {
        this.setState({ isAdmin: true });
      }
      const gameData = mergeAll([omit(["type"], data), { error: "" }]);

      this.setState((prevState) => ({ ...prevState, ...gameData }));
    } catch (err) {
      this.setState({ error: err, gameId: "" });
    }
  };

  redirect = (pathname) => {
    this.props.history.push(pathname);
  };

  render() {
    const { client, error, gameId } = this.state;
    const gameData = omit(["client"], this.state);

    const response = { gameId, error };

    return (
      <Router>
        <Route
          exact
          path="/"
          render={(routeProps) => (
            <Home client={client} response={response} {...routeProps} />
          )}
        />
        <Route
          exact
          path="/:gameId"
          render={(routeProps) => (
            <App client={client} {...routeProps} {...gameData} />
          )}
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
