import React from "react";

import { layout, titleStyle, linksStyle } from "../styles";
import Game from "../Game";

class App extends React.Component {
  handleStart = (client, gameId) => () => {
    const data = { type: "start", gameId };

    client.sendMessage(data);
  };

  handleRestart = (client, gameId) => () => {
    const data = { type: "restart", gameId };
    console.log("restart", data);

    client.sendMessage(data);
  };

  handleLeave = (client, gameId) => () => {
    console.log("leave", gameId);
    this.props.history.goBack();
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
    const { client, cards, gameId, isAdmin, started } = this.props;

    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        <h4>Game Id: {gameId}</h4>
        <Game
          cards={cards}
          start={this.handleStart(client, gameId)}
          restart={this.handleStart(client, gameId)}
          leave={this.handleLeave(client, gameId)}
          started={started}
          isAdmin={isAdmin}
        />
        {this.renderIconCreadits()}
      </div>
    );
  }
}

export default App;
