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
import { horses, raceTrackLength, icons } from "./config";

const INITIAL_STATE = {
  horses: horses.reduce((obj, horse) => ({ ...obj, [horse]: 0 }), {}),
  shownSidecards: [],
  winner: false,
  intervalId: null,
  count: 0,
};

class Game extends React.Component {
  state = INITIAL_STATE;

  static getDerivedStateFromProps(props, state) {
    if (state.winner && !props.started) {
      return INITIAL_STATE;
    }
    return null;
  }

  componentDidUpdate() {
    const { started } = this.props;
    const { intervalId } = this.state;

    if (started && isNil(intervalId)) {
      this.start();
    }

    this.checkSidecard();
  }

  componentWillUnmount() {
    this.end();
  }

  start = () => {
    const intervalId = setInterval(this.increaseHorsePos, 500);

    this.setState({ intervalId });
  };

  end = () => {
    clearInterval(this.state.intervalId);
  };

  takeCard = () => {
    const { cards } = this.props;
    const { count } = this.state;

    return cards[count];
  };

  increaseHorsePos = () => {
    const card = this.takeCard();

    this.update(card);
  };

  update = (horse) => {
    this.setState((prevState) => {
      const pos = prevState.horses[horse] + 1;

      return {
        horses: {
          ...prevState.horses,
          [horse]: pos,
        },
        count: prevState.count + 1,
        winner: pos === raceTrackLength,
      };
    });
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
          count: prevState.count + 1,
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
        <img src={icons[value]} alt={value} />
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
        {horses[horse] === col ? <img src={icons[horse]} alt={horse} /> : null}
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
    const { isAdmin, start, restart, leave } = this.props;
    const { winner } = this.state;

    if (winner) {
      this.end();
    }

    return (
      <div className={gameLayout}>
        <div className={raceTrack}>
          {this.renderSidecards()}
          {this.renderRaceTrack()}
        </div>
        <div className={centeredStyle}>
          <button className={buttonStyle} onClick={leave}>
            Zurück
          </button>
          {isAdmin &&
            (winner ? (
              <button className={buttonStyle} onClick={restart}>
                Neues Rennen
              </button>
            ) : (
              <button className={buttonStyle} onClick={start}>
                Start
              </button>
            ))}
        </div>
      </div>
    );
  }
}

export default Game;
