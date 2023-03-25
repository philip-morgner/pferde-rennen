import React from "react";
import { isEmpty } from "ramda";
import { css } from "emotion";
import { raceTrackLength } from "../config";

import history from "../utils/history";
import client from "../utils/client";

const layout = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  padding: "0 32px",
  maxWidth: `${raceTrackLength * 85}px`,
};

const buttonStyle = {
  display: "flex",
  backgroundColor: "#F39C12",
  border: "1px solid #F39C12",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  height: "32px",
  color: "white",
  cursor: "pointer",
  ":disabled": {
    color: "white",
    backgroundColor: "#F8C471",
    border: "1px solid #F8C471",
  },
};

const titleStyle = {
  margin: "28px auto",
};

const buttonInputGroup = {
  display: "flex",
  justifyContent: "center",
  height: "32px",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
  "& input": {
    paddingLeft: 10,
    fontSize: "55%",
  },
  "& button": {
    // remove box shadow
    boxShadow: "0px 0px rgba(0, 0, 0, 0.2) !important",
  },
};

const getErrorStyle = (hasError) =>
  css(
    hasError && {
      border: "1px solid #E74C3C",
      "&::placeholder": {
        color: "#E74C3C",
        opacity: 1,
      },
    }
  );

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
      <div className={css(layout)}>
        <h1 className={css(titleStyle)}>Pferderennen</h1>
        <button className={css(buttonStyle)} onClick={this.handleCreate}>
          Neues Spiel erstellen
        </button>
        <p>Oder</p>
        <div className={css(buttonInputGroup)}>
          <input
            className={getErrorStyle(hasError)}
            placeholder={hasError ? error : "Enter game id..."}
            onChange={this.handleChange}
            autoFocus
            value={gameId}
            onKeyPress={this.handleKeyPress}
          />
          <button className={css(buttonStyle)} onClick={this.handleJoin}>
            Beitreten
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
