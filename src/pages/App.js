import React from "react";
import { Redirect } from "react-router-dom";
import { isEmpty } from "ramda";

import { layout, titleStyle, linksStyle } from "../styles";
import Game from "../Game";

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

  renderIconCreadits = () => {
    return (
      <div className={linksStyle}>
        Icons:
        <a href="https://icons8.com/icon/39707/joker">Joker icon by Icons8</a>
        <a href="https://icons8.com/icon/24740/ace-of-clubs">
          Ace of Clubs icon by Icons8
        </a>
        <a href="https://icons8.com/icon/39682/ace-of-spades">
          Ace of Spades icon by Icons8
        </a>
        <a href="https://icons8.com/icon/39679/ace-of-hearts">
          Ace of Hearts icon by Icons8
        </a>
        <a href="https://icons8.com/icon/39677/ace-of-diamonds">
          Ace of Diamonds icon by Icons8
        </a>
      </div>
    );
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
        {this.renderIconCreadits()}
      </div>
    );
  }
}

export default App;
