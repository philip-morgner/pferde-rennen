import React from "react";
import { Link, Redirect } from "react-router-dom";
import { isEmpty } from "ramda";

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

class App extends React.Component {
  state = INITIAL_STATE;

  componentDidUpdate() {
    const {
      response: { error, gameId },
      history,
    } = this.props;

    const { error: prevErr } = this.state;

    if (!isEmpty(gameId)) {
      const pathname = "/" + gameId;
      history.push(pathname);
    }
    if (!isEmpty(error) && isEmpty(prevErr)) {
      this.setState({ error });
    }
  }

  handleChange = (e) => {
    const gameId = e.target.value;

    this.setState({ gameId });
  };

  handleCreate = () => {
    const { client } = this.props;
    const data = { type: "create" };

    client.sendMessage(data);
  };

  handleJoin = () => {
    const { client } = this.props;
    const { gameId } = this.state;
    const data = { type: "join", gameId };

    client.sendMessage(data);
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

export default App;
