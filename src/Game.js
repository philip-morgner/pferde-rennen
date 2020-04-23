import React from "react";
import { times, isNil } from "ramda";
import {
  raceTrack,
  grid,
  sidecardStyle,
  buttonStyle,
  centeredStyle,
  gameLayout,
} from "./styles";
import { horses, raceTrackLength, symbols } from "./config";

const INITIAL_STATE = {
  horses: horses.reduce((obj, horse) => ({ ...obj, [horse]: 0 }), {}),
  shownSidecards: [],
  winner: false,
  intervalId: null,
  paused: true,
  count: 0,
};

class Game extends React.Component {
  state = INITIAL_STATE;

  componentDidUpdate() {
    const { started } = this.props;
    const { intervalId } = this.state;

    if (started && isNil(intervalId)) {
      this.start();
    }
  }

  start = () => {
    const intervalId = setInterval(this.increaseHorsePos, 500);

    this.setState({ intervalId });
  };

  end = () => {
    clearInterval(this.state.intervalId);
  };

  restart = () => {
    clearInterval(this.state.intervalId);

    this.setState({ ...INITIAL_STATE });
  };

  takeCard = () => {
    const { cards } = this.props;
    const { count } = this.state;

    const first = cards[count];

    this.setState((prevState) => ({ count: prevState.count + 1 }));

    return first;
  };

  increaseHorsePos = () => {
    const card = this.takeCard();

    this.update(card, 1);
  };

  update = (horse, n) => {
    this.setState(({ horses: prevStateHorses }) => {
      const pos = prevStateHorses[horse] + n;

      return {
        horses: {
          ...prevStateHorses,
          [horse]: pos,
        },
        winner: pos === raceTrackLength,
      };
    }, this.checkSidecard);
  };

  checkSidecard = () => {
    const { horses, shownSidecards } = this.state;
    const showSidecard = Object.values(horses).every(
      (horse) => horse > shownSidecards.length
    );

    if (showSidecard) {
      this.setState((prevState) => {
        const card = this.takeCard();
        const shownSidecards = prevState.shownSidecards.concat(card);

        return {
          shownSidecards,
          horses: {
            ...prevState.horses,
            [card]: prevState.horses[card] - 1,
          },
        };
      });
    }
  };

  renderSidecard = (i) => {
    const { shownSidecards } = this.state;
    const show = shownSidecards.length > i;
    let value = "hidden";

    if (show) {
      value = shownSidecards[i];
    }

    return (
      <div key={i} className={sidecardStyle(show, i)}>
        <img src={symbols[value]} alt={value} />
      </div>
    );
  };

  renderSidecards = () => {
    return times(this.renderSidecard, raceTrackLength - 1);
  };

  renderCell = (horse, row) => (col) => {
    const { horses } = this.state;

    return (
      <div key={`${row}-${col}`} className={grid(row + 2, col + 1)}>
        {horses[horse] === col ? (
          <img src={symbols[horse]} alt={horse} />
        ) : null}
      </div>
    );
  };

  renderLane = (horse, row) => {
    return times(this.renderCell(horse, row), raceTrackLength + 1);
  };

  renderRaceTrack = () => {
    return horses.map((horse, row) => this.renderLane(horse, row));
  };

  render() {
    const { isAdmin, start } = this.props;
    const { winner, paused } = this.state;

    if (winner) {
      this.end();
    }

    return (
      <div className={gameLayout}>
        <div className={raceTrack}>
          {this.renderSidecards()}
          {this.renderRaceTrack()}
        </div>
        {isAdmin && (
          <div className={centeredStyle}>
            {winner ? (
              <button className={buttonStyle} onClick={this.restart}>
                Ausgangsposition
              </button>
            ) : (
              <button className={buttonStyle} onClick={start}>
                {paused ? "Start" : "Pause"}
              </button>
            )}
          </div>
        )}
        {winner && (
          <button className={buttonStyle} onClick={window.location.reload}>
            Neues Rennen
          </button>
        )}
      </div>
    );
  }
}

export default Game;
