import React from "react";
import { isEmpty } from "ramda";

import history from "../utils/history";
import client from "../utils/client";

import {
  layout,
  titleStyle,
  buttonStyle,
  buttonInputGroup,
  errorStyle,
} from "../styles";

const INITIAL_STATE = {
  gameId: "",
  error: "",
};

const validate = (gameId, error, prevError) => {
  if (!isEmpty(gameId)) {
    const pathname = "/" + gameId;
    history.push(pathname);
  }
  if (error !== prevError) {
    return { error, gameId: "" };
  }

  return null;
};

class Home extends React.Component {
  state = INITIAL_STATE;

  static getDerivedStateFromProps(props, state) {
    const { gameId, error } = props.response;
    const { error: prevErr } = state;
    return validate(gameId, error, prevErr);
  }

  handleChange = (e) => {
    const gameId = e.target.value;

    this.setState({ gameId });
  };

  handleCreate = () => {
    const data = { type: "create" };

    client.sendMessage(data);
  };

  handleJoin = () => {
    const { gameId } = this.state;
    const data = { type: "join", gameId };
    this.setState({ error: "" });
    console.log("error empty");
    client.sendMessage(data);
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      this.handleJoin();
    }
  };

  render() {
    const { gameId, error } = this.state;

    const hasError = !isEmpty(error);

    return (
      <div className={layout}>
        <h1 className={titleStyle}>Pferderennen</h1>
        <div className={buttonInputGroup}>
          <input
            className={errorStyle(hasError)}
            placeholder={hasError ? error : "Enter game id..."}
            onChange={this.handleChange}
            autoFocus
            value={gameId}
            onKeyPress={this.handleKeyPress}
          />
          <button className={buttonStyle} onClick={this.handleJoin}>
            Join Game
          </button>
          <button className={buttonStyle} onClick={this.handleCreate}>
            Create Game
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
