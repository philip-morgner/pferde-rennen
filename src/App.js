import React from "react";
import { isEmpty, times } from "ramda";
import { layout, raceTrack, grid, sidecardStyle } from "./styles";
import { HORSES, pickRandomHorse, winnerNote, newGame } from "./utils";

const RACE_TRACK_LENGTH = 6;

const INITIAL_STATE = {
  horses: HORSES.reduce((obj, horse) => ({ ...obj, [horse]: 0 }), {}),
  shownSidecards: [],
  winner: "",
  intervalId: null,
};

class App extends React.Component {
  state = INITIAL_STATE;

  startGame = () => {
    const intervalId = setInterval(this.increaseRandomHorsePos, 500);
    this.setState({ intervalId });
  };

  restart = () => {
    clearInterval(this.state.intervalId);
    this.setState({ ...INITIAL_STATE });
    newGame();
  };

  update = (horse, n) => {
    this.setState(({ horses: prevStateHorses }) => {
      const pos = prevStateHorses[horse] + n;

      return {
        horses: {
          ...prevStateHorses,
          [horse]: pos,
        },
        winner: pos === RACE_TRACK_LENGTH ? horse : "",
      };
    }, this.validate);
  };

  increaseRandomHorsePos = () => {
    const randomHorse = pickRandomHorse();

    this.update(randomHorse, 1);
  };

  validate = () => {
    const { horses, shownSidecards } = this.state;
    const showSidecard = Object.values(horses).every(
      (horse) => horse > shownSidecards.length
    );

    if (showSidecard) {
      this.setState((prevState) => {
        const randomHorse = pickRandomHorse();
        const shownSidecards = prevState.shownSidecards.concat(randomHorse);

        return {
          shownSidecards,
          horses: {
            ...prevState.horses,
            [randomHorse]: prevState.horses[randomHorse] - 1,
          },
        };
      });
    }
  };

  renderSidecard = (i) => {
    const { shownSidecards } = this.state;
    const show = shownSidecards.length > i;
    let value = "";

    if (show) {
      value = shownSidecards[i];
    }

    return (
      <div key={i} className={sidecardStyle(show, i)}>
        {value}
      </div>
    );
  };

  renderCell = (horse, row) => (col) => {
    const { horses } = this.state;

    return (
      <div key={`${row}-${col}`} className={grid(row, col + 1)}>
        {horses[horse] === col ? horse : null}
      </div>
    );
  };

  renderLane = (horse, row) => {
    return times(this.renderCell(horse, row), RACE_TRACK_LENGTH);
  };

  render() {
    const { winner } = this.state;

    const weGotAWinner = !isEmpty(winner);

    if (weGotAWinner) {
      clearInterval(this.state.intervalId);
    }

    return (
      <div className={layout}>
        <h1>Pferderennen</h1>
        <button disabled={!isEmpty(winner)} onClick={this.startGame}>
          Start
        </button>
        <div className={raceTrack}>
          {times(this.renderSidecard, RACE_TRACK_LENGTH - 1)}
          {HORSES.map((horse, row) => this.renderLane(horse, row + 2))}
        </div>
        {weGotAWinner && (
          <div>
            <h3>{winnerNote(winner)}</h3>
            <button onClick={this.restart}>Neues Rennen</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
