import React from "react";
import { Redirect } from "react-router-dom";
import { isEmpty } from "ramda";

import { layout, titleStyle } from "../styles";
import Game from "../Game";
import IconCredits from "./IconCredits";

import client from "../utils/client";
import history from "../utils/history";

class App extends React.Component {
  handleStart = (gameId) => () => {
    const data = { type: "start", gameId };

    client.sendMessage(data);
  };

  handleRestart = (gameId) => () => {
    const data = { type: "restart", gameId };

    client.sendMessage(data);
  };

  handleLeave = (gameId) => () => {
    client.sendMessage({ type: "leave", gameId });

    history.replace("/");
  };

  render() {
    const { cards, gameId, isAdmin, started } = this.props;

    if (isEmpty(gameId)) {
      return <Redirect replace to="/" />;
    }

    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        <h4>Game Id: {gameId}</h4>
        <Game
          cards={cards}
          start={this.handleStart(gameId)}
          restart={this.handleRestart(gameId)}
          leave={this.handleLeave(gameId)}
          started={started}
          isAdmin={isAdmin}
        />
        <IconCredits />
      </div>
    );
  }
}

export default App;
