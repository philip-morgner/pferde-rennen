import React from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { omit, isEmpty } from "ramda";
import {
  layout,
  titleStyle,
  linksStyle,
  buttonStyle,
  buttonInputGroup,
  errorStyle,
} from "./styles";
import Game from "./Game";
import { websocketUrl_dev } from "./config";

const client = new WebSocket(websocketUrl_dev);

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
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "error") {
        this.setState({ error: data.message, gameId: "" });
        return;
      }
      if (data.type === "create") {
        this.setState({ isAdmin: true });
      }
      const state = omit(["type"], data);
      this.setState({ ...state, error: "" });
    };
  }

  handleStart = () => {
    const { gameId } = this.state;
    const data = { type: "start", gameId };

    sendMessage(data);
  };

  handleChange = (e) => {
    const gameId = e.target.value;

    this.setState({ gameId });
  };

  handleCreate = async () => {
    const data = { type: "create" };

    sendMessage(data);
  };

  handleJoin = async () => {
    const { gameId } = this.state;
    const data = { type: "join", gameId };

    sendMessage(data);
  };

  renderCreateJoinGame = () => {
    const { error, gameId } = this.state;
    const hasError = !isEmpty(error);

    return (
      <div className={buttonInputGroup}>
        <input
          className={errorStyle(hasError)}
          placeholder={hasError ? error : "Enter game id..."}
          onChange={this.handleChange}
          autoFocus
          value={gameId}
        />
        <button className={buttonStyle} onClick={this.handleJoin}>
          Join Game
        </button>
        <button className={buttonStyle} onClick={this.handleCreate}>
          Create Game
        </button>
      </div>
    );
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

    const preparing = isEmpty(cards);

    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        {preparing ? (
          this.renderCreateJoinGame()
        ) : (
          <React.Fragment>
            <h4>Game Id: {gameId}</h4>
            <Game
              cards={cards}
              start={this.handleStart}
              started={started}
              isAdmin={isAdmin}
            />
            {this.renderIconCreadits()}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
