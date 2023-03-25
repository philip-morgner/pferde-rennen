import React from "react";
import { Redirect } from "react-router-dom";
import { isEmpty } from "ramda";

import { layout, titleStyle } from "../styles";
import { title } from "../config";
import Game from "../components/Game";
import IconCredits from "../components/IconCredits";

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
    console.log("leave");
    client.sendMessage({ type: "leave", gameId });

    history.replace("/");
  };

  render() {
    const { cards, gameId, isAdmin, started } = this.props;

    if (isEmpty(gameId)) {
      return <Redirect replace to="/" />;
    }

    const subtitle = `Game Id: ${gameId}`;

    return (
      <div className={layout}>
        <h1 className={titleStyle}>{title}</h1>
        <h4>{subtitle}</h4>
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
