import React from "react";
import { Link } from "react-router-dom";
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
  cards: [],
  isAdmin: false,
  started: false,
  error: "",
};

class App extends React.Component {
  state = INITIAL_STATE;

  // think about it
  // probably this function will not always be invoked, thus not updating the state
  // probably it is possible when client is passed as prop -> change in props lead to rerender
  componentDidMount() {
    const state = this.props.client.getState();

    this.setState(state);
  }

  componentDidUpdate() {
    const state = this.props.client.getState();

    this.setState(state);
  }

  handleStart = () => {
    const { client } = this.props;
    const { gameId } = this.state;
    const data = { type: "start", gameId };

    client.sendMessage(data);
  };

  handleChange = (e) => {
    const gameId = e.target.value;

    this.setState({ gameId });
  };

  handleCreate = async () => {
    const { client } = this.props;
    const data = { type: "create" };

    client.sendMessage(data);
  };

  handleJoin = async () => {
    const { client } = this.props;
    const { gameId } = this.state;
    const data = { type: "join", gameId };

    client.sendMessage(data);
  };

  renderCreateButton = () => (
    <button className={buttonStyle} onClick={this.handleCreate}>
      Create Game
    </button>
  );

  renderJoinButton = () => (
    <button className={buttonStyle} onClick={this.handleJoin}>
      Join Game
    </button>
  );

  render() {
    const { gameId, error } = this.state;
    const hasError = !isEmpty(error);
    const pathname = "/" + gameId;

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
          <Link
            to={{
              pathname,
              /* actually it shouldnt be necessary to pass the state here */
              state: this.state,
            }}
            component={this.renderJoinButton()}
          ></Link>
          <Link
            to={{
              pathname,
              /* actually it shouldnt be necessary to pass the state here */
              state: this.state,
            }}
            component={this.renderCreateButton()}
          ></Link>
        </div>
      </div>
    );
  }
}

export default App;
