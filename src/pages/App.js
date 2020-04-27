import React from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { omit } from "ramda";
import { layout, titleStyle, linksStyle } from "../styles";
import Game from "../Game";
import { websocketUrl_dev as websocketUrl } from "../config";

const client = new WebSocket(websocketUrl);

const sendMessage = (data) => {
  const json = JSON.stringify(data);
  client.send(json);
};

const INITIAL_STATE = {
  gameId: "",
  cards: [],
  isAdmin: false,
  started: false,
  error: "",
};

class App extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    const state = this.props.client.getState();

    this.setState(state);
  }

  handleStart = () => {
    const { gameId } = this.props.params.match;
    console.log(
      "App -> handleStart ->  this.props.params.match",
      this.props.params.match
    );
    const data = { type: "start", gameId };

    sendMessage(data);
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
    const { cards, gameId, isAdmin, started } = this.state;

    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        <h4>Game Id: {gameId}</h4>
        <Game
          cards={cards}
          start={this.handleStart}
          started={started}
          isAdmin={isAdmin}
        />
        {this.renderIconCreadits()}
      </div>
    );
  }
}

export default App;
