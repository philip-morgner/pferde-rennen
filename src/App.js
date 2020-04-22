import React from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { omit } from "ramda";
import { layout, titleStyle, linksStyle, buttonStyle } from "./styles";
import Game from "./Game";
import { websocketUrl } from "./config";

const client = new WebSocket(websocketUrl);

const sendMessage = (data) => {
  const json = JSON.stringify(data);
  client.send(json);
};

const INITIAL_STATE = {
  gameId: undefined,
  cards: [],
  isAdmin: false,
  started: false,
};

class App extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("App -> client.onmessage -> dataFromServer", data);
      if (data.type === "create") {
        this.setState({ isAdmin: true });
      }
      const state = omit(["type"], data);
      this.setState(state);
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
    return (
      <div>
        <button className={buttonStyle} onClick={this.handleCreate}>
          Create Game
        </button>
        <label htmlFor="input">or join an existing game</label>
        <input
          id="input"
          placeholder="Enter game id..."
          onChange={this.handleChange}
        ></input>
        <button className={buttonStyle} onClick={this.handleJoin}>
          Join Game
        </button>
      </div>
    );
  };

  render() {
    const { cards, gameId, isAdmin, started } = this.state;
    console.log("App -> render -> started", started);
    console.log("App -> render -> cards", cards);

    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        {this.renderCreateJoinGame()}
        {isAdmin && <h4>Game Id: {gameId}</h4>}
        <Game
          cards={cards}
          start={this.handleStart}
          started={started}
          isAdmin={isAdmin}
        />
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
      </div>
    );
  }
}

export default App;
